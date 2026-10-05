import { NextResponse } from "next/server";
import { getAdminPassword, timingSafeEqual, createSessionToken, formatSessionSetCookie } from "@/lib/auth";
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
    const { password } = body || {};

    if (!password || typeof password !== "string" || !password.trim()) {
      return NextResponse.json({ error: "وارد کردن رمز عبور الزامی است." }, { status: 400 });
    }

    const masterPassword = getAdminPassword();
    const isValid = timingSafeEqual(password, masterPassword);

    if (!isValid) {
      return NextResponse.json({ error: "رمز عبور وارد شده نادرست است. لطفاً دوباره بررسی نمایید." }, { status: 401 });
    }

    // Reset rate limiter on successful login
    rateLimiter.reset(`login:${clientIp}`);

    const token = await createSessionToken();
    const cookieHeader = formatSessionSetCookie(token);

    const response = NextResponse.json({ success: true, message: "ورود به سیستم با موفقیت انجام شد." });
    response.headers.set("Set-Cookie", cookieHeader);
    return response;
  } catch (err) {
    console.error("[Auth API] Login exception:", err);
    return NextResponse.json(
      { error: "خطایی در سیستم احراز هویت سرور رخ داد. لطفاً چند لحظه بعد تلاش کنید." },
      { status: 500 }
    );
  }
}

