import { NextResponse } from "next/server";
import { getPocketBaseClient, authenticateSuperuser, type ProductRecord, type LeadRecord } from "@/lib/pocketbase";
import { DEMO_COMMUNITY_MESSAGES } from "@/scripts/seed_demo";
import { triagePendingMessage } from "@/lib/pipeline";
import { getAuthSession } from "@/lib/auth";
import { checkUserPlanLimit } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  // 1. Auth check
  const session = await getAuthSession(req);
  if (!session.isAuthenticated || !session.user) {
    return NextResponse.json(
      { error: "جلسه کاری شما نامعتبر است. لطفاً ابتدا وارد حساب کاربری خود شوید." },
      { status: 401 }
    );
  }

  // 2. Plan rate limit check
  const userPlan = session.user.plan || "free";
  const planCheck = checkUserPlanLimit(session.user.id, userPlan, "initial_fetch");
  if (!planCheck.allowed) {
    return NextResponse.json(
      {
        error: planCheck.errorFa,
        plan: userPlan,
        planNameFa: planCheck.planNameFa,
      },
      { status: 429 }
    );
  }

  try {
    const pb = getPocketBaseClient();
    await authenticateSuperuser(pb);

    // 3. User product resolution
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
        { error: "هیچ شناسنامه محصولی برای حساب شما یافت نشد. لطفاً ابتدا به تنظیمات مراجعه فرمایید." },
        { status: 400 }
      );
    }

    // 4. Sources
    const sources = await pb.collection("sources").getFullList();
    const sourceByPlatform: Record<string, string> = {};
    for (const s of sources) {
      sourceByPlatform[s.platform] = s.id;
    }

    // 5. Select 3 diverse initial messages (high intent, problem-aware, noise)
    const selectedIndices = [0, 5, 10]; // High-intent (#1), Problem-aware (#6), Noise/inquiry (#11)
    const effectiveUserId = session.user.id !== "admin" ? session.user.id : undefined;
    const generatedLeads: LeadRecord[] = [];

    for (const idx of selectedIndices) {
      const msgDef = DEMO_COMMUNITY_MESSAGES[idx] || DEMO_COMMUNITY_MESSAGES[0];
      const sourceId = sourceByPlatform[msgDef.platform] || sources[0]?.id;

      const rawMsgData: any = {
        source_id: sourceId,
        external_id: `init_scan_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
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

      const { lead } = await triagePendingMessage(pb, rawMsg as any, product, effectiveUserId);
      const fullLead = await pb.collection("leads").getOne<LeadRecord>(lead.id, {
        expand: "raw_message_id.source_id,product_id",
      });
      generatedLeads.push(fullLead);
    }

    // 6. Mark user as having fetched initial messages in PocketBase
    if (session.user.id !== "admin") {
      try {
        await pb.collection("users").update(session.user.id, {
          has_fetched_initial: true,
        });
      } catch (uErr) {
        console.warn("[Fetch Initial API] User update warning:", uErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: `${generatedLeads.length} پیام نخستین با موفقیت از کانال‌های بازار واکشی و در پایگاه داده ذخیره شد.`,
      count: generatedLeads.length,
      leads: generatedLeads,
      plan: userPlan,
    });
  } catch (err: any) {
    console.error("[API /leads/fetch-initial] Error:", err);
    return NextResponse.json(
      { error: "خطا در واکشی اولیه پیام‌ها. لطفاً دوباره تلاش کنید." },
      { status: 500 }
    );
  }
}
