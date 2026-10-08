import { NextResponse } from "next/server";
import { getPocketBaseClient, authenticateSuperuser, type ProductRecord } from "@/lib/pocketbase";
import { triageAdHocMessage, triagePendingMessage } from "@/lib/pipeline";
import { isAuthenticatedRequest } from "@/lib/auth";
import { validateAnalyzeInput } from "@/lib/validation";
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

  // 2. Rate limiting (15 requests/min per IP)
  const clientIp = getClientIp(req);
  const rl = rateLimiter.check(`analyze:${clientIp}`, 15, 60 * 1000);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Please wait before analyzing more messages." },
      {
        status: 429,
        headers: { "Retry-After": Math.ceil(rl.resetInMs / 1000).toString() },
      }
    );
  }

  try {
    let rawBody: any;
    try {
      rawBody = await req.json();
    } catch {
      return NextResponse.json({ error: "Malformed JSON payload." }, { status: 400 });
    }

    // 3. Runtime input validation
    const validation = validateAnalyzeInput(rawBody);
    if (!validation.success || !validation.data) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.errors },
        { status: 400 }
      );
    }

    const { raw_message_id, content, author_handle, thread_context, platform, product_id } =
      validation.data;

    const pb = getPocketBaseClient();
    await authenticateSuperuser(pb);

    // Case 1: Triage an existing raw_message by ID
    if (raw_message_id) {
      let rawMsg: any;
      try {
        rawMsg = await pb.collection("raw_messages").getOne<any>(raw_message_id, {
          expand: "source_id",
        });
      } catch {
        return NextResponse.json({ error: "Raw message not found." }, { status: 404 });
      }

      const products = await pb.collection("products").getList<ProductRecord>(1, 1);
      if (products.totalItems === 0) {
        return NextResponse.json({ error: "No product configured in database." }, { status: 400 });
      }

      const { lead, evalResult, layer } = await triagePendingMessage(pb, rawMsg, products.items[0]);
      return NextResponse.json({ success: true, layer, lead, evalResult });
    }

    // Case 2: On-the-fly evaluation of ad-hoc message text
    if (!content) {
      return NextResponse.json(
        { error: "Missing 'content' or 'raw_message_id' in request body." },
        { status: 400 }
      );
    }

    let product: ProductRecord;
    if (product_id) {
      try {
        product = await pb.collection("products").getOne<ProductRecord>(product_id);
      } catch {
        return NextResponse.json({ error: "Specified product not found." }, { status: 404 });
      }
    } else {
      const products = await pb.collection("products").getList<ProductRecord>(1, 1);
      if (products.totalItems === 0) {
        return NextResponse.json({ error: "No product configured in database." }, { status: 400 });
      }
      product = products.items[0];
    }

    const { evalResult, layer } = await triageAdHocMessage({
      content,
      author_handle,
      thread_context,
      platform,
      product,
    });

    return NextResponse.json({
      success: true,
      layer,
      evaluation: evalResult,
    });
  } catch (err: any) {
    console.error("[API /analyze] Processing exception:", err);
    return NextResponse.json(
      { error: "An error occurred while evaluating the message. Please try again." },
      { status: 500 }
    );
  }
}
