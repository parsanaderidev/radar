"use client";

import React, { useState } from "react";
import Link from "next/link";
import { RadarBadge, RefreshIcon, EyeIcon, EyeOffIcon, SparklesIcon, CheckIcon } from "@/components/Icons";

export const dynamic = "force-dynamic";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || name.trim().length < 2) {
      setError("لطفاً نام و نام‌خانوادگی خود را کامل وارد نمایید.");
      return;
    }

    if (!email.trim() || !email.includes("@")) {
      setError("لطفاً یک آدرس ایمیل معتبر وارد کنید.");
      return;
    }

    if (password.length < 8) {
      setError("رمز عبور باید حداقل ۸ کاراکتر باشد.");
      return;
    }

    if (password !== passwordConfirm) {
      setError("تکرار رمز عبور با رمز عبور اصلی مطابقت ندارد.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
          passwordConfirm,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "خطا در ثبت‌نام حساب کاربری.");
      }

      if (data.token) {
        try {
          localStorage.setItem("radar_session", data.token);
        } catch {}
      }

      // Hard redirect ensuring new session cookies are received by browser
      window.location.href = data.redirect || "/onboarding";
    } catch (err: any) {
      setError(err?.message || "خطا در برقراری ارتباط با سرور.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#000000] text-[#ededed] px-4 selection:bg-white selection:text-black relative overflow-hidden py-12">
      {/* Background ambient glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute inset-0 opacity-[0.14]"
          style={{
            backgroundImage: "radial-gradient(#444 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] vercel-hero-glow blur-[130px] rounded-full pointer-events-none" />
      </div>

      <div className="relative z-10 w-full max-w-[440px] space-y-6">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-3">
          <Link href="/" className="inline-flex items-center gap-2 group cursor-pointer focus:outline-none">
            <RadarBadge className="w-10 h-10 rounded-xl shadow-[0_0_25px_rgba(255,255,255,0.2)]" iconClassName="w-5 h-5 text-black" />
          </Link>
          <div className="space-y-1">
            <h1 className="text-xl font-bold text-white tracking-tight">ایجاد حساب در رادار</h1>
            <p className="text-xs text-neutral-400">
              دسترسی به پایپ‌لاین ۳ لایه هوشمندی و کشف لیدهای داغ
            </p>
          </div>
        </div>

        {/* Form Container */}
        <div className="rounded-2xl bg-[#090909]/90 border border-[#202020] p-6 sm:p-7 shadow-[0_20px_60px_rgba(0,0,0,0.9)] backdrop-blur-xl">
          <form onSubmit={handleRegister} className="space-y-4 text-right">
            {error && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs text-center font-medium animate-shake leading-relaxed">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label htmlFor="reg-name" className="block text-xs font-medium text-neutral-300">
                نام و نام‌خانوادگی
              </label>
              <input
                id="reg-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="مثال: پارسا نادری"
                required
                autoFocus
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#121212] border border-[#282828] text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all duration-200"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="reg-email" className="block text-xs font-medium text-neutral-300">
                ایمیل کاری یا سازمانی
              </label>
              <input
                id="reg-email"
                dir="ltr"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="founder@company.ir"
                required
                autoComplete="email"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#121212] border border-[#282828] text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all duration-200 [direction:ltr] text-left"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="reg-password" className="block text-xs font-medium text-neutral-300">
                رمز عبور (حداقل ۸ کاراکتر)
              </label>
              <div className="relative flex items-center">
                <input
                  id="reg-password"
                  dir="ltr"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="new-password"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#121212] border border-[#282828] text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all duration-200 [direction:ltr] text-left"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-2.5 p-1 rounded-lg text-neutral-400 hover:text-white transition-colors duration-200 cursor-pointer"
                  title={showPassword ? "مخفی‌سازی رمز عبور" : "نمایش رمز عبور"}
                  aria-label={showPassword ? "مخفی‌سازی رمز عبور" : "نمایش رمز عبور"}
                >
                  {showPassword ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="reg-password-confirm" className="block text-xs font-medium text-neutral-300">
                تکرار رمز عبور
              </label>
              <div className="relative flex items-center">
                <input
                  id="reg-password-confirm"
                  dir="ltr"
                  type={showConfirmPassword ? "text" : "password"}
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="new-password"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#121212] border border-[#282828] text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all duration-200 [direction:ltr] text-left"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute left-2.5 p-1 rounded-lg text-neutral-400 hover:text-white transition-colors duration-200 cursor-pointer"
                  title={showConfirmPassword ? "مخفی‌سازی تکرار رمز عبور" : "نمایش تکرار رمز عبور"}
                  aria-label={showConfirmPassword ? "مخفی‌سازی تکرار رمز عبور" : "نمایش تکرار رمز عبور"}
                >
                  {showConfirmPassword ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !name.trim() || !email.trim() || password.length < 8}
              className="w-full h-11 rounded-xl bg-white text-black text-xs font-bold hover:bg-[#e8e8e8] hover:shadow-[0_0_20px_rgba(255,255,255,0.25)] transition-all duration-200 ease-out flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm active:scale-[0.98] mt-2"
            >
              {isLoading ? (
                <>
                  <RefreshIcon className="w-4 h-4 animate-spin text-black" />
                  <span>در حال ایجاد حساب کاربری...</span>
                </>
              ) : (
                <>
                  <SparklesIcon className="w-4 h-4 text-black" />
                  <span>ثبت‌نام و ورود به مرحله آنبوردینگ</span>
                </>
              )}
            </button>

            <div className="pt-3 border-t border-[#181818] flex items-center justify-between text-xs text-neutral-400">
              <Link
                href="/login"
                className="text-neutral-300 hover:text-white transition-colors inline-flex items-center gap-1 font-medium"
              >
                <span>قبلاً ثبت‌نام کرده‌اید؟ ورود</span>
                <span>←</span>
              </Link>
              <Link
                href="/"
                className="hover:text-white transition-colors"
              >
                معرفی رادار
              </Link>
            </div>
          </form>
        </div>

        {/* Footer Attribution */}
        <div className="text-center text-[11px] text-neutral-600 font-mono">
          © 2026 PriCoders Radar Engine
        </div>
      </div>
    </div>
  );
}
