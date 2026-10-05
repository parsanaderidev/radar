"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { toPersianDigits } from "@/lib/pricing";

export default function ProductSettingsPage() {
  const router = useRouter();
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

  const resetToLoaded = () => {
    if (!product) return;
    setName(product.name);
    setTagline(product.tagline || "");
    setDescription(product.description);
    setIcp(product.ideal_customer_profile);
    setValPropsText((product.value_propositions || []).join("\n"));
    setKeywordsText((product.keywords || []).join("، "));
    setStatusMessage(null);
  };

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

  const parsedKeywords = useMemo(() => {
    return keywordsText
      .split(/[,،\n]+/)
      .map((s) => s.trim())
      .filter(Boolean);
  }, [keywordsText]);

  const parsedValProps = useMemo(() => {
    return valPropsText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
  }, [valPropsText]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/login?from=/settings";
    } catch (e) {
      console.error("Logout error", e);
    }
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!product) return;
    setIsSaving(true);
    setStatusMessage(null);

    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: product.id,
          name,
          tagline,
          description,
          ideal_customer_profile: icp,
          value_propositions: parsedValProps,
          keywords: parsedKeywords,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) {
          router.push("/login?from=/settings");
          return;
        }
        throw new Error(data.error || "خطا در ذخیره‌سازی");
      }

      setProduct(data.product);
      setStatusMessage({ text: "تنظیمات با موفقیت در پایگاه داده امن ذخیره شد.", type: "success" });
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err: any) {
      console.error("Save error:", err);
      setStatusMessage({ text: `خطا در ذخیره‌سازی: ${err?.message || "مشکلی رخ داد"}`, type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  const focusInput = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.focus();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#000000] text-[#ededed]">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Active Product Banner */}
        <div className="p-4 rounded-lg bg-[#0a0a0a] border border-[#1f1f1f] hover:border-[#333333] hover:shadow-[0_8px_24px_rgba(0,0,0,0.6)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] px-2.5 py-0.5 rounded-md bg-neutral-900 border border-neutral-800 text-neutral-400 font-medium">
                تنظیمات سیستم
              </span>
              <h1 className="text-sm sm:text-base font-semibold text-white">
                تنظیمات محصول و پرسونای مشتری (ICP)
              </h1>
            </div>
            <p className="text-xs text-neutral-400 max-w-3xl line-clamp-1">
              مدیریت هویت محصول، مزایای رقابتی و تعریف پرسونای خریدار ایده‌آل (ICP) برای هدایت موتور هوشمند رادار
            </p>
          </div>

          <div className="flex items-center gap-2 self-stretch md:self-auto justify-end">
            <button
              type="button"
              onClick={resetToLoaded}
              disabled={isSaving || isLoading}
              className="h-8 px-3 rounded-md bg-[#111111] hover:bg-[#1a1a1a] border border-[#262626] hover:border-[#383838] text-xs text-neutral-300 transition-all duration-200 ease-out active:scale-95 flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 shadow-sm"
              title="بازنشانی تغییرات ذخیره‌نشده"
            >
              <RefreshIcon className="w-3.5 h-3.5 text-neutral-400" />
              <span>بازنشانی</span>
            </button>

            <button
              type="button"
              onClick={() => handleSave()}
              disabled={isSaving || isLoading}
              className="h-8 px-4 rounded-md bg-white text-black hover:bg-[#eaeaea] hover:shadow-[0_0_15px_rgba(255,255,255,0.25)] text-xs font-medium inline-flex items-center gap-1.5 transition-all duration-200 ease-out active:scale-95 shadow-sm cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
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

            <button
              type="button"
              onClick={handleLogout}
              className="h-8 px-3 rounded-md bg-neutral-900 hover:bg-rose-950/40 border border-neutral-800 hover:border-rose-900/60 text-neutral-400 hover:text-rose-300 text-xs transition-all duration-200 ease-out active:scale-95 flex items-center gap-1 cursor-pointer"
              title="خروج از پنل مدیریت"
            >
              <span>خروج</span>
            </button>
          </div>
        </div>

        {/* 4 Status Overview Tiles (Matching Dashboard Metrics Header Grid) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {/* Tile 1: Active Product */}
          <div
            onClick={() => focusInput("product-name-input")}
            className="p-4 rounded-lg bg-[#0a0a0a] border border-[#1f1f1f] hover:border-[#333333] hover:bg-[#0d0d0d] hover:-translate-y-1 hover:shadow-[0_12px_28px_-4px_rgba(0,0,0,0.7)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu flex flex-col justify-between cursor-pointer active:scale-[0.985]"
            title="کلیک برای ویرایش نام و شرح محصول"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-neutral-400 font-medium">
                محصول هدف رادار
              </span>
              <span className="text-[10px] text-neutral-500 opacity-80">ویرایش ↵</span>
            </div>
            <div className="mt-3">
              <div className="text-base sm:text-lg font-semibold text-white truncate">
                {name || "در حال بارگذاری..."}
              </div>
              <div className="text-xs text-neutral-500 mt-1 truncate">
                {tagline || "شعار تعریف نشده"}
              </div>
            </div>
          </div>

          {/* Tile 2: ICP Status */}
          <div
            onClick={() => focusInput("icp-textarea")}
            className="p-4 rounded-lg bg-[#0a0a0a] border border-[#1f1f1f] hover:border-[#333333] hover:bg-[#0d0d0d] hover:-translate-y-1 hover:shadow-[0_12px_28px_-4px_rgba(0,0,0,0.7)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu flex flex-col justify-between cursor-pointer active:scale-[0.985]"
            title="کلیک برای ویرایش پرسونای خریدار ایده‌آل (ICP)"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-neutral-400 font-medium">
                پرسونای مشتری (ICP)
              </span>
              <span className="flex h-2 w-2 rounded-full bg-[#00e599] shadow-[0_0_8px_rgba(0,229,153,0.6)] animate-pulse-glow" />
            </div>
            <div className="mt-3">
              <div className="text-base sm:text-lg font-semibold text-[#00e599]">
                {icp ? "آماده و فعال" : "در انتظار تکمیل"}
              </div>
              <div className="text-xs text-neutral-500 mt-1">
                الگوی تریاژ پیام‌های ورودی
              </div>
            </div>
          </div>

          {/* Tile 3: Keywords Count */}
          <div
            onClick={() => focusInput("keywords-input")}
            className="p-4 rounded-lg bg-[#0a0a0a] border border-[#1f1f1f] hover:border-[#333333] hover:bg-[#0d0d0d] hover:-translate-y-1 hover:shadow-[0_12px_28px_-4px_rgba(0,0,0,0.7)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu flex flex-col justify-between cursor-pointer active:scale-[0.985]"
            title="کلیک برای افزودن یا ویرایش کلیدواژه‌های نظارت"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-neutral-400 font-medium">
                کلیدواژه‌های نظارت
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-400 font-medium">
                فیلتر زنده
              </span>
            </div>
            <div className="mt-3">
              <div className="text-base sm:text-lg font-semibold text-white">
                {toPersianDigits(parsedKeywords.length)} عبارت
              </div>
              <div className="text-xs text-neutral-500 mt-1">
                رصد در تلگرام، بله و انجمن‌ها
              </div>
            </div>
          </div>

          {/* Tile 4: Storage Infrastructure */}
          <div
            onClick={() => {
              setStatusMessage({
                text: "پایگاه داده محلی پاکت‌بیس (SQLite) به صورت امن و بدون وابستگی به کلاد خارجی در حال اجرا است.",
                type: "success",
              });
              setTimeout(() => setStatusMessage(null), 5000);
            }}
            className="p-4 rounded-lg bg-[#0a0a0a] border border-[#1f1f1f] hover:border-[#333333] hover:bg-[#0d0d0d] hover:-translate-y-1 hover:shadow-[0_12px_28px_-4px_rgba(0,0,0,0.7)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu flex flex-col justify-between cursor-pointer active:scale-[0.985]"
            title="کلیک برای بررسی وضعیت ذخیره‌سازی محلی"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-neutral-400 font-medium">
                ذخیره‌سازی و حریم داده
              </span>
              <span className="text-[10px] text-[#00e599]">بررسی ↵</span>
            </div>
            <div className="mt-3">
              <div className="text-base sm:text-lg font-semibold text-white">
                SQLite محلی
              </div>
              <div className="text-xs text-[#00e599] mt-1">
                ۱۰۰٪ مستقل از کلاد خارجی
              </div>
            </div>
          </div>
        </div>

        {/* Feedback Alert */}
        {statusMessage && (
          <div
            className={`p-3 rounded-lg border text-xs flex items-center justify-between gap-2 shadow-lg transition-all ${
              statusMessage.type === "success"
                ? "bg-[#061a12] border-[#00e599]/50 text-[#00e599]"
                : "bg-[#1f0a0a] border-red-500/50 text-red-400"
            }`}
          >
            <div className="flex items-center gap-2">
              {statusMessage.type === "success" ? (
                <CheckCircleIcon className="w-4 h-4 text-[#00e599] shrink-0" />
              ) : (
                <span className="text-red-400 font-bold shrink-0">✕</span>
              )}
              <span className="font-medium">{statusMessage.text}</span>
            </div>
            <button
              onClick={() => setStatusMessage(null)}
              className="text-neutral-400 hover:text-white text-xs px-2 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3 text-neutral-500 text-xs rounded-lg border border-[#1f1f1f] bg-[#050505]">
            <RefreshIcon className="w-5 h-5 animate-spin text-neutral-400" />
            <span>در حال بارگذاری اطلاعات محصول از پاکت‌بیس...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form (2 Columns) */}
            <form onSubmit={handleSave} className="lg:col-span-2 space-y-6">
              {/* Card 1: Product Identity */}
              <div className="rounded-lg bg-[#0a0a0a] border border-[#1f1f1f] hover:border-[#333333] transition-colors overflow-hidden space-y-4 p-5">
                <div className="flex items-center justify-between border-b border-[#1f1f1f] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-white" />
                    <h2 className="text-xs font-semibold text-neutral-200">
                      هویت و مشخصات محصول
                    </h2>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded-md bg-neutral-900 border border-neutral-800 text-neutral-400">
                    شناسنامه تجاری
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-neutral-300 block mb-1.5">
                      نام تجاری محصول
                    </label>
                    <input
                      id="product-name-input"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="مثال: حساب‌آنلاین پارس"
                      className="w-full px-3.5 py-2 rounded-md bg-[#000000] border border-[#262626] text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-white input-smooth transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-neutral-300 block mb-1.5">
                      شعار محوری (Tagline)
                    </label>
                    <input
                      id="product-tagline-input"
                      type="text"
                      value={tagline}
                      onChange={(e) => setTagline(e.target.value)}
                      placeholder="مثال: نرم‌افزار یکپارچه حسابداری ابری و صدور پیش‌فاکتور ریالی"
                      className="w-full px-3.5 py-2 rounded-md bg-[#000000] border border-[#262626] text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-white input-smooth transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-neutral-300 block mb-1.5">
                      شرح قابلیت‌ها و مزایای محصول
                    </label>
                    <textarea
                      id="product-description-textarea"
                      rows={3}
                      required
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="توضیح دهید محصول چه کاری انجام می‌دهد و چه مشکلی از کسب‌وکارها حل می‌کند..."
                      className="w-full px-3.5 py-2.5 rounded-md bg-[#000000] border border-[#262626] text-xs text-white placeholder:text-neutral-600 leading-relaxed focus:outline-none focus:border-white input-smooth transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Card 2: ICP & Target Signals */}
              <div className="rounded-lg bg-[#0a0a0a] border border-[#1f1f1f] hover:border-[#333333] transition-colors overflow-hidden space-y-4 p-5">
                <div className="flex items-center justify-between border-b border-[#1f1f1f] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#00e599]" />
                    <h2 className="text-xs font-semibold text-neutral-200">
                      پرسونای مشتری ایده‌آل (ICP) و کلیدواژه‌ها
                    </h2>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded-md bg-neutral-900 border border-neutral-800 text-neutral-400">
                    هوش تریاژ
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-neutral-300 block mb-1.5">
                      پرسونای خریدار هدف (Ideal Customer Profile)
                    </label>
                    <textarea
                      id="icp-textarea"
                      rows={3}
                      required
                      value={icp}
                      onChange={(e) => setIcp(e.target.value)}
                      placeholder="استارتاپ‌ها، شرکت‌های بازرگانی و فروشگاه‌های آنلاین فعال در ایران..."
                      className="w-full px-3.5 py-2.5 rounded-md bg-[#000000] border border-[#262626] text-xs text-white placeholder:text-neutral-600 leading-relaxed focus:outline-none focus:border-white input-smooth transition-all"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-medium text-neutral-300">
                        ارزش‌های پیشنهادی و تمایزهای کلیدی (هر سطر یک مورد)
                      </label>
                      <span className="text-[11px] text-neutral-500">
                        {toPersianDigits(parsedValProps.length)} مورد ثبت‌شده
                      </span>
                    </div>
                    <textarea
                      id="valprops-textarea"
                      rows={4}
                      value={valPropsText}
                      onChange={(e) => setValPropsText(e.target.value)}
                      placeholder="بدون نیاز به سخت‌افزار جانبی&#10;پشتیبانی از قوانین مالیاتی پایانه‌های فروشگاهی&#10;اتصال مستقیم به سامانه مودیان"
                      className="w-full px-3.5 py-2.5 rounded-md bg-[#000000] border border-[#262626] text-xs text-neutral-200 placeholder:text-neutral-600 leading-relaxed focus:outline-none focus:border-white input-smooth transition-all"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-medium text-neutral-300">
                        کلیدواژه‌های رصد در پیام‌رسان‌ها (با کاما یا ویرگول جدا کنید)
                      </label>
                      <span className="text-[11px] text-neutral-500">
                        {toPersianDigits(parsedKeywords.length)} کلیدواژه فعال
                      </span>
                    </div>
                    <input
                      id="keywords-input"
                      type="text"
                      value={keywordsText}
                      onChange={(e) => setKeywordsText(e.target.value)}
                      placeholder="حسابداری, سامانه مودیان, فاکتور رسمی, پایانه فروشگاهی"
                      className="w-full px-3.5 py-2 rounded-md bg-[#000000] border border-[#262626] text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-white input-smooth transition-all"
                    />

                    {/* Keywords Preview Chips */}
                    {parsedKeywords.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5 pt-2 border-t border-[#1f1f1f]">
                        {parsedKeywords.map((kw, i) => (
                          <button
                            type="button"
                            key={i}
                            onClick={() => focusInput("keywords-input")}
                            title="کلیک برای ویرایش کلیدواژه‌ها"
                            className="px-2.5 py-0.5 rounded-md text-[11px] bg-[#111111] hover:bg-[#1a1a1a] text-neutral-300 hover:text-white border border-[#222222] hover:border-[#383838] transition-all flex items-center gap-1 cursor-pointer active:scale-95"
                          >
                            <span className="text-neutral-500">#</span>
                            <span>{kw}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="pt-4 border-t border-[#1f1f1f] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <span className="text-[11px] text-neutral-500">
                    ذخیره‌سازی پایدار و مستقیم در دیتابیس پاکت‌بیس (SQLite محلی)
                  </span>

                  <button
                    type="submit"
                    disabled={isSaving}
                    className="h-8 px-4 rounded-md bg-white text-black hover:bg-[#e6e6e6] text-xs font-medium inline-flex items-center gap-1.5 transition-all active:scale-95 shadow-sm cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
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

            {/* Sidebar Specifications (1 Column - Sticky on Desktop) */}
            <div className="space-y-4 lg:sticky lg:top-20 self-start">
              {/* Architecture specs card */}
              <div className="p-4 rounded-lg bg-[#0a0a0a] border border-[#1f1f1f] hover:border-[#333333] hover:bg-[#0d0d0d] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.6)] transition-all duration-200 space-y-3 cursor-default">
                <div className="flex items-center gap-2 text-white font-medium text-xs pb-1 border-b border-[#1f1f1f]">
                  <ServerIcon className="w-3.5 h-3.5 text-neutral-400" />
                  <span>مشخصات زیرساخت بومی</span>
                </div>
                <div className="space-y-2 text-xs text-neutral-400">
                  <div className="flex justify-between py-1 border-b border-[#1f1f1f]">
                    <span className="text-neutral-500">پایگاه داده:</span>
                    <span className="text-white font-medium">پاکت‌بیس (SQLite محلی)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#1f1f1f]">
                    <span className="text-neutral-500">موقعیت سرور:</span>
                    <span className="text-neutral-300">داخلی / مستقل از خارج</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#1f1f1f]">
                    <span className="text-neutral-500">کلاد خارجی:</span>
                    <span className="text-[#00e599] font-medium">صفر درصد (کاملاً مستقل)</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-neutral-500">جریان داده:</span>
                    <span className="text-white font-medium">ارتباط زنده لحظه‌ای (SSE)</span>
                  </div>
                </div>
              </div>

              {/* LLM Gateway specs card */}
              <div className="p-4 rounded-lg bg-[#0a0a0a] border border-[#1f1f1f] hover:border-[#333333] hover:bg-[#0d0d0d] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.6)] transition-all duration-200 space-y-3 cursor-default">
                <div className="flex items-center gap-2 text-white font-medium text-xs pb-1 border-b border-[#1f1f1f]">
                  <CpuIcon className="w-3.5 h-3.5 text-neutral-400" />
                  <span>موتور هوش مصنوعی رادار</span>
                </div>
                <div className="space-y-2 text-xs text-neutral-400">
                  <div className="flex justify-between py-1 border-b border-[#1f1f1f]">
                    <span className="text-neutral-500">مدل اصلی:</span>
                    <span className="text-white font-medium">llama3.1 / qwen2.5</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#1f1f1f]">
                    <span className="text-neutral-500">موتور پشتیبان:</span>
                    <span className="text-[#00e599] font-medium">فعال (تریاژ بدون اینترنت)</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-neutral-500">هزینه هر ۱M توکن:</span>
                    <span className="text-neutral-300">۰.۱۵ / ۰.۶۰ دلار</span>
                  </div>
                </div>
              </div>

              {/* Guidance tip card */}
              <div className="p-4 rounded-lg bg-[#0a0a0a] border border-[#1f1f1f] hover:border-[#333333] hover:bg-[#0d0d0d] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.6)] transition-all duration-200 space-y-2.5 cursor-default">
                <div className="flex items-center gap-2 text-xs text-neutral-200 font-medium pb-1 border-b border-[#1f1f1f]">
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

      {/* Vercel-style minimalist footer matching dashboard */}
      <footer className="mt-auto border-t border-[#1f1f1f] bg-black py-4 px-4 text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <Link href="/" className="flex items-center gap-2 group cursor-pointer">
            <RadarLogo className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white transition-colors" />
            <span className="group-hover:text-neutral-300 transition-colors">رادار • موتور هوشمند تشخیص تمایل خرید در جامعه کاربری</span>
          </Link>
          <span className="text-neutral-600">میزبانی بومی • دیتابیس پاکت‌بیس • مدل زبانی محلی/آفلاین</span>
        </div>
      </footer>
    </div>
  );
}
