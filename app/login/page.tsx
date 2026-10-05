"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { RadarLogo, RefreshIcon, EyeIcon, EyeOffIcon, SparklesIcon, CheckCircleIcon } from "@/components/Icons";

export const dynamic = "force-dynamic";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/settings";

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const defaultAdminPass = "RadarSecure123456!";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError("لطفاً ابتدا رمز عبور مدیریت را وارد نمایید.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: password.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "رمز عبور وارد شده نادرست است.");
      }

      // Hard redirect to target destination ensuring session cookie is applied
      window.location.href = from;
    } catch (err: any) {
      setError(err?.message || "خطا در برقراری ارتباط با سرور رخ داد. لطفاً مجدداً تلاش فرمایید.");
      setIsLoading(false);
    }
  };

  const handleQuickFill = () => {
    setPassword(defaultAdminPass);
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(defaultAdminPass).catch(() => {});
    }
    setCopied(true);
    setError(null);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <form
      onSubmit={handleLogin}
      className="p-6 rounded-xl bg-[#0a0a0a] border border-[#1f1f1f] shadow-[0_8px_32px_rgba(0,0,0,0.8)] space-y-4 text-right"
    >
      {error && (
        <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs text-center font-medium animate-shake">
          {error}
        </div>
      )}

      <div className="space-y-1.5">
        <label htmlFor="admin-password" className="block text-xs font-medium text-neutral-300">
          رمز عبور مدیریت سیستم
        </label>
        <div className="relative flex items-center">
          <input
            id="admin-password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="رمز عبور مدیر را وارد کنید"
            required
            autoFocus
            autoComplete="current-password"
            className="w-full pl-10 pr-3.5 py-2.5 rounded-lg bg-[#141414] border border-[#262626] text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all dir-ltr text-left"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute left-2.5 p-1 rounded text-neutral-400 hover:text-white transition-colors cursor-pointer"
            title={showPassword ? "مخفی‌سازی رمز عبور" : "نمایش رمز عبور"}
            aria-label={showPassword ? "مخفی‌سازی رمز عبور" : "نمایش رمز عبور"}
          >
            {showPassword ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading || !password.trim()}
        className="w-full h-10 rounded-lg bg-white text-black text-xs font-semibold hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm active:scale-[0.99]"
      >
        {isLoading ? (
          <>
            <RefreshIcon className="w-4 h-4 animate-spin" />
            <span>در حال بررسی و احراز هویت...</span>
          </>
        ) : (
          <span>تأیید و ورود به تنظیمات</span>
        )}
      </button>

      {/* Admin Credential Helper Card in Persian */}
      <div className="p-3 rounded-lg bg-[#0d0d0d] border border-[#222222] text-[11px] text-neutral-400 space-y-1.5">
        <div className="flex items-center justify-between text-neutral-300 font-medium">
          <div className="flex items-center gap-1.5">
            <SparklesIcon className="w-3.5 h-3.5 text-neutral-400" />
            <span>رمز عبور پیش‌فرض مدیر:</span>
          </div>
          {copied && (
            <span className="text-[10px] text-[#00e599] flex items-center gap-1">
              <CheckCircleIcon className="w-3 h-3 text-[#00e599]" />
              <span>درج شد</span>
            </span>
          )}
        </div>
        <div className="flex items-center justify-between gap-2 p-1.5 rounded bg-black/60 border border-[#1f1f1f]">
          <span className="font-mono text-xs text-neutral-200 dir-ltr select-all">
            {defaultAdminPass}
          </span>
          <button
            type="button"
            onClick={handleQuickFill}
            className="text-[10px] text-neutral-300 hover:text-white px-2 py-0.5 rounded bg-[#1e1e1e] hover:bg-[#2e2e2e] transition-colors cursor-pointer"
          >
            درج خودکار
          </button>
        </div>
      </div>

      <div className="pt-2 text-center">
        <Link
          href="/"
          className="text-xs text-neutral-400 hover:text-neutral-200 transition-colors inline-flex items-center gap-1"
        >
          <span>بازگشت به صندوق سرنخ‌ها</span>
          <span className="text-neutral-600">←</span>
        </Link>
      </div>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#000000] text-[#ededed] px-4 selection:bg-white selection:text-black">
      <div className="w-full max-w-sm space-y-6">
        {/* Brand / Logo */}
        <div className="flex flex-col items-center text-center space-y-3">
          <Link href="/" className="flex items-center gap-2.5 group cursor-pointer">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white text-black transition-transform duration-200 group-hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
              <RadarLogo className="w-5 h-5 text-black" />
            </div>
          </Link>
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-neutral-800 bg-neutral-900/60 text-[11px] text-neutral-400 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00e599]" />
              <span>احراز هویت مدیر سیستم</span>
            </div>
            <h1 className="text-base sm:text-lg font-semibold text-white">
              ورود به تنظیمات محصول و پرسونای مشتری (ICP)
            </h1>
            <p className="text-xs text-neutral-400 leading-relaxed">
              جهت ویرایش مشخصات محصول، کلمات کلیدی رصد و تنظیمات پرسونای خریدار ایده‌آل رمز عبور مدیریت را وارد نمایید.
            </p>
          </div>
        </div>

        <Suspense fallback={<div className="text-center text-xs text-neutral-500">در حال بارگذاری فرم ورود...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
