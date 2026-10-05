import PocketBase from "pocketbase";
import { evaluateMessageWithLLM } from "../lib/llm";
import { formatUsd } from "../lib/pricing";
import type { ProductRecord, RawMessageRecord } from "../lib/pocketbase";

const PB_URL = process.env.POCKETBASE_URL || "http://127.0.0.1:8090";
const ADMIN_EMAIL = process.env.POCKETBASE_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.POCKETBASE_ADMIN_PASSWORD;

export async function processSingleMessage(
  pb: PocketBase,
  rawMsg: RawMessageRecord,
  product: ProductRecord
) {
  try {
    const platform = (rawMsg as any).expand?.source_id?.platform || "community";
    const evalResult = await evaluateMessageWithLLM({
      content: rawMsg.content,
      author_handle: rawMsg.author_handle,
      thread_context: rawMsg.thread_context,
      platform,
      product,
    });

    // Write lead
    const lead = await pb.collection("leads").create({
      raw_message_id: rawMsg.id,
      product_id: product.id,
      intent_score: evalResult.intent_score,
      intent_level: evalResult.intent_level,
      reasoning: evalResult.reasoning,
      matched_feature: evalResult.matched_feature || "",
      suggested_reply: evalResult.suggested_reply || "",
      input_tokens: evalResult.input_tokens,
      output_tokens: evalResult.output_tokens,
      estimated_cost_usd: evalResult.estimated_cost_usd,
      lead_status: "new",
    });

    // Update raw message status
    await pb.collection("raw_messages").update(rawMsg.id, {
      status: "processed",
    });

    const levelColor =
      evalResult.intent_level === "high_intent"
        ? "\x1b[32m[HIGH INTENT]\x1b[0m"
        : evalResult.intent_level === "problem_aware"
        ? "\x1b[33m[PROBLEM AWARE]\x1b[0m"
        : evalResult.intent_level === "curious"
        ? "\x1b[36m[CURIOUS]\x1b[0m"
        : "\x1b[90m[IRRELEVANT/NOISE]\x1b[0m";

    console.log(
      `✓ Processed msg ${rawMsg.id} | ${levelColor} score: ${evalResult.intent_score} | spend: ${formatUsd(
        evalResult.estimated_cost_usd
      )} | author: ${rawMsg.author_handle}`
    );

    return { lead, evalResult };
  } catch (err: any) {
    console.error(`✗ Error processing message ${rawMsg.id}:`, err?.message || err);
    try {
      await pb.collection("raw_messages").update(rawMsg.id, {
        status: "error",
      });
    } catch {}
    throw err;
  }
}

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
  let totalSpend = 0;

  for (const msg of pendingMessages) {
    const res = await processSingleMessage(pb, msg, product);
    totalSpend += res.evalResult.estimated_cost_usd;
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
  console.log(`   - Total Processing Cost: ${formatUsd(totalSpend)}`);
  console.log("=======================================================\n");
}

if ((import.meta as any).main) {
  runTriageWorker().catch((err) => {
    console.error("[Triage Worker] Fatal Error:", err);
    process.exit(1);
  });
}
