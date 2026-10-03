"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import {
  CheckCircleIcon,
  RefreshIcon,
  ServerIcon,
  CpuIcon,
  SparklesIcon,
  RadarLogo,
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
      setStatusMessage({ text: "تغییرات با موفقیت در دیتابیس پاکت‌بیس ذخیره شد.", type: "success" });
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err: any) {
      console.error("Save error:", err);
      setStatusMessage({ text: `خطا در ذخیره‌سازی: ${err?.message || "مشکلی رخ داد"}`, type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#000000] text-[#ededed]">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Header */}
        <div className="border-b border-dotted border-[#2a2a2a] pb-5 flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-white tracking-normal">
                تنظیمات محصول & ICP
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-medium border border-dotted border-[#333333] bg-[#0d0d0d] text-neutral-400">
                پیکربندی هسته رادار
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              مشخصات محصول و پرسونای خریدار ایده‌آل (ICP) جهت تفکیک هوشمند سیگنال‌های خرید از نویز شبکه‌های اجتماعی
            </p>
          </div>
          <div className="hidden sm:flex items-center justify-center w-9 h-9 rounded-lg bg-[#0d0d0d] border border-dotted border-[#333333] text-neutral-300 shadow-sm">
            <RadarLogo className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Feedback Alert */}
        {statusMessage && (
          <div
            className={`p-3.5 rounded-lg border border-dotted text-xs flex items-center gap-2.5 transition-all ${
              statusMessage.type === "success"
                ? "bg-[#061a12] border-[#00e599]/50 text-[#00e599]"
                : "bg-[#1f0a0a] border-red-500/50 text-red-400"
            }`}
          >
            {statusMessage.type === "success" ? (
              <CheckCircleIcon className="w-4 h-4 text-[#00e599] shrink-0" />
            ) : (
              <span className="text-red-400 font-bold shrink-0">✕</span>
            )}
            <span className="font-medium">{statusMessage.text}</span>
          </div>
        )}

        {isLoading ? (
          <div className="py-24 rounded-xl border border-dotted border-[#222222] bg-[#080808] flex flex-col items-center justify-center space-y-3 text-neutral-500 text-xs">
            <RefreshIcon className="w-5 h-5 animate-spin text-neutral-400" />
            <span>در حال بارگذاری تنظیمات از پایگاه داده...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form */}
            <form onSubmit={handleSave} className="lg:col-span-2 space-y-6">
              {/* Card 1: Product Identity */}
              <div className="rounded-xl bg-[#0a0a0a] border border-dotted border-[#2e2e2e] hover:border-[#3e3e3e] transition-colors overflow-hidden">
                <div className="p-5 space-y-4">
                  <div className="border-b border-dotted border-[#1f1f1f] pb-3">
                    <h2 className="text-sm font-semibold text-neutral-100 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-white"></span>
                      هویت و مشخصات محصول
                    </h2>
                    <p className="text-xs text-neutral-400 mt-1">
                      نام تجاری و شعار محوری جهت معرفی در پاسخ‌های پیشنهادی رادار به مشتری
                    </p>
                  </div>

                  <div className="space-y-4 pt-1">
                    <div>
                      <label className="text-xs font-medium text-neutral-300 block mb-1.5">
                        نام تجاری محصول
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="مثال: حساب‌آنلاین پارس"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#000000] border border-dotted border-[#333333] text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-solid focus:border-white transition-all"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-neutral-300 block mb-1.5">
                        شعار محوری (Tagline)
                      </label>
                      <input
                        type="text"
                        value={tagline}
                        onChange={(e) => setTagline(e.target.value)}
                        placeholder="مثال: نرم‌افزار یکپارچه حسابداری ابری و صدور پیش‌فاکتور ریالی"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#000000] border border-dotted border-[#333333] text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-solid focus:border-white transition-all"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-neutral-300 block mb-1.5">
                        شرح قابلیت‌ها و مزایای محصول
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="توضیح دهید محصول شما چه کاری انجام می‌دهد و چه مشکلی از کسب‌وکارها حل می‌کند..."
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#000000] border border-dotted border-[#333333] text-sm text-white placeholder-neutral-600 leading-relaxed focus:outline-none focus:border-solid focus:border-white transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: ICP & Target Signals */}
              <div className="rounded-xl bg-[#0a0a0a] border border-dotted border-[#2e2e2e] hover:border-[#3e3e3e] transition-colors overflow-hidden">
                <div className="p-5 space-y-4">
                  <div className="border-b border-dotted border-[#1f1f1f] pb-3">
                    <h2 className="text-sm font-semibold text-neutral-100 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#00e599]"></span>
                      پرسونای مشتری ایده‌آل (ICP) و کلیدواژه‌ها
                    </h2>
                    <p className="text-xs text-neutral-400 mt-1">
                      تعریف پرسونای خریداران هدف برای آموزش پرامپت و تفکیک لیدهای معتبر از نویز
                    </p>
                  </div>

                  <div className="space-y-4 pt-1">
                    <div>
                      <label className="text-xs font-medium text-neutral-300 block mb-1.5">
                        پرسونای خریدار هدف (Ideal Customer Profile)
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={icp}
                        onChange={(e) => setIcp(e.target.value)}
                        placeholder="استارتاپ‌ها، شرکت‌های بازرگانی و فروشگاه‌های آنلاین فعال در ایران..."
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#000000] border border-dotted border-[#333333] text-sm text-white placeholder-neutral-600 leading-relaxed focus:outline-none focus:border-solid focus:border-white transition-all"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-neutral-300 block mb-1.5">
                        ارزش‌های پیشنهادی و تمایزهای کلیدی (هر سطر یک مورد)
                      </label>
                      <textarea
                        rows={4}
                        value={valPropsText}
                        onChange={(e) => setValPropsText(e.target.value)}
                        placeholder="بدون نیاز به کارتخوان اختصاصی&#10;پشتیبانی از گزارش‌های مالیاتی فصلی&#10;اتصال مستقیم به درگاه‌های پرداخت شتاب"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#000000] border border-dotted border-[#333333] text-sm text-neutral-200 placeholder-neutral-600 leading-relaxed focus:outline-none focus:border-solid focus:border-white transition-all"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-neutral-300 block mb-1.5">
                        کلیدواژه‌های رصد در پیام‌رسان‌ها (با کاما یا ویرگول جدا کنید)
                      </label>
                      <input
                        type="text"
                        value={keywordsText}
                        onChange={(e) => setKeywordsText(e.target.value)}
                        placeholder="نرم افزار حسابداری, فاکتور آنلاین, اظهارنامه, حقوق دستمزد"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#000000] border border-dotted border-[#333333] text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-solid focus:border-white transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="px-5 py-4 bg-[#070707] border-t border-dotted border-[#262626] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <span className="text-xs text-neutral-500">
                    ذخیره‌سازی پایدار و بلادرنگ در پایگاه داده پاکت‌بیس (SQLite محلی)
                  </span>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="h-9 px-5 rounded-lg bg-white text-black hover:bg-neutral-200 text-xs font-medium transition-all active:scale-95 flex items-center gap-2 border border-transparent shadow-sm disabled:opacity-50"
                  >
                    {isSaving ? (
                      <>
                        <RefreshIcon className="w-3.5 h-3.5 animate-spin" />
                        <span>در حال ذخیره...</span>
                      </>
                    ) : (
                      <span>ذخیره تغییرات</span>
                    )}
                  </button>
                </div>
              </div>
            </form>

            {/* Sidebar Specifications */}
            <div className="space-y-5">
              {/* Architecture specs card */}
              <div className="p-5 rounded-xl bg-[#0a0a0a] border border-dotted border-[#2e2e2e] hover:border-[#3e3e3e] transition-colors space-y-3.5">
                <div className="flex items-center gap-2 text-white font-medium text-xs pb-1 border-b border-dotted border-[#1f1f1f]">
                  <ServerIcon className="w-3.5 h-3.5 text-neutral-400" />
                  <span>مشخصات زیرساخت بومی</span>
                </div>
                <div className="space-y-2.5 text-xs text-neutral-400">
                  <div className="flex justify-between py-1.5 border-b border-dotted border-[#1a1a1a]">
                    <span className="text-neutral-500">پایگاه داده:</span>
                    <span className="text-white font-medium">پاکت‌بیس (SQLite محلی)</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-dotted border-[#1a1a1a]">
                    <span className="text-neutral-500">موقعیت سرور:</span>
                    <span className="text-neutral-300">داخلی / مستقل از خارج</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-dotted border-[#1a1a1a]">
                    <span className="text-neutral-500">کلاد خارجی:</span>
                    <span className="text-[#00e599] font-medium">صفر درصد (کاملاً مستقل)</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-neutral-500">جریان داده:</span>
                    <span className="text-white font-medium">ارتباط زنده لحظه‌ای (SSE)</span>
                  </div>
                </div>
              </div>

              {/* LLM Gateway specs card */}
              <div className="p-5 rounded-xl bg-[#0a0a0a] border border-dotted border-[#2e2e2e] hover:border-[#3e3e3e] transition-colors space-y-3.5">
                <div className="flex items-center gap-2 text-white font-medium text-xs pb-1 border-b border-dotted border-[#1f1f1f]">
                  <CpuIcon className="w-3.5 h-3.5 text-neutral-400" />
                  <span>موتور هوش مصنوعی رادار</span>
                </div>
                <div className="space-y-2.5 text-xs text-neutral-400">
                  <div className="flex justify-between py-1.5 border-b border-dotted border-[#1a1a1a]">
                    <span className="text-neutral-500">مدل پیش‌فرض:</span>
                    <span className="text-white font-medium">llama3.1 / qwen2.5</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-dotted border-[#1a1a1a]">
                    <span className="text-neutral-500">موتور پشتیبان:</span>
                    <span className="text-[#00e599] font-medium">فعال (تریاژ بدون اینترنت)</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-neutral-500">هزینه هر ۱M توکن:</span>
                    <span className="text-neutral-300">۰.۱۵ / ۰.۶۰ دلار</span>
                  </div>
                </div>
              </div>

              {/* Guidance tip card */}
              <div className="p-5 rounded-xl bg-[#0a0a0a] border border-dotted border-[#2e2e2e] hover:border-[#3e3e3e] transition-colors space-y-2.5">
                <div className="flex items-center gap-2 text-xs text-neutral-200 font-medium pb-1 border-b border-dotted border-[#1f1f1f]">
                  <SparklesIcon className="w-3.5 h-3.5 text-[#00e599]" />
                  <span>راهنمای پرامپت هوشمند</span>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  تکمیل دقیق کلمات کلیدی عامیانه بازار و مزیت‌های محصول به هوش مصنوعی امکان می‌دهد تا پیام‌های واقعی خرید در تلگرام و بله را با دقت بالا استخراج کرده و پاسخ‌های شخصی‌سازی‌شده تولید کند.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
