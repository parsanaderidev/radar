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
      setStatusMessage({ text: "تغییرات با موفقیت در دیتابیس ذخیره شد.", type: "success" });
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
            مشخصات محصول و پرسونای خریدار جهت ارزیابی دقیق هوش مصنوعی و تفکیک نویز از سیگنال خرید
          </p>
        </div>

        {/* Feedback Alert */}
        {statusMessage && (
          <div
            className={`p-3 rounded-md border text-xs flex items-center gap-2 font-mono ${
              statusMessage.type === "success"
                ? "bg-[#0c0c0c] border-[#00e599]/40 text-[#00e599]"
                : "bg-[#0c0c0c] border-red-500/40 text-red-400"
            }`}
          >
            {statusMessage.type === "success" ? (
              <CheckCircleIcon className="w-3.5 h-3.5 text-[#00e599] shrink-0" />
            ) : (
              <span className="text-red-400 font-bold">✕</span>
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3 text-neutral-500 font-mono text-xs">
            <RefreshIcon className="w-5 h-5 animate-spin text-neutral-400" />
            <span>Loading configuration...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Vercel-Style Form */}
            <form onSubmit={handleSave} className="lg:col-span-2 space-y-4">
              {/* Card 1: Product Identity */}
              <div className="rounded-lg bg-[#0a0a0a] border border-[#1f1f1f] overflow-hidden">
                <div className="p-4 space-y-3">
                  <div>
                    <h2 className="text-xs font-semibold text-neutral-200 uppercase font-mono tracking-wider">
                      Product Identity
                    </h2>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      نام رسمی برند تجاری و شعار محوری محصول
                    </p>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div>
                      <label className="text-xs font-medium text-neutral-300 block mb-1">
                        نام محصول
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="مثال: حساب‌آنلاین پارس"
                        className="w-full px-3 py-1.5 rounded-md bg-[#000000] border border-[#262626] text-xs text-white focus:outline-none focus:border-white transition-colors"
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
                        className="w-full px-3 py-1.5 rounded-md bg-[#000000] border border-[#262626] text-xs text-white focus:outline-none focus:border-white transition-colors"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-neutral-300 block mb-1">
                        شرح قابلیت‌های محصول
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-md bg-[#000000] border border-[#262626] text-xs text-white leading-relaxed focus:outline-none focus:border-white transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: ICP & Target Signals */}
              <div className="rounded-lg bg-[#0a0a0a] border border-[#1f1f1f] overflow-hidden">
                <div className="p-4 space-y-3">
                  <div>
                    <h2 className="text-xs font-semibold text-neutral-200 uppercase font-mono tracking-wider">
                      Ideal Customer Profile (ICP)
                    </h2>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      تعریف پرسونای مشتریان هدف برای آموزش مدل تریاژ
                    </p>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div>
                      <label className="text-xs font-medium text-neutral-300 block mb-1">
                        پرسونای خریدار ایده‌آل
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={icp}
                        onChange={(e) => setIcp(e.target.value)}
                        placeholder="استارتاپ‌ها، شرکت‌های بازرگانی و فروشگاه‌های آنلاین فعال در ایران..."
                        className="w-full px-3 py-1.5 rounded-md bg-[#000000] border border-[#262626] text-xs text-white leading-relaxed focus:outline-none focus:border-white transition-colors"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-neutral-300 block mb-1">
                        ارزش‌های پیشنهادی کلیدی (هر سطر یک مزیت)
                      </label>
                      <textarea
                        rows={4}
                        value={valPropsText}
                        onChange={(e) => setValPropsText(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-md bg-[#000000] border border-[#262626] text-xs font-mono text-neutral-200 leading-relaxed focus:outline-none focus:border-white transition-colors"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-neutral-300 block mb-1">
                        کلیدواژه‌های رصد در پیام‌رسان‌ها
                      </label>
                      <input
                        type="text"
                        value={keywordsText}
                        onChange={(e) => setKeywordsText(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-md bg-[#000000] border border-[#262626] text-xs text-white focus:outline-none focus:border-white transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Vercel Card Footer */}
                <div className="px-4 py-2.5 bg-[#0d0d0d] border-t border-[#1f1f1f] flex items-center justify-between">
                  <span className="text-[11px] font-mono text-neutral-500">
                    Auto-saved to PocketBase SQLite
                  </span>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="h-8 px-4 rounded-md bg-white text-black hover:bg-[#e6e6e6] text-xs font-medium transition-all active:scale-95 flex items-center gap-1.5"
                  >
                    {isSaving ? (
                      <>
                        <RefreshIcon className="w-3.5 h-3.5 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <span>Save Changes</span>
                    )}
                  </button>
                </div>
              </div>
            </form>

            {/* Sidebar Specifications */}
            <div className="space-y-4">
              {/* Architecture specs card */}
              <div className="p-4 rounded-lg bg-[#0a0a0a] border border-[#1f1f1f] space-y-3">
                <div className="flex items-center gap-2 text-white font-medium text-xs font-mono uppercase tracking-wider">
                  <ServerIcon className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Deployment Stack</span>
                </div>
                <div className="space-y-2 text-xs font-mono text-neutral-400">
                  <div className="flex justify-between py-1 border-b border-[#1f1f1f]">
                    <span className="text-neutral-500">Database:</span>
                    <span className="text-white">PocketBase (SQLite)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#1f1f1f]">
                    <span className="text-neutral-500">Host:</span>
                    <span className="text-neutral-300">Domestic / Local</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#1f1f1f]">
                    <span className="text-neutral-500">Foreign Cloud:</span>
                    <span className="text-[#00e599]">None (0%)</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-neutral-500">Streaming:</span>
                    <span className="text-white">SSE (Server-Sent)</span>
                  </div>
                </div>
              </div>

              {/* LLM Gateway specs card */}
              <div className="p-4 rounded-lg bg-[#0a0a0a] border border-[#1f1f1f] space-y-3">
                <div className="flex items-center gap-2 text-white font-medium text-xs font-mono uppercase tracking-wider">
                  <CpuIcon className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Model Runtime</span>
                </div>
                <div className="space-y-2 text-xs font-mono text-neutral-400">
                  <div className="flex justify-between py-1 border-b border-[#1f1f1f]">
                    <span className="text-neutral-500">Default Model:</span>
                    <span className="text-white">llama3.1</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#1f1f1f]">
                    <span className="text-neutral-500">Fallback Engine:</span>
                    <span className="text-[#00e599]">Active (Offline)</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-neutral-500">Pricing / 1M:</span>
                    <span className="text-neutral-300">$0.15 / $0.60</span>
                  </div>
                </div>
              </div>

              {/* Guidance tip card */}
              <div className="p-4 rounded-lg bg-[#0a0a0a] border border-[#1f1f1f] space-y-2">
                <div className="flex items-center gap-1.5 text-xs text-neutral-300 font-medium">
                  <SparklesIcon className="w-3.5 h-3.5 text-neutral-400" />
                  <span>راهنمای پرامپت</span>
                </div>
                <p className="text-[11px] text-neutral-500 leading-relaxed">
                  تکمیل دقیق کلمات کلیدی عامیانه و ارزش‌های رقابتی به هوش مصنوعی کمک می‌کند تا پیام‌های واقعی خرید در تلگرام و بله را با دقت بالا استخراج کند.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
