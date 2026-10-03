"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import {
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
        <div className="border-b border-[#1f1f1f] pb-4">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold text-white tracking-tight">
              تنظیمات محصول و پرسونای مشتری (ICP)
            </h1>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            مشخصات محصول و پرسونای خریدار جهت ارزیابی هوشمند پیام‌ها و تفکیک نویز از تمایل خرید
          </p>
        </div>

        {/* Feedback Alert */}
        {statusMessage && (
          <div
            className={`p-3 rounded-md border text-xs flex items-center gap-2 ${statusMessage.type === "success"
                ? "bg-[#0c0c0c] border-[#00e599]/40 text-[#00e599]"
                : "bg-[#0c0c0c] border-red-500/40 text-red-400"
              }`}
          >
            {statusMessage.type === "success" ? (
              <CheckCircleIcon className="w-4 h-4 text-[#00e599] shrink-0" />
            ) : (
              <span className="text-red-400 font-bold">✕</span>
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3 text-neutral-500 text-xs">
            <RefreshIcon className="w-5 h-5 animate-spin text-neutral-400" />
            <span>در حال بارگذاری تنظیمات...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form */}
            <form onSubmit={handleSave} className="lg:col-span-2 space-y-4">
              {/* Card 1: Product Identity */}
              <div className="rounded-lg bg-[#0a0a0a] border border-[#1f1f1f] overflow-hidden">
                <div className="p-4 space-y-3">
                  <div>
                    <h2 className="text-xs font-semibold text-neutral-200">
                      هویت و مشخصات محصول
                    </h2>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      نام تجاری و شعار محوری جهت معرفی در پاسخ‌های پیشنهادی
                    </p>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div>
                      <label className="text-xs font-medium text-neutral-300 block mb-1">
                        نام تجاری محصول
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="مثال: حساب‌آنلاین پارس"
                        className="w-full px-3 py-2 rounded-md bg-[#000000] border border-[#262626] text-xs text-white focus:outline-none focus:border-white transition-colors"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-neutral-300 block mb-1">
                        شعار محوری (Tagline)
                      </label>
                      <input
                        type="text"
                        value={tagline}
                        onChange={(e) => setTagline(e.target.value)}
                        placeholder="مثال: نرم‌افزار یکپارچه حسابداری ابری و صدور پیش‌فاکتور ریالی"
                        className="w-full px-3 py-2 rounded-md bg-[#000000] border border-[#262626] text-xs text-white focus:outline-none focus:border-white transition-colors"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-neutral-300 block mb-1">
                        شرح قابلیت‌ها و مزایای محصول
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-3 py-2 rounded-md bg-[#000000] border border-[#262626] text-xs text-white leading-relaxed focus:outline-none focus:border-white transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: ICP & Target Signals */}
              <div className="rounded-lg bg-[#0a0a0a] border border-[#1f1f1f] overflow-hidden">
                <div className="p-4 space-y-3">
                  <div>
                    <h2 className="text-xs font-semibold text-neutral-200">
                      پرسونای مشتری ایده‌آل (ICP) و کلیدواژه‌ها
                    </h2>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      تعریف پرسونای خریداران هدف برای آموزش مدل تریاژ هوشمند
                    </p>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div>
                      <label className="text-xs font-medium text-neutral-300 block mb-1">
                        پرسونای خریدار هدف
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={icp}
                        onChange={(e) => setIcp(e.target.value)}
                        placeholder="استارتاپ‌ها، شرکت‌های بازرگانی و فروشگاه‌های آنلاین فعال در ایران..."
                        className="w-full px-3 py-2 rounded-md bg-[#000000] border border-[#262626] text-xs text-white leading-relaxed focus:outline-none focus:border-white transition-colors"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-neutral-300 block mb-1">
                        ارزش‌های پیشنهادی و تمایزهای کلیدی (هر سطر یک مورد)
                      </label>
                      <textarea
                        rows={4}
                        value={valPropsText}
                        onChange={(e) => setValPropsText(e.target.value)}
                        className="w-full px-3 py-2 rounded-md bg-[#000000] border border-[#262626] text-xs text-neutral-200 leading-relaxed focus:outline-none focus:border-white transition-colors"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-neutral-300 block mb-1">
                        کلیدواژه‌های رصد در پیام‌رسان‌ها (با کاما یا ویرگول جدا کنید)
                      </label>
                      <input
                        type="text"
                        value={keywordsText}
                        onChange={(e) => setKeywordsText(e.target.value)}
                        className="w-full px-3 py-2 rounded-md bg-[#000000] border border-[#262626] text-xs text-white focus:outline-none focus:border-white transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="px-4 py-3 bg-[#0d0d0d] border-t border-[#1f1f1f] flex items-center justify-between">
                  <span className="text-[11px] text-neutral-500">
                    ذخیره‌سازی پایدار در پایگاه داده محلی پاکت‌بیس (SQLite)
                  </span>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="h-8 px-4 rounded-md bg-white text-black hover:bg-[#e6e6e6] text-xs font-medium transition-all active:scale-95 flex items-center gap-1.5"
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
            <div className="space-y-4">
              {/* Architecture specs card */}
              <div className="p-4 rounded-lg bg-[#0a0a0a] border border-[#1f1f1f] space-y-3">
                <div className="flex items-center gap-2 text-white font-medium text-xs">
                  <ServerIcon className="w-3.5 h-3.5 text-neutral-400" />
                  <span>مشخصات زیرساخت بومی</span>
                </div>
                <div className="space-y-2 text-xs text-neutral-400">
                  <div className="flex justify-between py-1 border-b border-[#1f1f1f]">
                    <span className="text-neutral-500">پایگاه داده:</span>
                    <span className="text-white">پاکت‌بیس (SQLite محلی)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#1f1f1f]">
                    <span className="text-neutral-500">موقعیت سرور:</span>
                    <span className="text-neutral-300">داخلی / بدون نیاز به خارج</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#1f1f1f]">
                    <span className="text-neutral-500">کلاد خارجی:</span>
                    <span className="text-[#00e599]">صفر درصد (کاملاً مستقل)</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-neutral-500">جریان داده:</span>
                    <span className="text-white">ارتباط زنده لحظه‌ای (SSE)</span>
                  </div>
                </div>
              </div>

              {/* LLM Gateway specs card */}
              <div className="p-4 rounded-lg bg-[#0a0a0a] border border-[#1f1f1f] space-y-3">
                <div className="flex items-center gap-2 text-white font-medium text-xs">
                  <CpuIcon className="w-3.5 h-3.5 text-neutral-400" />
                  <span>موتور هوش مصنوعی</span>
                </div>
                <div className="space-y-2 text-xs text-neutral-400">
                  <div className="flex justify-between py-1 border-b border-[#1f1f1f]">
                    <span className="text-neutral-500">مدل پیش‌فرض:</span>
                    <span className="text-white">llama3.1 / qwen2.5</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#1f1f1f]">
                    <span className="text-neutral-500">موتور پشتیبان:</span>
                    <span className="text-[#00e599]">فعال (تریاژ بدون اینترنت)</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-neutral-500">هزینه هر ۱M توکن:</span>
                    <span className="text-neutral-300 font-num">۰.۱۵ / ۰.۶۰ دلار</span>
                  </div>
                </div>
              </div>

              {/* Guidance tip card */}
              <div className="p-4 rounded-lg bg-[#0a0a0a] border border-[#1f1f1f] space-y-2">
                <div className="flex items-center gap-1.5 text-xs text-neutral-300 font-medium">
                  <SparklesIcon className="w-3.5 h-3.5 text-neutral-400" />
                  <span>راهنمای پرامپت هوشمند</span>
                </div>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  تکمیل دقیق کلمات کلیدی عامیانه بازار و مزیت‌های محصول به هوش مصنوعی امکان می‌دهد تا پیام‌های واقعی خرید در تلگرام و بله را با دقت بالا استخراج کند.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
