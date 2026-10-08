import { NextResponse } from "next/server";
import PocketBase from "pocketbase";
import { getPocketBaseUrl, type UserRecord } from "@/lib/pocketbase";
import { formatSessionSetCookie, formatOnboardedSetCookie } from "@/lib/auth";
import { rateLimiter, getClientIp } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const clientIp = getClientIp(req);

  // Rate limit: max 5 registration attempts per 10 minutes per IP
  const rl = rateLimiter.check(`register:${clientIp}`, 5, 10 * 60 * 1000);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "تعداد درخواست‌های ثبت‌نام بیش از حد مجاز است. لطفاً ۱۰ دقیقه دیگر مجدداً تلاش کنید." },
      { status: 429, headers: { "Retry-After": Math.ceil(rl.resetInMs / 1000).toString() } }
    );
  }

  try {
    const body = await req.json();
    const { name, email, password, passwordConfirm } = body || {};

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json({ error: "لطفاً نام و نام‌خانوادگی خود را کامل وارد نمایید (حداقل ۲ کاراکتر)." }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== "string" || !emailRegex.test(email.trim())) {
      return NextResponse.json({ error: "لطفاً یک آدرس ایمیل معتبر وارد نمایید." }, { status: 400 });
    }

    if (!password || typeof password !== "string" || password.length < 8) {
      return NextResponse.json({ error: "رمز عبور باید حداقل ۸ کاراکتر باشد." }, { status: 400 });
    }

    if (password !== passwordConfirm) {
      return NextResponse.json({ error: "تکرار رمز عبور با رمز عبور اصلی مطابقت ندارد." }, { status: 400 });
    }

    const pb = new PocketBase(getPocketBaseUrl());
    const cleanEmail = email.trim().toLowerCase();

    // Create user in PocketBase
    let createdUser: UserRecord;
    try {
      createdUser = await pb.collection("users").create<UserRecord>({
        email: cleanEmail,
        password,
        passwordConfirm,
        name: name.trim(),
        onboarding_completed: false,
        plan: "free",
        has_fetched_initial: false,
      });
    } catch (createErr: any) {
      const errMsg = createErr?.data?.data?.email?.message || createErr?.message || "";
      if (errMsg.toLowerCase().includes("unique") || errMsg.toLowerCase().includes("exist")) {
        return NextResponse.json(
          { error: "این آدرس ایمیل قبلاً در سامانه ثبت‌نام کرده است. لطفاً وارد حساب خود شوید." },
          { status: 400 }
        );
      }
      console.error("[Register API] PocketBase user creation error:", createErr);
      return NextResponse.json(
        { error: "خطا در ایجاد حساب کاربری در سرور. لطفاً مشخصات را بررسی و دوباره تلاش کنید." },
        { status: 400 }
      );
    }

    // Authenticate immediately to obtain auth token
    const authData = await pb.collection("users").authWithPassword(cleanEmail, password);

    // Reset rate limiter on successful registration
    rateLimiter.reset(`register:${clientIp}`);

    const response = NextResponse.json({
      success: true,
      message: "حساب کاربری با موفقیت ایجاد شد.",
      redirect: "/onboarding",
      user: {
        id: authData.record.id,
        email: authData.record.email,
        name: authData.record.name,
        onboarding_completed: false,
      },
      token: authData.token,
    });

    const isProd = process.env.NODE_ENV === "production";
    response.headers.append("Set-Cookie", formatSessionSetCookie(authData.token, isProd));
    response.headers.append("Set-Cookie", formatOnboardedSetCookie(false, isProd));

    return response;
  } catch (err: any) {
    console.error("[Register API] General exception:", err);
    return NextResponse.json(
      { error: "خطایی غیرمنتظره در سرور رخ داد. لطفاً چند لحظه بعد تلاش کنید." },
      { status: 500 }
    );
  }
}
