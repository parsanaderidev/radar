import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { getPocketBaseClient, authenticateSuperuser, type UserRecord } from "@/lib/pocketbase";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const session = await getAuthSession(req);
  if (!session.isAuthenticated || !session.user) {
    return NextResponse.json({ error: "احراز هویت الزامی است." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const active = typeof body.active === "boolean" ? body.active : true;

    if (session.user.id !== "admin") {
      const pb = getPocketBaseClient();
      await authenticateSuperuser(pb);

      const updated = await pb.collection("users").update<UserRecord>(session.user.id, {
        bot_active: active,
      });

      return NextResponse.json({
        success: true,
        botActive: updated.bot_active !== false,
        message: active
          ? "بات اسکنر ساعتی با موفقیت فعال شد."
          : "بات اسکنر ساعتی موقتاً متوقف گردید.",
      });
    }

    return NextResponse.json({
      success: true,
      botActive: active,
      message: "تنظیمات بات برای مدیر اعمال گردید.",
    });
  } catch (err: any) {
    console.error("[API /bot/toggle] Error updating bot status:", err);
    return NextResponse.json(
      { error: "خطا در تغییر وضعیت بات در پایگاه داده." },
      { status: 500 }
    );
  }
}
