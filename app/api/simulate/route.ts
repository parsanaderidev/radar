import { NextResponse } from "next/server";
import { getPocketBaseClient, authenticateSuperuser, type ProductRecord } from "@/lib/pocketbase";
import { DEMO_COMMUNITY_MESSAGES } from "@/scripts/seed_demo";
import { processSingleMessage } from "@/scripts/worker";
import { isAuthenticatedRequest } from "@/lib/auth";
import { rateLimiter, getClientIp } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  // 1. Authentication check
  const isAuth = await isAuthenticatedRequest(req);
  if (!isAuth) {
    return NextResponse.json(
      { error: "Unauthorized. Valid session or Bearer API key required." },
      { status: 401 }
    );
  }

  // 2. Rate limiting (max 10 simulate calls per minute per IP)
  const clientIp = getClientIp(req);
  const rl = rateLimiter.check(`simulate:${clientIp}`, 10, 60 * 1000);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Please wait before simulating more messages." },
      {
        status: 429,
        headers: { "Retry-After": Math.ceil(rl.resetInMs / 1000).toString() },
      }
    );
  }

  try {
    const pb = getPocketBaseClient();
    await authenticateSuperuser(pb);

    // Get product
    const products = await pb.collection("products").getList<ProductRecord>(1, 1);
    if (products.totalItems === 0) {
      return NextResponse.json(
        { error: "No product configured in database. Run pocketbase/setup_schema.ts first." },
        { status: 400 }
      );
    }
    const product = products.items[0];

    // Get sources
    const sources = await pb.collection("sources").getFullList();
    const sourceByPlatform: Record<string, string> = {};
    for (const s of sources) {
      sourceByPlatform[s.platform] = s.id;
    }

    let body: any = {};
    try {
      body = await req.json();
    } catch {}

    const randomIndex = Math.floor(Math.random() * DEMO_COMMUNITY_MESSAGES.length);
    const chosenIndex =
      typeof body.index === "number" && Number.isInteger(body.index)
        ? Math.abs(body.index) % DEMO_COMMUNITY_MESSAGES.length
        : randomIndex;
    const msgDef = DEMO_COMMUNITY_MESSAGES[chosenIndex];

    const sourceId = sourceByPlatform[msgDef.platform] || sources[0]?.id;

    // Create raw message
    const rawMsg = await pb.collection("raw_messages").create<any>({
      source_id: sourceId,
      external_id: `live_sim_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      author_handle: msgDef.author_handle,
      content: msgDef.content,
      thread_context: msgDef.thread_context || "",
      posted_at: new Date().toISOString(),
      status: "pending",
    });

    // Ingest & evaluate immediately
    const { lead, evalResult } = await processSingleMessage(pb, rawMsg as any, product);

    // Expand lead relations for immediate UI consumption
    const fullLead = await pb.collection("leads").getOne(lead.id, {
      expand: "raw_message_id.source_id,product_id",
    });

    return NextResponse.json({
      success: true,
      message: "Simulated message triaged successfully",
      lead: fullLead,
      evalResult,
    });
  } catch (err: any) {
    console.error("[API /simulate] Error:", err);
    return NextResponse.json(
      { error: "Failed to simulate community message. Please check server logs." },
      { status: 500 }
    );
  }
}
