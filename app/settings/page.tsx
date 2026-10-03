"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import {
  SettingsIcon,
  CheckCircleIcon,
  RefreshIcon,
  ServerIcon,
  CpuIcon,
  SparklesIcon,
} from "@/components/Icons";
import { getPocketBaseClient, type ProductRecord } from "@/lib/pocketbase";

export default function ProductSettingsPage() {
  const [product, setProduct] = useState<ProductRecord | null>(null);
  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [icp, setIcp] = useState("");
  const [valPropsText, setValPropsText] = useState("");
  const [keywordsText, setKeywordsText] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const pb = getPocketBaseClient();

  useEffect(() => {
    async function loadProduct() {
      try {
        const res = await pb.collection("products").getList<ProductRecord>(1, 1);
        if (res.items.length > 0) {
          const p = res.items[0];
          setProduct(p);
          setName(p.name);
          setTagline(p.tagline || "");
          setDescription(p.description);
          setIcp(p.ideal_customer_profile);
          setValPropsText((p.value_propositions || []).join("\n"));
          setKeywordsText((p.keywords || []).join("، "));
        }
      } catch (err: any) {
        console.error("Error loading product:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadProduct();
  }, [pb]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    setIsSaving(true);
    setStatusMessage(null);

    try {
      const value_propositions = valPropsText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);

      const keywords = keywordsText
        .split(/[,،\n]+/)
        .map((s) => s.trim())
        .filter(Boolean);

      const updated = await pb.collection("products").update<ProductRecord>(product.id, {
        name,
        tagline,
        description,
        ideal_customer_profile: icp,
        value_propositions,
        keywords,
      });

      setProduct(updated);
      setStatusMessage({ text: "تنظیمات محصول و ICP با موفقیت در پایگاه داده ذخیره شد!", type: "success" });
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err: any) {
      console.error("Save error:", err);
      setStatusMessage({ text: `خطا در ذخیره‌سازی: ${err?.message || "مشکلی رخ داد"}`, type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080d16] text-slate-100">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-slate-800 text-slate-300">
              <SettingsIcon className="w-5 h-5 text-emerald-400" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              تنظیمات محصول و پرسونای مشتری (ICP)
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            هوش مصنوعی از اطلاعات این بخش برای ارزیابی سیگنال‌های خرید در جوامع ایرانی، تطبیق نیازها با امکانات محصول و تدوین پاسخ‌های هوشمندانه استفاده می‌کند.
          </p>
        </div>

        {/* Feedback Alert */}
        {statusMessage && (
          <div
            className={`p-3.5 rounded-xl border text-xs sm:text-sm flex items-center gap-2 ${
              statusMessage.type === "success"
                ? "bg-emerald-950/80 border-emerald-500/50 text-emerald-200"
                : "bg-rose-950/80 border-rose-500/50 text-rose-200"
            }`}
          >
            {statusMessage.type === "success" ? (
              <CheckCircleIcon className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <span className="text-rose-400 font-bold">✕</span>
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Form Container */}
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-4 text-slate-400">
            <RefreshIcon className="w-8 h-8 animate-spin text-emerald-400" />
            <p className="text-sm">در حال دریافت تنظیمات از پایگاه داده...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form */}
            <form onSubmit={handleSave} className="lg:col-span-2 space-y-5">
              {/* Product Name */}
              <div className="space-y-1.5 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                <label className="text-xs font-semibold text-slate-200 block">
                  نام محصول / برند تجاری
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: حساب‌آنلاین پارس"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500/60"
                />
              </div>

              {/* Tagline */}
              <div className="space-y-1.5 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                <label className="text-xs font-semibold text-slate-200 block">
                  شعار محوری و پیام اصلی (Tagline)
                </label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="مثال: نرم‌افزار یکپارچه حسابداری ابری و صدور خودکار پیش‌فاکتور ریالی"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500/60"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                <label className="text-xs font-semibold text-slate-200 block">
                  شرح کامل قابلیت‌ها و راهکار محصول
                </label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="توضیح دهید محصول چه مسائلی از کسب‌وکارهای داخل ایران را حل می‌کند..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white leading-relaxed focus:outline-none focus:border-emerald-500/60"
                />
              </div>

              {/* Ideal Customer Profile (ICP) */}
              <div className="space-y-1.5 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                <label className="text-xs font-semibold text-slate-200 block flex items-center justify-between">
                  <span>پرسونای مشتری ایده‌آل (ICP)</span>
                  <span className="text-[11px] text-emerald-400 font-normal">معیار سنجش انطباق سرنخ‌ها</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={icp}
                  onChange={(e) => setIcp(e.target.value)}
                  placeholder="چه افرادی یا شرکت‌هایی بیشترین ارزش را از محصول شما دریافت می‌کنند؟ (مثلاً استارتاپ‌ها، حسابداران، فروشگاه‌های آنلاین)"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white leading-relaxed focus:outline-none focus:border-emerald-500/60"
                />
              </div>

              {/* Value Propositions */}
              <div className="space-y-1.5 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                <label className="text-xs font-semibold text-slate-200 block flex items-center justify-between">
                  <span>ارزش‌های پیشنهادی و مزیت‌های کلیدی (هر سطر یک مورد)</span>
                  <span className="text-[11px] text-slate-400 font-normal">در پیشنهادات پاسخ هوش مصنوعی درج می‌شود</span>
                </label>
                <textarea
                  rows={5}
                  value={valPropsText}
                  onChange={(e) => setValPropsText(e.target.value)}
                  placeholder="سطر اول: اتصال مستقیم به سامانه مودیان&#10;سطر دوم: سرورهای ابری داخل ایران بدون قطعی ناشی از فیلترینگ"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white leading-relaxed focus:outline-none focus:border-emerald-500/60 font-mono text-xs"
                />
              </div>

              {/* Keywords */}
              <div className="space-y-1.5 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                <label className="text-xs font-semibold text-slate-200 block flex items-center justify-between">
                  <span>کلیدواژه‌های رصد در پیام‌رسان‌ها (با ویرگول جدا کنید)</span>
                  <span className="text-[11px] text-slate-400 font-normal">کلمات نشان‌دهنده نیاز یا درد مشتری</span>
                </label>
                <input
                  type="text"
                  value={keywordsText}
                  onChange={(e) => setKeywordsText(e.target.value)}
                  placeholder="حسابداری، سامانه مودیان، پیش‌فاکتور، تحریم نرم‌افزار، تسویه شتاب"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500/60"
                />
              </div>

              {/* Submit CTA */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold shadow-lg shadow-emerald-950/40 transition-all active:scale-95 flex items-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <RefreshIcon className="w-4 h-4 animate-spin" />
                      <span>در حال ذخیره‌سازی...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircleIcon className="w-4 h-4" />
                      <span>ذخیره تغییرات محصول</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Sidebar Environment & Architecture Information */}
            <div className="space-y-4">
              {/* Architecture specs card */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-white font-semibold text-sm">
                  <ServerIcon className="w-4 h-4 text-emerald-400" />
                  <span>معماری بومی & بدون تحریم</span>
                </div>
                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">پایگاه داده:</span>
                    <span className="font-mono text-emerald-400">PocketBase SQLite</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">موقعیت هاست:</span>
                    <span className="text-slate-200">سرور داخلی / Localhost</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">وابستگی خارجی:</span>
                    <span className="text-emerald-400 font-semibold">صفر (Zero Cloud Lock-in)</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">موتور اشتراک زنده:</span>
                    <span className="font-mono text-cyan-400">Server-Sent Events</span>
                  </div>
                </div>
              </div>

              {/* LLM Gateway specs card */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-white font-semibold text-sm">
                  <CpuIcon className="w-4 h-4 text-teal-400" />
                  <span>تنظیمات مدل هوش مصنوعی</span>
                </div>
                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">اندپوینت ورودی:</span>
                    <span className="font-mono text-slate-300 dir-ltr text-[11px]">
                      {process.env.NEXT_PUBLIC_LLM_URL || "LLM_BASE_URL"}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">مدل پیش‌فرض:</span>
                    <span className="font-mono text-amber-400">llama3.1 / qwen2.5</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">حالت رزرو (Fallback):</span>
                    <span className="text-emerald-400">موتور تحلیلی زبان فارسی فعال</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">تعرفه ورودی / خروجی:</span>
                    <span className="font-mono text-slate-300">$0.15 / $0.60 per 1M</span>
                  </div>
                </div>
              </div>

              {/* Prompt engineering tips card */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/30 to-slate-900/60 border border-emerald-900/30 space-y-2.5">
                <div className="flex items-center gap-2 text-emerald-300 font-semibold text-xs">
                  <SparklesIcon className="w-4 h-4 text-emerald-400" />
                  <span>راهنمای بهینه‌سازی پرسونای رادار</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  هر چقدر جزئیات مزیت‌های رقابتی و دردهای مشتریان در پرسونای ICP دقیق‌تر باشد، هوش مصنوعی با دقت بالاتری پیام‌های تصادفی چت‌روم‌ها را از نیازهای خرید تفکیک کرده و پاسخ‌های طبیعی‌تر و اقناع‌کننده‌تری آماده می‌کند.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
