import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { getPocketBaseClient, authenticateSuperuser, type UserRecord } from "@/lib/pocketbase";
import { BOT_HOURLY_LIMITS, getLastBotRunTime } from "@/lib/botScheduler";
import { type PlanKey } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const session = await getAuthSession(req);
  if (!session.isAuthenticated || !session.user) {
    return NextResponse.json({ error: "احراز هویت الزامی است." }, { status: 401 });
  }

  const pb = getPocketBaseClient();
  await authenticateSuperuser(pb);

  let user: UserRecord = session.user as any;
  try {
    if (session.user.id !== "admin") {
      user = await pb.collection("users").getOne<UserRecord>(session.user.id);
    }
  } catch {
    // fallback
  }

  const planKey: PlanKey = (user.plan as PlanKey) || "free";
  const hourlyLimit = BOT_HOURLY_LIMITS[planKey] || BOT_HOURLY_LIMITS.free;

  return NextResponse.json({
    botActive: user.bot_active !== false,
    plan: planKey,
    hourlyLimit,
    lastBotRun: user.last_bot_run || getLastBotRunTime() || null,
  });
}
