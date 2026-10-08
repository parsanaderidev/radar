import { NextResponse } from "next/server";
import { getAuthSession, isAuthenticatedRequest } from "@/lib/auth";
import { runHarvesterBot, getLastBotRunTime } from "@/lib/botScheduler";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  // Allow if authorized via session or Bearer API key / admin password
  const isAuth = await isAuthenticatedRequest(req);
  const session = await getAuthSession(req);

  if (!isAuth && !session.isAuthenticated) {
    return NextResponse.json(
      { error: "دسترسی غیرمجاز. احراز هویت لازم است." },
      { status: 401 }
    );
  }

  try {
    const summary = await runHarvesterBot();
    return NextResponse.json({
      success: true,
      message: "چرخه اسکن خودکار با موفقیت اجرا شد و پیام‌های جدید در پاکت‌بیس ثبت شدند.",
      summary,
    });
  } catch (err: any) {
    console.error("[API /bot/cron] Error executing harvester bot:", err);
    return NextResponse.json(
      { error: "خطا در اجرای بات اسکنر خودکار.", details: err?.message },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  const session = await getAuthSession(req);
  return NextResponse.json({
    active: true,
    lastRun: getLastBotRunTime(),
    authenticated: session.isAuthenticated,
  });
}
