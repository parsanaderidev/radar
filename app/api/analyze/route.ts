import { NextResponse } from "next/server";
import { getPocketBaseClient, authenticateSuperuser, type ProductRecord } from "@/lib/pocketbase";
import { evaluateMessageWithLLM } from "@/lib/llm";
import { processSingleMessage } from "@/scripts/worker";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const pb = getPocketBaseClient();
    await authenticateSuperuser(pb);

    const body = await req.json();

    // Case 1: Triage an existing raw_message by ID
    if (body.raw_message_id) {
      const rawMsg = await pb.collection("raw_messages").getOne<any>(body.raw_message_id, {
        expand: "source_id",
      });

      const products = await pb.collection("products").getList<ProductRecord>(1, 1);
      if (products.totalItems === 0) {
        return NextResponse.json({ error: "No product configured" }, { status: 400 });
      }

      const { lead, evalResult } = await processSingleMessage(pb, rawMsg, products.items[0]);
      return NextResponse.json({ success: true, lead, evalResult });
    }

    // Case 2: On-the-fly evaluation of ad-hoc message text
    if (!body.content) {
      return NextResponse.json(
        { error: "Missing 'content' or 'raw_message_id' in request body" },
        { status: 400 }
      );
    }

    let product: ProductRecord;
    if (body.product_id) {
      product = await pb.collection("products").getOne<ProductRecord>(body.product_id);
    } else {
      const products = await pb.collection("products").getList<ProductRecord>(1, 1);
      if (products.totalItems === 0) {
        return NextResponse.json({ error: "No product configured" }, { status: 400 });
      }
      product = products.items[0];
    }

    const evalResult = await evaluateMessageWithLLM({
      content: body.content,
      author_handle: body.author_handle || "@guest_user",
      thread_context: body.thread_context,
      platform: body.platform || "community",
      product,
    });

    return NextResponse.json({
      success: true,
      evaluation: evalResult,
    });
  } catch (err: any) {
    console.error("[API /analyze] Error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to analyze message" },
      { status: 500 }
    );
  }
}
