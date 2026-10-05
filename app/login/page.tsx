"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { RadarLogo, RefreshIcon } from "@/components/Icons";

export const dynamic = "force-dynamic";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/settings";

  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "رمز عبور نادرست است.");
      }

      router.push(from);
      router.refresh();
    } catch (err: any) {
      setError(err?.message || "خطا در احراز هویت رخ داد.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleLogin}
      className="p-6 rounded-xl bg-[#0a0a0a] border border-[#1f1f1f] shadow-[0_8px_32px_rgba(0,0,0,0.8)] space-y-4"
    >
      {error && (
        <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs text-center font-medium animate-shake">
          {error}
        </div>
      )}

      <div className="space-y-1.5">
        <label htmlFor="admin-password" className="block text-xs font-medium text-neutral-300">
          رمز عبور مدیر سیستم
        </label>
        <input
          id="admin-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••••••••••"
          required
          autoFocus
          className="w-full px-3.5 py-2.5 rounded-lg bg-[#141414] border border-[#262626] text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all dir-ltr"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading || !password}
        className="w-full h-10 rounded-lg bg-white text-black text-xs font-semibold hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm active:scale-[0.99]"
      >
        {isLoading ? (
          <>
            <RefreshIcon className="w-4 h-4 animate-spin" />
            <span>در حال بررسی اعتبار...</span>
          </>
        ) : (
          <span>تأیید و ورود</span>
        )}
      </button>

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
            <h1 className="text-lg font-semibold text-white">ورود به پنل مدیریت رادار</h1>
            <p className="text-xs text-neutral-400">
              جهت دسترسی به تنظیمات محصول و پرسونای مشتری (ICP) رمز عبور مدیر را وارد کنید.
            </p>
          </div>
        </div>

        <Suspense fallback={<div className="text-center text-xs text-neutral-500">در حال بارگذاری...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
