import { NextResponse } from "next/server";
import { getPocketBaseClient, authenticateSuperuser, type LeadRecord } from "@/lib/pocketbase";
import { validateLeadStatusInput } from "@/lib/validation";
import { rateLimiter, getClientIp } from "@/lib/rateLimit";
import { getAuthSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const clientIp = getClientIp(req);

  // Rate limit: max 60 updates per minute per IP
  const rl = rateLimiter.check(`lead-status:${clientIp}`, 60, 60 * 1000);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "تعداد درخواست‌ها بیش از حد مجاز است. لطفاً کمی صبر کنید." },
      { status: 429, headers: { "Retry-After": Math.ceil(rl.resetInMs / 1000).toString() } }
    );
  }

  try {
    const rawBody = await req.json();
    const validation = validateLeadStatusInput(rawBody);

    if (!validation.success || !validation.data) {
      return NextResponse.json(
        { error: "داده‌های ورودی نامعتبر است.", details: validation.errors },
        { status: 400 }
      );
    }

    const { leadId, status, notes } = validation.data;

    const pb = getPocketBaseClient();
    await authenticateSuperuser(pb);

    // Multi-tenant check: if user is logged in and not admin, ensure lead belongs to user
    const session = await getAuthSession(req);
    if (session.isAuthenticated && session.user && !session.isAdmin) {
      try {
        const existingLead = await pb.collection("leads").getOne<LeadRecord>(leadId);
        if (existingLead.user_id && existingLead.user_id !== session.user.id) {
          return NextResponse.json(
            { error: "شما به این داده دسترسی ندارید." },
            { status: 403 }
          );
        }
      } catch {
        return NextResponse.json({ error: "سرنخ یافت نشد." }, { status: 404 });
      }
    }

    const updatePayload: Record<string, any> = {
      lead_status: status,
    };
    if (notes !== undefined) {
      updatePayload.notes = notes;
    }

    const updated = await pb.collection("leads").update<LeadRecord>(leadId, updatePayload);

    return NextResponse.json({
      success: true,
      message: "تغییرات با موفقیت در پایگاه داده ذخیره شد.",
      lead: updated,
    });
  } catch (err: any) {
    console.error("[API /leads/status] Update error:", err);
    return NextResponse.json(
      { error: "خطا در به‌روزرسانی وضعیت در دیتابیس." },
      { status: 500 }
    );
  }
}

