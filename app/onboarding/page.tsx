"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RadarBadge, RefreshIcon, SparklesIcon, CheckIcon } from "@/components/Icons";

export const dynamic = "force-dynamic";

export default function OnboardingPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [icp, setIcp] = useState("");

  const [isLoadingSession, setIsLoadingSession] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check session and prefill existing user name if available
  useEffect(() => {
    async function checkUserSession() {
      try {
        const res = await fetch("/api/auth/session");
        const data = await res.json();

        if (!data.authenticated) {
          window.location.href = "/login?from=/onboarding";
          return;
        }

        if (data.isOnboarded) {
          window.location.href = "/leads";
          return;
        }

        if (data.user?.name) {
          setName(data.user.name);
        }
        if (data.user?.company) {
          setCompany(data.user.company);
        }
        if (data.user?.role) {
          setRole(data.user.role);
        }
        if (data.user?.product_name) {
          setProductName(data.user.product_name);
        }
        if (data.user?.product_description) {
          setProductDescription(data.user.product_description);
        }
        if (data.user?.ideal_customer_profile) {
          setIcp(data.user.ideal_customer_profile);
        }
      } catch (err) {
        console.error("Session check error:", err);
      } finally {
        setIsLoadingSession(false);
      }
    }

    checkUserSession();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!company.trim()) {
      setError("لطفاً نام شرکت یا استارتاپ خود را وارد فرمایید.");
      return;
    }

    if (!role.trim()) {
      setError("لطفاً سمت سازمانی خود را وارد فرمایید.");
      return;
    }

    if (!productName.trim()) {
      setError("لطفاً نام محصول یا خدمت اصلی را وارد نمایید.");
      return;
    }

    if (!productDescription.trim() || productDescription.trim().length < 10) {
      setError("لطفاً شرح ارزش‌آفرینی محصول را کامل‌تر وارد کنید (حداقل ۱۰ کاراکتر).");
      return;
    }

    if (!icp.trim() || icp.trim().length < 10) {
      setError("لطفاً مشخصات مشتری ایده‌آل (ICP) را دقیق‌تر شرح دهید (حداقل ۱۰ کاراکتر).");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          company: company.trim(),
          role: role.trim(),
          product_name: productName.trim(),
          product_description: productDescription.trim(),
          ideal_customer_profile: icp.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "خطا در ثبت اطلاعات آنبوردینگ در دیتابیس.");
      }

      // Hard redirect to leads dashboard after confirmed persistence
      window.location.href = data.redirect || "/leads";
    } catch (err: any) {
      setError(err?.message || "خطا در اتصال به سرور و ذخیره مشخصات.");
      setIsSubmitting(false);
    }
  };

  if (isLoadingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#000000] text-neutral-400 text-xs">
        <div className="flex items-center gap-2">
          <RefreshIcon className="w-4 h-4 animate-spin text-white" />
          <span>در حال بررسی جلسه کاری...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#000000] text-[#ededed] px-4 selection:bg-white selection:text-black relative overflow-hidden py-10 sm:py-16">
      {/* Background ambient glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute inset-0 opacity-[0.14]"
          style={{
            backgroundImage: "radial-gradient(#444 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[450px] vercel-hero-glow blur-[140px] rounded-full pointer-events-none" />
      </div>

      <div className="relative z-10 w-full max-w-[620px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col items-center text-center space-y-3">
          <RadarBadge className="w-12 h-12 rounded-xl shadow-[0_0_30px_rgba(255,255,255,0.25)]" iconClassName="w-6 h-6 text-black" />
          <div className="space-y-1.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              پیکربندی اولیه رادار و مشتری هدف
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto leading-relaxed">
              این اطلاعات جهت کالیبراسیون پایپ‌لاین ۳ لایه هوش مصنوعی، فیلتر هرزنامه‌ها و صید هوشمند لیدهای با قصد خرید بالا استفاده می‌شود.
            </p>
          </div>
        </div>

        {/* Form Box */}
        <div className="rounded-2xl bg-[#090909]/95 border border-[#202020] p-6 sm:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.9)] backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="space-y-5 text-right">
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs text-center font-medium animate-shake leading-relaxed">
                {error}
              </div>
            )}

            {/* بخش ۱: اطلاعات فردی و سازمان */}
            <div className="space-y-3">
              <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>۱. اطلاعات هویتی و کسب‌وکار</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label htmlFor="onb-name" className="block text-xs font-medium text-neutral-300">
                    نام و نام‌خانوادگی
                  </label>
                  <input
                    id="onb-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="مثال: پارسا نادری"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#121212] border border-[#282828] text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all duration-200"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="onb-company" className="block text-xs font-medium text-neutral-300">
                    نام شرکت یا استارتاپ <span className="text-rose-400">*</span>
                  </label>
                  <input
                    id="onb-company"
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="مثال: پارس سیستم"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#121212] border border-[#282828] text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all duration-200"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="onb-role" className="block text-xs font-medium text-neutral-300">
                  سمت شما در سازمان <span className="text-rose-400">*</span>
                </label>
                <input
                  id="onb-role"
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="مثال: مدیر فروش / بنیان‌گذار / کارشناس بازاریابی"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#121212] border border-[#282828] text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all duration-200"
                />
              </div>
            </div>

            {/* بخش ۲: ویژگی‌های محصول */}
            <div className="space-y-3 pt-3 border-t border-[#1a1a1a]">
              <div className="text-xs font-bold text-sky-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                <span>۲. محصول یا خدمت اصلی برای پایش</span>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="onb-product-name" className="block text-xs font-medium text-neutral-300">
                  نام تجاری محصول / نرم‌افزار <span className="text-rose-400">*</span>
                </label>
                <input
                  id="onb-product-name"
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="مثال: سامانه حسابداری ابری پارس"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#121212] border border-[#282828] text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all duration-200"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="onb-desc" className="block text-xs font-medium text-neutral-300">
                  شرح ارزش‌آفرینی محصول و وجه تمایز <span className="text-rose-400">*</span>
                </label>
                <textarea
                  id="onb-desc"
                  rows={3}
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                  placeholder="نرم‌افزار یکپارچه حسابداری ابری و صدور خودکار پیش‌فاکتور، متصل به سامانه مودیان و شبکه بانکی شتاب با سرورهای پرسرعت داخلی بدون اختلال تحریم..."
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#121212] border border-[#282828] text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all duration-200 leading-relaxed resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="onb-icp" className="block text-xs font-medium text-neutral-300">
                  پرسونای مشتری ایده‌آل (ICP) و نیازمندی‌ها <span className="text-rose-400">*</span>
                </label>
                <textarea
                  id="onb-icp"
                  rows={3}
                  value={icp}
                  onChange={(e) => setIcp(e.target.value)}
                  placeholder="استارتاپ‌ها، دفاتر حسابداری، شرکت‌های بازرگانی و فروشگاه‌های آنلاین که از تحریم نرم‌افزارهای خارجی یا پیچیدگی سامانه مودیان شکایت دارند و به دنبال تسویه ریالی هستند..."
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#121212] border border-[#282828] text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all duration-200 leading-relaxed resize-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !company.trim() || !productName.trim() || !productDescription.trim() || !icp.trim()}
              className="w-full h-12 rounded-xl bg-white text-black text-xs sm:text-sm font-bold hover:bg-[#eaeaea] hover:shadow-[0_0_25px_rgba(255,255,255,0.3)] transition-all duration-200 ease-out flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-md active:scale-[0.98] mt-4"
            >
              {isSubmitting ? (
                <>
                  <RefreshIcon className="w-4 h-4 animate-spin text-black" />
                  <span>در حال ذخیره و فعال‌سازی پایپ‌لاین رادار...</span>
                </>
              ) : (
                <>
                  <SparklesIcon className="w-4 h-4 text-black" />
                  <span>تکمیل آنبوردینگ و ورود به صندوق سرنخ‌ها</span>
                </>
              )}
            </button>
          </form>
        </div>

        <div className="text-center text-[11px] text-neutral-600 font-mono">
          Radar AI Onboarding • Zero-leak Domestic Architecture
        </div>
      </div>
    </div>
  );
}
