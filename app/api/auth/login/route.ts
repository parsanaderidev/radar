import { NextResponse } from "next/server";
import PocketBase from "pocketbase";
import { getPocketBaseUrl, type UserRecord } from "@/lib/pocketbase";
import {
  getAdminPassword,
  timingSafeEqual,
  createSessionToken,
  formatSessionSetCookie,
  formatOnboardedSetCookie,
} from "@/lib/auth";
import { rateLimiter, getClientIp } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const clientIp = getClientIp(req);

  // Rate limit: max 5 login attempts per 5 minutes per IP
  const rl = rateLimiter.check(`login:${clientIp}`, 5, 5 * 60 * 1000);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "تعداد دفعات ورود ناموفق بیش از حد مجاز است. لطفاً ۵ دقیقه دیگر مجدداً تلاش کنید." },
      {
        status: 429,
        headers: { "Retry-After": Math.ceil(rl.resetInMs / 1000).toString() },
      }
    );
  }

  try {
    const body = await req.json();
    const { email, password } = body || {};

    if (!password || typeof password !== "string" || !password.trim()) {
      return NextResponse.json({ error: "وارد کردن رمز عبور الزامی است." }, { status: 400 });
    }

    const isProd = process.env.NODE_ENV === "production";

    // 1. If email is provided, perform PocketBase user authentication
    if (email && typeof email === "string" && email.trim()) {
      const cleanEmail = email.trim().toLowerCase();
      const pb = new PocketBase(getPocketBaseUrl());

      try {
        const authData = await pb.collection("users").authWithPassword<UserRecord>(cleanEmail, password);
        const user = authData.record;
        const isOnboarded = !!user.onboarding_completed;

        rateLimiter.reset(`login:${clientIp}`);

        const response = NextResponse.json({
          success: true,
          message: "ورود با موفقیت انجام شد.",
          onboarding_completed: isOnboarded,
          redirect: isOnboarded ? "/leads" : "/onboarding",
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            company: user.company,
            role: user.role,
            onboarding_completed: isOnboarded,
          },
          token: authData.token,
        });

        response.headers.append("Set-Cookie", formatSessionSetCookie(authData.token, isProd));
        response.headers.append("Set-Cookie", formatOnboardedSetCookie(isOnboarded, isProd));
        return response;
      } catch (authErr: any) {
        return NextResponse.json(
          { error: "ایمیل یا رمز عبور وارد شده نادرست است. لطفاً مجدداً بررسی فرمایید." },
          { status: 401 }
        );
      }
    }

    // 2. Fallback: Admin password check (e.g. BuildX or configured RADAR_ADMIN_PASSWORD)
    const masterPassword = getAdminPassword();
    const isValidAdmin =
      timingSafeEqual(password, masterPassword) || timingSafeEqual(password, "BuildX");

    if (!isValidAdmin) {
      return NextResponse.json(
        { error: "رمز عبور یا اطلاعات کاربری نادرست است. لطفاً ایمیل و رمز خود را وارد کنید." },
        { status: 401 }
      );
    }

    rateLimiter.reset(`login:${clientIp}`);

    const adminToken = await createSessionToken();
    const response = NextResponse.json({
      success: true,
      message: "ورود مدیر ارشد با موفقیت انجام شد.",
      onboarding_completed: true,
      redirect: "/leads",
      token: adminToken,
      user: {
        id: "admin",
        email: "admin@radar.local",
        name: "مدیر ارشد سیستم",
        onboarding_completed: true,
      },
    });

    response.headers.append("Set-Cookie", formatSessionSetCookie(adminToken, isProd));
    response.headers.append("Set-Cookie", formatOnboardedSetCookie(true, isProd));
    return response;
  } catch (err) {
    console.error("[Auth API] Login exception:", err);
    return NextResponse.json(
      { error: "خطایی در سیستم احراز هویت سرور رخ داد. لطفاً چند لحظه بعد تلاش کنید." },
      { status: 500 }
    );
  }
}
