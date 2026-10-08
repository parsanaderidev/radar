import PocketBase from "pocketbase";
import { triagePendingMessage } from "../lib/pipeline";
import { formatUsd } from "../lib/pricing";
import type { ProductRecord, RawMessageRecord } from "../lib/pocketbase";

// Re-exported for backward compatibility (routes import from lib/pipeline).
export { processSingleMessage } from "../lib/pipeline";

const PB_URL = process.env.POCKETBASE_URL || "http://127.0.0.1:8090";
const ADMIN_EMAIL = process.env.POCKETBASE_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.POCKETBASE_ADMIN_PASSWORD;

export async function runTriageWorker() {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error(
      "❌ [Triage Worker Error] POCKETBASE_ADMIN_EMAIL and POCKETBASE_ADMIN_PASSWORD must be configured in environment."
    );
    process.exit(1);
  }

  console.log(`[Triage Worker] Initializing connection to ${PB_URL}...`);
  const pb = new PocketBase(PB_URL);

  // Superuser auth
  try {
    if (pb.collection("_superusers") && typeof pb.collection("_superusers").authWithPassword === "function") {
      await pb.collection("_superusers").authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
    } else if (pb.admins) {
      await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
    }
    console.log("[Triage Worker] Authenticated with PocketBase.");
  } catch (err: any) {
    console.error("[Triage Worker] Superuser authentication failed:", err?.message || err);
    process.exit(1);
  }

  // Get active product
  const products = await pb.collection("products").getList<ProductRecord>(1, 1);
  if (products.totalItems === 0) {
    console.error("[Triage Worker] No product found in database. Run 'bun run pocketbase/setup_schema.ts' first.");
    process.exit(1);
  }
  const product = products.items[0];
  console.log(`[Triage Worker] Active Product: "${product.name}"`);

  // Query pending messages
  const pendingMessages = await pb.collection("raw_messages").getFullList<RawMessageRecord>({
    filter: 'status = "pending"',
    expand: "source_id",
    sort: "created",
  });

  console.log(`[Triage Worker] Found ${pendingMessages.length} pending messages to evaluate.\n`);

  let highIntentCount = 0;
  let problemAwareCount = 0;
  let noiseCount = 0;
  let layer0Count = 0;
  let layer1Count = 0;
  let layer2Count = 0;
  let totalSpend = 0;

  for (const msg of pendingMessages) {
    const res = await triagePendingMessage(pb, msg, product);
    totalSpend += res.evalResult.estimated_cost_usd;
    if (res.layer === "layer0") layer0Count++;
    else if (res.layer === "layer1") layer1Count++;
    else layer2Count++;
    if (res.evalResult.intent_level === "high_intent") highIntentCount++;
    else if (res.evalResult.intent_level === "problem_aware") problemAwareCount++;
    else noiseCount++;
  }

  console.log("\n=======================================================");
  console.log("📊 Triage Pipeline Execution Summary:");
  console.log(`   - Evaluated Messages:   ${pendingMessages.length}`);
  console.log(`   - High Intent Leads:    \x1b[32m${highIntentCount}\x1b[0m`);
  console.log(`   - Problem Aware Leads:  \x1b[33m${problemAwareCount}\x1b[0m`);
  console.log(`   - Noise Filtered Out:   \x1b[90m${noiseCount}\x1b[0m`);
  console.log(`   - Layers: L0=${layer0Count} L1=${layer1Count} L2=${layer2Count}`);
  console.log(`   - Total Processing Cost: ${formatUsd(totalSpend)}`);
  console.log("=======================================================\n");
}

if ((import.meta as any).main) {
  runTriageWorker().catch((err) => {
    console.error("[Triage Worker] Fatal Error:", err);
    process.exit(1);
  });
}
