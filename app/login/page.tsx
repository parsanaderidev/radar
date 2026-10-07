"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { RadarLogo, RadarBadge, RefreshIcon, EyeIcon, EyeOffIcon, SparklesIcon } from "@/components/Icons";

export const dynamic = "force-dynamic";

function LoginForm() {
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/dashboard";

  const [password, setPassword] = useState("BuildX");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError("لطفاً رمز عبور را وارد کنید.");
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
        throw new Error(data.error || "رمز عبور نادرست است.");
      }

      // Remember session token in client storage
      if (data.token) {
        try {
          localStorage.setItem("radar_session", data.token);
        } catch {}
      }

      // Hard redirect ensuring 30-day cookie is transmitted cleanly to middleware
      window.location.href = from;
    } catch (err: any) {
      setError(err?.message || "خطا در احراز هویت رخ داد.");
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-2xl bg-[#090909]/90 border border-[#202020] p-6 sm:p-7 shadow-[0_20px_60px_rgba(0,0,0,0.9)] backdrop-blur-xl">
      <form onSubmit={handleLogin} className="space-y-4 text-right">
        {error && (
          <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs text-center font-medium animate-shake">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <label htmlFor="admin-password" className="font-medium text-neutral-300">
              رمز عبور سامانه
            </label>
            <span className="text-[11px] text-neutral-500">
              پیش‌فرض: <span className="font-mono text-emerald-400 select-all">BuildX</span>
            </span>
          </div>

          <div className="relative flex items-center">
            <input
              id="admin-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="BuildX"
              required
              autoFocus
              autoComplete="current-password"
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#121212] border border-[#282828] text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all duration-200 ease-out dir-ltr text-left"
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

        <button
          type="submit"
          disabled={isLoading || !password.trim()}
          className="w-full h-11 rounded-xl bg-white text-black text-xs font-bold hover:bg-[#e8e8e8] hover:shadow-[0_0_20px_rgba(255,255,255,0.25)] transition-all duration-200 ease-out flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm active:scale-[0.98]"
        >
          {isLoading ? (
            <>
              <RefreshIcon className="w-4 h-4 animate-spin text-black" />
              <span>در حال اعتبارسنجی...</span>
            </>
          ) : (
            <>
              <SparklesIcon className="w-4 h-4 text-black" />
              <span>تأیید و ورود به سیستم</span>
            </>
          )}
        </button>

        <div className="pt-2 border-t border-[#181818] flex items-center justify-between text-xs text-neutral-400">
          <Link
            href="/dashboard"
            className="hover:text-white transition-colors inline-flex items-center gap-1"
          >
            <span>ورود به صندوق سرنخ‌ها</span>
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
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#000000] text-[#ededed] px-4 selection:bg-white selection:text-black relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute inset-0 opacity-[0.14]"
          style={{
            backgroundImage: "radial-gradient(#444 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] vercel-hero-glow blur-[120px] rounded-full pointer-events-none" />
      </div>

      <div className="relative z-10 w-full max-w-[400px] space-y-6">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-3">
          <Link href="/" className="inline-flex items-center gap-2 group cursor-pointer focus:outline-none">
            <RadarBadge className="w-10 h-10 rounded-xl shadow-[0_0_25px_rgba(255,255,255,0.2)]" iconClassName="w-5 h-5 text-black" />
          </Link>
          <div className="space-y-1">
            <h1 className="text-xl font-bold text-white tracking-tight">ورود به سامانه رادار</h1>
            <p className="text-xs text-neutral-400">
              موتور هوشمندی کشف فرصت‌های فروش • <span className="font-mono text-neutral-300">PriCoders</span>
            </p>
          </div>
        </div>

        {/* Form Container */}
        <Suspense fallback={<div className="text-center text-xs text-neutral-500">در حال بارگذاری...</div>}>
          <LoginForm />
        </Suspense>

        {/* Footer Attribution */}
        <div className="text-center text-[11px] text-neutral-600 font-mono">
          © 2026 PriCoders Radar Engine
        </div>
      </div>
    </div>
  );
}
