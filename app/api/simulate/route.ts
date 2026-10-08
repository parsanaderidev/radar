import { NextResponse } from "next/server";
import { getPocketBaseClient, authenticateSuperuser, type ProductRecord } from "@/lib/pocketbase";
import { DEMO_COMMUNITY_MESSAGES } from "@/scripts/seed_demo";
import { triagePendingMessage } from "@/lib/pipeline";
import { getAuthSession } from "@/lib/auth";
import { checkUserPlanLimit, rateLimiter, getClientIp } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  // 1. Authentication check
  const session = await getAuthSession(req);
  if (!session.isAuthenticated || !session.user) {
    return NextResponse.json(
      { error: "جلسه کاری شما نامعتبر است. لطفاً ابتدا وارد حساب کاربری خود شوید." },
      { status: 401 }
    );
  }

  // 2. Plan-based rate limiting & daily quota check
  const userPlan = session.user.plan || "free";
  const planCheck = checkUserPlanLimit(session.user.id, userPlan, "simulate");
  if (!planCheck.allowed) {
    return NextResponse.json(
      {
        error: planCheck.errorFa,
        plan: userPlan,
        planNameFa: planCheck.planNameFa,
        remainingMinute: planCheck.remainingMinute,
        remainingDaily: planCheck.remainingDaily,
      },
      {
        status: 429,
        headers: {
          "Retry-After": planCheck.resetInMs ? Math.ceil(planCheck.resetInMs / 1000).toString() : "60",
          "X-User-Plan": userPlan,
        },
      }
    );
  }

  // Secondary IP sliding guard (max 30 requests/min per IP)
  const clientIp = getClientIp(req);
  const ipCheck = rateLimiter.check(`simulate-ip:${clientIp}`, 30, 60 * 1000);
  if (!ipCheck.allowed) {
    return NextResponse.json(
      { error: "تعداد درخواست‌ها بیش از حد مجاز است. لطفاً کمی بعد تلاش کنید." },
      { status: 429 }
    );
  }

  try {
    const pb = getPocketBaseClient();
    await authenticateSuperuser(pb);

    // 3. User-isolated product resolution:
    // First try user's own product; if none, fall back to system product
    let product: ProductRecord | null = null;
    if (session.user.product_id) {
      try {
        product = await pb.collection("products").getOne<ProductRecord>(session.user.product_id);
      } catch {}
    }
    if (!product && session.user.id !== "admin") {
      try {
        product = await pb
          .collection("products")
          .getFirstListItem<ProductRecord>(`user_id = "${session.user.id}"`);
      } catch {}
    }
    if (!product) {
      const products = await pb.collection("products").getList<ProductRecord>(1, 1);
      if (products.totalItems > 0) {
        product = products.items[0];
      }
    }

    if (!product) {
      return NextResponse.json(
        { error: "هیچ شناسنامه محصولی در سامانه یافت نشد. لطفاً در صفحه تنظیمات محصول خود را مشخص فرمایید." },
        { status: 400 }
      );
    }

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

    // Create raw message with user isolation
    const effectiveUserId = session.user.id !== "admin" ? session.user.id : undefined;
    const rawMsgData: any = {
      source_id: sourceId,
      external_id: `live_sim_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      author_handle: msgDef.author_handle,
      content: msgDef.content,
      thread_context: msgDef.thread_context || "",
      posted_at: new Date().toISOString(),
      status: "pending",
    };
    if (effectiveUserId) {
      rawMsgData.user_id = effectiveUserId;
    }

    const rawMsg = await pb.collection("raw_messages").create<any>(rawMsgData);

    // Ingest & evaluate immediately with user scoping
    const { lead, evalResult, layer } = await triagePendingMessage(
      pb,
      rawMsg as any,
      product,
      effectiveUserId
    );

    // Expand lead relations for immediate UI consumption
    const fullLead = await pb.collection("leads").getOne(lead.id, {
      expand: "raw_message_id.source_id,product_id",
    });

    return NextResponse.json({
      success: true,
      message: "پیام جدید با موفقیت دریافت و ارزیابی شد.",
      layer,
      lead: fullLead,
      evalResult,
      plan: userPlan,
      remainingDaily: planCheck.remainingDaily,
    });
  } catch (err: any) {
    console.error("[API /simulate] Error:", err);
    return NextResponse.json(
      { error: "Failed to simulate community message. Please check server logs." },
      { status: 500 }
    );
  }
}
