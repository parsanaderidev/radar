"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  RadarLogo,
  SparklesIcon,
  PlayIcon,
  RefreshIcon,
  TelegramIcon,
  BaleIcon,
  TwitterXIcon,
  ForumIcon,
  CheckIcon,
  CheckCircle2Icon,
  CopyIcon,
  FlameIcon,
} from "@/components/Icons";
import { VoiceOrb } from "@/components/agents/voice-orb";

/** Sample interactive demo opportunity */
const DEMO_LEAD = {
  platform: "bale",
  author: "علیرضا فراهانی (مدیر عملیات)",
  sourceName: "گروه توسعه‌دهندگان و استارتاپ‌های فین‌تک",
  timeAgo: "۱۲ دقیقه پیش",
  rawMessage:
    "سلام دوستان، ما برای تیم فروشمون توی یک ماه گذشته به شدت درگیر پیدا کردن سرنخ‌های واقعی در کانال‌ها و گروه‌ها بودیم. روزی ۳ ساعت نیروی SDR ما وقت می‌ذاره پیام بخونه ولی ۹۰ درصدش بی‌ربطه. ابزاری هست که پیام‌های مرتبط با نرم‌افزار مالی رو اتوماتیک فیلتر کنه و قصد خرید رو تشخیص بده؟ بودجه تا ماهانه ۱۵ میلیون داریم.",
  intentScore: 94,
  intentTier: "HIGH INTENT",
  intentType: "نیاز صریح به خرید ابزار فیلترینگ سرنخ",
  reasoning:
    "کاربر به صراحت مشکل اتلاف وقت تیم فروش (۳ ساعت در روز) و نرخ نامرتبط بودن پیام‌ها (۹۰٪) را شرح داده، درخواست راهکار اتوماتیک دارد و سقف بودجه ماهانه (۱۵ میلیون تومان) را تعیین کرده است.",
  productMatch: "سیستم فیلترینگ خودکار پیام و استخراج هوشمند لید با LLM محلی",
  suggestedReply:
    "درود علیرضا عزیز، رادار دقیقاً برای همین چالش طراحی شده است: پایش خودکار جوامع آنلاین و غربالگری هوشمند سیگنال‌های خرید با هوش مصنوعی بدون نیاز به مرور دستی. خوشحال می‌شویم یک دمو اختصاصی برای ارزیابی روی کانال‌های هدف تیم شما تنظیم کنیم.",
  analysisCost: "$0.00014 (حدود ۹ تومان)",
  processingTime: "۶۸۰ میلی‌ثانیه",
};

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<"all" | "high" | "problem" | "curious">("high");
  const [copied, setCopied] = useState(false);

  const handleCopyReply = () => {
    navigator.clipboard.writeText(DEMO_LEAD.suggestedReply);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#ededed] selection:bg-white selection:text-black">
      {/* Top Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-stone-800/20 via-stone-900/10 to-transparent blur-[120px] rounded-full" />
      </div>

      {/* Navigation Header */}
      <header className="sticky top-0 z-40 w-full border-b border-[#1b1b1b] bg-[#080808]/85 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 group cursor-pointer">
              <div className="w-8 h-8 rounded-lg bg-white text-black flex items-center justify-center font-bold shadow-sm transition-transform group-hover:scale-105">
                <RadarLogo className="w-5 h-5 text-black" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-base text-white tracking-tight">رادار</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#1e1e1e] text-neutral-400 border border-[#2d2d2d]">
                    PriCoders
                  </span>
                </div>
                <span className="text-[10px] text-neutral-500 hidden sm:inline">
                  موتور هوشمندی فرصت‌های فروش
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs text-neutral-400 font-medium">
            <a href="#problem" className="hover:text-white transition-colors">
              مسئله
            </a>
            <a href="#how-it-works" className="hover:text-white transition-colors">
              نحوه کارکرد
            </a>
            <a href="#intent-engine" className="hover:text-white transition-colors">
              موتور نیت‌سنجی
            </a>
            <a href="#lead-intelligence" className="hover:text-white transition-colors">
              شناسنامه فرصت
            </a>
            <a href="#cost" className="hover:text-white transition-colors">
              شفافیت هزینه
            </a>
            <Link
              href="/pitch"
              className="text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1 font-semibold"
            >
              <span>پیچ‌دک ۱۱ اسلایدی</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-950/60 border border-amber-800/60">
                ویژه داوران
              </span>
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/pitch"
              className="hidden sm:inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-xs font-medium text-neutral-300 hover:text-white bg-[#121212] border border-[#262626] hover:border-[#383838] transition-all cursor-pointer"
            >
              اسلایدهای ارائه
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 h-9 px-4 rounded-lg text-xs font-semibold bg-white text-black hover:bg-neutral-200 transition-all shadow-sm hover:shadow-[0_0_20px_rgba(255,255,255,0.25)] active:scale-95 cursor-pointer"
            >
              <PlayIcon className="w-3.5 h-3.5 text-black" />
              <span>ورود به داشبورد</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        {/* ========================================================
            01 HERO SECTION
        ======================================================== */}
        <section className="pt-16 pb-20 sm:pt-24 sm:pb-28 px-4 sm:px-6 max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#121212] border border-[#262626] text-xs text-neutral-400 mb-8 animate-fade-in shadow-inner">
            <span className="w-2 h-2 rounded-full bg-[#00e599] animate-pulse-glow" />
            <span className="text-neutral-300 font-medium">موتور هوشمندی فرصت فروش • توسعه توسط PriCoders</span>
            <span className="text-neutral-600">|</span>
            <span className="text-amber-400 font-medium">MVP آماده دمو و ارائه</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.25] sm:leading-[1.2] mb-6">
            هزاران پیام و گفت‌وگو.
            <br />
            <span className="bg-gradient-to-l from-white via-neutral-300 to-neutral-500 bg-clip-text text-transparent">
              تنها چند فرصت خرید واقعی.
            </span>
            <br />
            <span className="text-white underline decoration-[#00e599]/60 underline-offset-8">
              رادار آن‌ها را شکار می‌کند.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-lg text-neutral-400 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            رادار یک <strong className="text-white font-semibold">موتور هوشمندی فرصت (Opportunity Intelligence Engine)</strong> برای تیم‌های فروش است که سیگنال‌های خرید نهفته در میان گفت‌وگوهای آنلاین جوامع و شبکه‌های اجتماعی را کشف و اولویت‌بندی می‌کند.
          </p>

          {/* Value Prop Banner */}
          <div className="inline-flex items-center justify-center gap-3 px-4 py-2 rounded-xl bg-[#0e0e0e] border border-[#222222] text-xs sm:text-sm text-neutral-300 mb-10 font-medium shadow-sm">
            <span className="text-neutral-500">ارزش بنیادین:</span>
            <span className="font-bold text-white tracking-wide">
              از میان هیاهو تا فرصت فروش
            </span>
            <span className="text-neutral-600 font-mono text-xs">(From Noise to Opportunity)</span>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md mx-auto">
            <Link
              href="/"
              className="w-full sm:w-auto h-11 px-7 rounded-xl font-bold text-sm bg-white text-black hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(255,255,255,0.2)] active:scale-95 cursor-pointer"
            >
              <SparklesIcon className="w-4 h-4 text-black" />
              <span>مشاهده زنده داشبورد رادار</span>
            </Link>

            <Link
              href="/pitch"
              className="w-full sm:w-auto h-11 px-6 rounded-xl font-medium text-sm bg-[#141414] hover:bg-[#1c1c1c] text-white border border-[#2c2c2c] hover:border-neutral-500 transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
            >
              <span>پیچ‌دک ۱۱ اسلایدی ارائه</span>
              <span className="text-neutral-500">←</span>
            </Link>
          </div>

          {/* Micro badges below hero */}
          <div className="mt-14 pt-8 border-t border-[#181818] grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-3 rounded-lg bg-[#0a0a0a] border border-[#171717]">
              <div className="text-xs text-neutral-500 mb-1">تحلیل بافت و معنا</div>
              <div className="text-sm font-semibold text-white">متن کامل + تاریخچه</div>
            </div>
            <div className="p-3 rounded-lg bg-[#0a0a0a] border border-[#171717]">
              <div className="text-xs text-neutral-500 mb-1">دقت نیت‌سنجی</div>
              <div className="text-sm font-semibold text-[#00e599]">۴ سطح نیت خرید</div>
            </div>
            <div className="p-3 rounded-lg bg-[#0a0a0a] border border-[#171717]">
              <div className="text-xs text-neutral-500 mb-1">هزینه هر تحلیل</div>
              <div className="text-sm font-semibold text-sky-400">کمتر از ۱۰ تومان</div>
            </div>
            <div className="p-3 rounded-lg bg-[#0a0a0a] border border-[#171717]">
              <div className="text-xs text-neutral-500 mb-1">حریم خصوصی داده</div>
              <div className="text-sm font-semibold text-purple-400">پایگاه داده مستقل و امن</div>
            </div>
          </div>
        </section>

        {/* ========================================================
            02 THE PROBLEM (مسئله: پارازیت بی‌نهایت در برابر سیگنال‌های پنهان)
        ======================================================== */}
        <section id="problem" className="py-20 px-4 sm:px-6 max-w-6xl mx-auto border-t border-[#161616]">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="text-xs font-semibold text-rose-400 tracking-wider uppercase mb-2">
              ۰۱ — مسئله بنیادین
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-4">
              هزاران نفر روزانه مشکلاتشان را می‌گویند؛
              <br />
              اما در دل اقیانوسی از پارازیت و اسپم.
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
              در گروه‌ها، کانال‌ها، انجمن‌ها و شبکه‌های اجتماعی فارسی (بله، تلگرام، X، ویرگول و فروم‌ها)، خریداران واقعی به دنبال راه‌حل می‌گردند، اما یافتن آن‌ها به صورت دستی عملاً غیرممکن است.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {/* Left: The Noise reality */}
            <div className="p-6 rounded-2xl bg-[#0c0c0c] border border-[#1f1f1f] flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4 text-xs font-semibold text-rose-400">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span>واقعیت روزمره تیم‌های فروش: جست‌وجوی دستی پرهزینه</span>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="p-3 rounded-xl bg-[#141414] border border-[#222222] text-xs text-neutral-400 opacity-60">
                    «سلام دوستان، کسی لینک فیلم جدید رو داره؟ ممنون میشم بفرستید.»
                  </div>
                  <div className="p-3 rounded-xl bg-[#141414] border border-[#222222] text-xs text-neutral-400 opacity-60">
                    «تبلیغات بنری در کانال‌های پربازدید با تخفیف ۵۰ درصدی...»
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#1a1715] border border-amber-800/50 text-xs text-amber-200">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-bold text-amber-400">سیگنال واقعی خریدار (مدفون در میان پیام‌ها):</span>
                      <span className="text-[10px] text-amber-500">گروه فنی</span>
                    </div>
                    «ما برای تیم ۲۰ نفرمون به شدت دنبال یه راهکار مطمئن اتوماسیون پیگیری لیدها هستیم. بودجه ماهانه هم داریم. چی پیشنهاد می‌دید؟»
                  </div>
                  <div className="p-3 rounded-xl bg-[#141414] border border-[#222222] text-xs text-neutral-400 opacity-60">
                    «صبح بخیر دوستان، امروز بورس چطور باز شد؟»
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#1a1a1a] text-xs text-neutral-400 leading-relaxed">
                <span className="text-rose-400 font-semibold">چالش‌های مدل سنتی: </span>
                خواندن صدها پیام نامرتبط، اتلاف روزانه ۳ ساعت وقت کارشناس فروش، ناتوانی در تحلیل پیوسته بافت گفت‌وگو، و از دست رفتن سرنخ‌هایی که ظرف چند ساعت به رقیب مراجعه می‌کنند.
              </div>
            </div>

            {/* Right: The Key Insight */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-[#111111] to-[#0a0a0a] border border-[#242424] flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4 text-xs font-semibold text-[#00e599]">
                  <span className="w-2 h-2 rounded-full bg-[#00e599]" />
                  <span>بینش کلیدی رادار (The Core Insight)</span>
                </div>

                <blockquote className="text-lg sm:text-xl font-bold text-white leading-relaxed mb-6 border-r-2 border-[#00e599] pr-4">
                  «یک پیام به تنهایی برای درک فرصت کافی نیست. رادار به جای دسته‌بندی سطحی کلمات کلیدی، کل مکالمه، بافت نیاز و قصد کاربر را درک می‌کند.»
                </blockquote>

                <div className="space-y-3 text-xs text-neutral-300 leading-relaxed">
                  <div className="flex items-start gap-2.5">
                    <span className="w-4 h-4 rounded-full bg-[#1b261f] text-[#00e599] flex items-center justify-center shrink-0 mt-0.5 font-bold">✓</span>
                    <span><strong>شناخت نیاز واقعی:</strong> کاربر دقیقاً چه مشکلی را تجربه می‌کند؟</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-4 h-4 rounded-full bg-[#1b261f] text-[#00e599] flex items-center justify-center shrink-0 mt-0.5 font-bold">✓</span>
                    <span><strong>انطباق قابلیت محصول:</strong> آیا محصول ما راه‌حل واقعی این درد را دارد؟</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-4 h-4 rounded-full bg-[#1b261f] text-[#00e599] flex items-center justify-center shrink-0 mt-0.5 font-bold">✓</span>
                    <span><strong>اقدام سریع و متناسب:</strong> تیم فروش دقیقاً با چه متنی باید وارد مذاکره شود؟</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-3.5 rounded-xl bg-[#141414] border border-[#2b2b2b] text-center">
                <span className="text-xs text-neutral-400">نتیجه تغییر رویکرد: </span>
                <span className="text-xs font-bold text-white">
                  تبدیل «هزاران پیام خام» به «تعداد معدودی فرصت طلایی و آماده اقدام»
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            03 HOW IT WORKS (خط لوله ۵ مرحله‌ای)
        ======================================================== */}
        <section id="how-it-works" className="py-20 px-4 sm:px-6 max-w-6xl mx-auto border-t border-[#161616]">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="text-xs font-semibold text-sky-400 tracking-wider uppercase mb-2">
              ۰۲ — خط لوله هوشمندی
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-4">
              نحوه کارکرد رادار در ۵ گام
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
              رادار یک پوسته ساده هوش مصنوعی (LLM wrapper) نیست؛ یک خط لوله اختصاصی و مهندسی‌شده برای استخراج ارزش از مکالمات است.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5">
            {/* Step 1 */}
            <div className="p-4.5 rounded-2xl bg-[#0c0c0c] border border-[#1e1e1e] flex flex-col justify-between hover:border-neutral-700 transition-colors">
              <div>
                <div className="text-[11px] font-mono font-bold text-neutral-500 mb-2">01 / COLLECT</div>
                <h3 className="text-sm font-bold text-white mb-2">جمع‌آوری داده</h3>
                <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                  دریافت پیام‌های جوامع کاربری آنلاین، پیام‌رسان‌ها و انجمن‌های تخصصی.
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-neutral-400 text-[11px]">
                <BaleIcon className="w-3.5 h-3.5 text-[#00e599]" />
                <TelegramIcon className="w-3.5 h-3.5 text-sky-400" />
                <TwitterXIcon className="w-3.5 h-3.5 text-neutral-300" />
                <ForumIcon className="w-3.5 h-3.5 text-purple-400" />
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-4.5 rounded-2xl bg-[#0c0c0c] border border-[#1e1e1e] flex flex-col justify-between hover:border-neutral-700 transition-colors">
              <div>
                <div className="text-[11px] font-mono font-bold text-sky-400 mb-2">02 / UNDERSTAND</div>
                <h3 className="text-sm font-bold text-white mb-2">درک بافت و معنا</h3>
                <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                  تحلیل معنایی پیام به همراه بستر، تاریخچه مکالمه و لحن گوینده با LLM.
                </p>
              </div>
              <div className="text-[10px] text-sky-400 bg-sky-950/40 border border-sky-900/40 px-2 py-1 rounded">
                درک زبان و زمینه فارسی
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-4.5 rounded-2xl bg-[#0c0c0c] border border-[#1e1e1e] flex flex-col justify-between hover:border-neutral-700 transition-colors">
              <div>
                <div className="text-[11px] font-mono font-bold text-amber-400 mb-2">03 / SCORE</div>
                <h3 className="text-sm font-bold text-white mb-2">امتیازدهی نیت</h3>
                <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                  ارزیابی شدت قصد خرید و میزان انطباق چالش کاربر با قابلیت‌های محصول (ICP).
                </p>
              </div>
              <div className="text-[10px] text-amber-400 bg-amber-950/40 border border-amber-900/40 px-2 py-1 rounded">
                نمره نیت ۰ تا ۱۰۰
              </div>
            </div>

            {/* Step 4 */}
            <div className="p-4.5 rounded-2xl bg-[#0c0c0c] border border-[#1e1e1e] flex flex-col justify-between hover:border-neutral-700 transition-colors">
              <div>
                <div className="text-[11px] font-mono font-bold text-[#00e599] mb-2">04 / PRIORITIZE</div>
                <h3 className="text-sm font-bold text-white mb-2">اولویت‌بندی لید</h3>
                <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                  مرتب‌سازی فرصت‌ها بر اساس بازدهی بالقوه جهت تمرکز تیم فروش روی فرصت‌های داغ.
                </p>
              </div>
              <div className="text-[10px] text-[#00e599] bg-[#00e599]/10 border border-[#00e599]/30 px-2 py-1 rounded">
                غربالگری پارازیت‌ها
              </div>
            </div>

            {/* Step 5 */}
            <div className="p-4.5 rounded-2xl bg-[#0c0c0c] border border-[#1e1e1e] flex flex-col justify-between hover:border-neutral-700 transition-colors">
              <div>
                <div className="text-[11px] font-mono font-bold text-purple-400 mb-2">05 / ACT</div>
                <h3 className="text-sm font-bold text-white mb-2">اقدام فروش</h3>
                <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                  ارائه استدلال، پیشنهاد پاسخ آماده، تطابق محصول و هزینه تحلیل برای ارتباط فوری.
                </p>
              </div>
              <div className="text-[10px] text-purple-400 bg-purple-950/40 border border-purple-900/40 px-2 py-1 rounded">
                ورود سریع به مذاکره
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <span className="text-xs font-mono text-neutral-500">
              داده خام (Data) → هوشمندی (Intelligence) → فرصت تجاری (Opportunity) → اقدام فروش (Action)
            </span>
          </div>
        </section>

        {/* ========================================================
            04 INTENT ENGINE (سطوح نیت‌سنجی خرید)
        ======================================================== */}
        <section id="intent-engine" className="py-20 px-4 sm:px-6 max-w-6xl mx-auto border-t border-[#161616]">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="text-xs font-semibold text-[#00e599] tracking-wider uppercase mb-2">
              ۰۳ — موتور تشخیص نیت خرید
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-4">
              تفکیک علمی ۴ سطح قصد خرید (Intent Levels)
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
              رادار پیام‌ها را بر اساس شدت تمایل به حل مشکل و پتانسیل تجاری در ۴ سطح امتیازدهی می‌کند تا تیم فروش فقط روی گفتگوهای حیاتی تمرکز کند.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Level 1: High Intent */}
            <div className="p-5 rounded-2xl bg-[#0e1410] border border-[#1c3826] relative overflow-hidden">
              <div className="w-1.5 h-full bg-[#00e599] absolute top-0 right-0" />
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black text-[#00e599] uppercase tracking-wider">
                  HIGH INTENT
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#00e599]/20 text-[#00e599] font-bold">
                  ۷۵ – ۱۰۰
                </span>
              </div>
              <h3 className="text-base font-bold text-white mb-2">قصد صریح خرید</h3>
              <p className="text-xs text-neutral-300 leading-relaxed mb-4">
                کاربر نیاز صریح دارد، در حال مقایسه راه‌حل‌هاست یا آماده سفارش است. اولویت فوری برای تماس یا ارسال پیشنهاد.
              </p>
              <div className="text-[11px] text-neutral-400 bg-black/40 p-2.5 rounded-lg border border-[#1e3425]">
                نمونه: «دنبال خرید نرم‌افزار مدیریت لید با بودجه آماده برای تیممون هستم.»
              </div>
            </div>

            {/* Level 2: Problem Aware */}
            <div className="p-5 rounded-2xl bg-[#14120b] border border-[#3b2e16] relative overflow-hidden">
              <div className="w-1.5 h-full bg-amber-400 absolute top-0 right-0" />
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black text-amber-400 uppercase tracking-wider">
                  PROBLEM AWARE
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 font-bold">
                  ۴۵ – ۷۴
                </span>
              </div>
              <h3 className="text-base font-bold text-white mb-2">آگاه از مسئله</h3>
              <p className="text-xs text-neutral-300 leading-relaxed mb-4">
                کاربر با یک چالش واقعی دست‌وپنجه نرم می‌کند و در پی راهکار است. پتانسیل بالا برای مشاوره و پرورش سرنخ.
              </p>
              <div className="text-[11px] text-neutral-400 bg-black/40 p-2.5 rounded-lg border border-[#302613]">
                نمونه: «ما روزانه زمان زیادی رو صرف غربال دستی پیام‌ها می‌کنیم و بازدهی پایینه.»
              </div>
            </div>

            {/* Level 3: Curious */}
            <div className="p-5 rounded-2xl bg-[#0c1218] border border-[#172c3d] relative overflow-hidden">
              <div className="w-1.5 h-full bg-sky-400 absolute top-0 right-0" />
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black text-sky-400 uppercase tracking-wider">
                  CURIOUS
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-sky-950/60 text-sky-300 font-bold">
                  ۲۰ – ۴۴
                </span>
              </div>
              <h3 className="text-base font-bold text-white mb-2">کنجکاو / پرسش اولیه</h3>
              <p className="text-xs text-neutral-300 leading-relaxed mb-4">
                علاقه اولیه یا سوال عمومی درباره تکنولوژی و بازار بدون قصد خرید فوری در زمان فعلی.
              </p>
              <div className="text-[11px] text-neutral-400 bg-black/40 p-2.5 rounded-lg border border-[#142636]">
                نمونه: «کسی می‌دونه هوش مصنوعی الان چقدر توی فروش اتوماتیک کاربرد داره؟»
              </div>
            </div>

            {/* Level 4: Irrelevant */}
            <div className="p-5 rounded-2xl bg-[#0e0e0e] border border-[#222222] relative overflow-hidden opacity-75">
              <div className="w-1.5 h-full bg-neutral-600 absolute top-0 right-0" />
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black text-neutral-400 uppercase tracking-wider">
                  IRRELEVANT
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-neutral-800 text-neutral-400 font-bold">
                  ۰ – ۱۹
                </span>
              </div>
              <h3 className="text-base font-bold text-white mb-2">نامرتبط / اسپم</h3>
              <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                گفتگوهای عمومی، احوالپرسی یا محتوای غیرتجاری. رادار این پیام‌ها را در سکوت فیلتر می‌کند.
              </p>
              <div className="text-[11px] text-neutral-500 bg-black/40 p-2.5 rounded-lg border border-[#1f1f1f]">
                نمونه: «سلام، وقتتون بخیر. کسی خبر داره جلسه وبینار چه ساعتی شروع میشه؟»
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            05 LEAD INTELLIGENCE (شناسنامه هوشمند هر سرنخ)
        ======================================================== */}
        <section id="lead-intelligence" className="py-20 px-4 sm:px-6 max-w-6xl mx-auto border-t border-[#161616]">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="text-xs font-semibold text-purple-400 tracking-wider uppercase mb-2">
              ۰۴ — شناسنامه هوشمند فرصت
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-4">
              برای هر سرنخ، اطلاعات آماده تصمیم‌گیری
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
              رادار تنها پیام را نشان نمی‌دهد؛ بلکه زمینه، استدلال، انطباق با محصول، پیش‌نویس پاسخ فروش و هزینه تحلیل را آماده در اختیار کارشناس می‌گذارد.
            </p>
          </div>

          {/* Interactive Lead Card Mock */}
          <div className="max-w-4xl mx-auto p-5 sm:p-7 rounded-3xl bg-[#0b0b0b] border border-[#232323] shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
            {/* Lead Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-[#1c1c1c]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#14231b] border border-[#234231] flex items-center justify-center text-[#00e599] font-bold">
                  <BaleIcon className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{DEMO_LEAD.author}</span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#182a1f] text-[#00e599] font-medium border border-[#21432f]">
                      {DEMO_LEAD.intentTier} ({DEMO_LEAD.intentScore}٪)
                    </span>
                  </div>
                  <div className="text-xs text-neutral-400 mt-0.5 flex items-center gap-2">
                    <span>{DEMO_LEAD.sourceName}</span>
                    <span>•</span>
                    <span>{DEMO_LEAD.timeAgo}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="px-2.5 py-1 rounded-md bg-[#161616] text-neutral-400 border border-[#262626]">
                  هزینه تحلیل: {DEMO_LEAD.analysisCost}
                </span>
                <span className="px-2.5 py-1 rounded-md bg-[#161616] text-neutral-400 border border-[#262626]">
                  زمان: {DEMO_LEAD.processingTime}
                </span>
              </div>
            </div>

            {/* Original Message */}
            <div className="my-5 p-4 rounded-xl bg-[#121212] border border-[#1f1f1f]">
              <div className="text-[11px] font-semibold text-neutral-400 mb-1.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                <span>پیام اصلی کاربر در جامعه آنلاین:</span>
              </div>
              <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed font-medium">
                «{DEMO_LEAD.rawMessage}»
              </p>
            </div>

            {/* AI Insights Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-5">
              {/* Reasoning */}
              <div className="p-4 rounded-xl bg-[#0f0f0f] border border-[#1d1d1d]">
                <div className="text-[11px] font-semibold text-amber-400 mb-1.5 flex items-center gap-1.5">
                  <FlameIcon className="w-3.5 h-3.5 text-amber-400" />
                  <span>استدلال و تشخیص قصد خرید (AI Reasoning):</span>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  {DEMO_LEAD.reasoning}
                </p>
              </div>

              {/* Product Match */}
              <div className="p-4 rounded-xl bg-[#0f0f0f] border border-[#1d1d1d]">
                <div className="text-[11px] font-semibold text-[#00e599] mb-1.5 flex items-center gap-1.5">
                  <SparklesIcon className="w-3.5 h-3.5 text-[#00e599]" />
                  <span>انطباق با قابلیت محصول (Product ICP Match):</span>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  {DEMO_LEAD.productMatch}
                </p>
              </div>
            </div>

            {/* Suggested Reply Box */}
            <div className="p-4 rounded-xl bg-[#141414] border border-[#282828] relative">
              <div className="flex items-center justify-between mb-2">
                <div className="text-[11px] font-semibold text-sky-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                  <span>متن پاسخ پیشنهادی رادار برای شروع مکالمه فروش:</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyReply}
                  className="px-2.5 py-1 rounded-md bg-[#202020] hover:bg-[#2b2b2b] text-neutral-300 hover:text-white text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <CheckIcon className="w-3.5 h-3.5 text-[#00e599]" />
                      <span className="text-[#00e599]">کپی شد</span>
                    </>
                  ) : (
                    <>
                      <CopyIcon className="w-3.5 h-3.5" />
                      <span>کپی پاسخ</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed bg-[#0b0b0b] p-3 rounded-lg border border-[#1f1f1f]">
                {DEMO_LEAD.suggestedReply}
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================
            06 COST TRANSPARENCY (شفافیت هزینه هوش مصنوعی)
        ======================================================== */}
        <section id="cost" className="py-20 px-4 sm:px-6 max-w-6xl mx-auto border-t border-[#161616]">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="text-xs font-semibold text-emerald-400 tracking-wider uppercase mb-2">
              ۰۵ — شفافیت در اقتصاد هوش مصنوعی
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-4">
              هزینه هوش مصنوعی پنهان نمی‌ماند.
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
              یک سوال بنیادین در محصولات مدرن هوش مصنوعی: «کشف یک سرنخ فروش واقعی چقدر داده و هزینه پردازش مصرف می‌کند؟» در رادار، هر توکن و سنت محاسبه می‌شود.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="p-6 rounded-2xl bg-[#0c0c0c] border border-[#1f1f1f] text-center">
              <div className="text-3xl sm:text-4xl font-extrabold text-white mb-2 font-mono">
                $0.00012
              </div>
              <div className="text-xs font-bold text-neutral-300 mb-2">میانگین هزینه ارزیابی هر پیام</div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                معادل حدود ۷ تا ۱۰ تومان برای استخراج کامل ساختار، ارزیابی نیت، استدلال و تطابق محصول با معماری هیبریدی.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0c0c0c] border border-[#1f1f1f] text-center">
              <div className="text-3xl sm:text-4xl font-extrabold text-[#00e599] mb-2 font-mono">
                ۹۸٪ کاهش هزینه
              </div>
              <div className="text-xs font-bold text-neutral-300 mb-2">در مقایسه با ساعت کاری SDR</div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                بررسی دستی ۱۰۰۰ پیام به بیش از ۵ ساعت زمان نیاز دارد؛ رادار همین حجم را ظرف چند ثانیه با کسری از دلار پالایش می‌کند.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0c0c0c] border border-[#1f1f1f] text-center">
              <div className="text-3xl sm:text-4xl font-extrabold text-sky-400 mb-2 font-mono">
                ۰ هزینه لایسنس کلاد
              </div>
              <div className="text-xs font-bold text-neutral-300 mb-2">معماری مستقل محلی</div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                پایگاه داده سبک PocketBase محلی و امکان اتصال به موتورهای استنتاج آفلاین (Ollama / vLLM) بدون قفل شدن روی کلادهای خارجی.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================
            07 RADAR ASSISTANT SECTION (دستیار هوشمند)
        ======================================================== */}
        <section className="py-20 px-4 sm:px-6 max-w-6xl mx-auto border-t border-[#161616]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#181818] border border-[#282828] text-xs text-neutral-300 mb-4">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                <span>دستیار هوشمند درون برنامه</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-4 leading-tight">
                دستیار هوشمند رادار:
                <br />
                کوپایلوت تیم فروش برای تصمیم‌گیری سریع
              </h2>
              <p className="text-neutral-400 text-sm sm:text-base leading-relaxed mb-6">
                دستیار رادار یک چت‌بات عمومی نیست؛ بلکه یک دستیار تخصصی است که به بانک سرنخ‌ها، امتیازات نیت، آمار پلتفرم‌ها و تنظیمات محصول دسترسی دارد و به سوالات کارشناس فروش پاسخ تحلیلی می‌دهد.
              </p>
              <div className="space-y-3 text-xs sm:text-sm text-neutral-300">
                <div className="flex items-center gap-2">
                  <span className="text-[#00e599] font-bold">✓</span>
                  <span>«سرنخ‌های با نیت بالای ۸۰ در تلگرام کدامند؟»</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#00e599] font-bold">✓</span>
                  <span>«چرا رادار این پیام را با نیت بالا طبقه‌بندی کرده است؟»</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#00e599] font-bold">✓</span>
                  <span>«میانگین هزینه تحلیل پیام‌ها تا امروز چقدر بوده؟»</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-[#0c0c0c] border border-[#242424] flex flex-col items-center justify-center text-center shadow-xl">
              <div className="w-24 h-24 mb-4 flex items-center justify-center">
                <VoiceOrb
                  activity={0.4}
                  speed={0.8}
                  colors={["#f0eee6", "#ffffff", "#0c0c0a"]}
                  className="w-24 h-24"
                />
              </div>
              <div className="text-sm font-bold text-white mb-1">گوی تعاملی دستیار هوشمند</div>
              <div className="text-xs text-neutral-400 max-w-xs">
                همیشه در گوشه پایین سمت راست در دسترس شماست و با ترنزیشن فیزیکی روان به دستورات پاسخ می‌دهد.
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            08 USE CASES (کاربردهای تجاری)
        ======================================================== */}
        <section className="py-20 px-4 sm:px-6 max-w-6xl mx-auto border-t border-[#161616]">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="text-xs font-semibold text-sky-400 tracking-wider uppercase mb-2">
              ۰۶ — کاربردهای تجاری
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-4">
              رادار برای چه کسانی ارزش خلق می‌کند؟
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
              از تیم‌های فروش B2B تا استارتاپ‌ها، رادار مسیر دستیابی به مشتریان را کوتاه‌تر می‌کند.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="p-5 rounded-2xl bg-[#0a0a0a] border border-[#1b1b1b]">
              <div className="text-sm font-bold text-white mb-2">هوشمندی فروش (Sales Intelligence)</div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                تیم‌های فروش پیش از آنکه مشتری سراغ رقیب برود، وارد گفتگو می‌شوند و نرخ تبدیل را چند برابر می‌کنند.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-[#0a0a0a] border border-[#1b1b1b]">
              <div className="text-sm font-bold text-white mb-2">پایش جوامع آنلاین (Community Monitoring)</div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                رصد مداوم گروه‌های تخصصی بدون نیاز به خواندن هزاران پیام پراکنده و زمان‌بر.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-[#0a0a0a] border border-[#1b1b1b]">
              <div className="text-sm font-bold text-white mb-2">کشف سرنخ داغ (Lead Discovery)</div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                شناسایی افرادی که علناً در جستجوی خرید سرویس و نرم‌افزار متناسب با محصولات شما هستند.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-[#0a0a0a] border border-[#1b1b1b]">
              <div className="text-sm font-bold text-white mb-2">تحقیقات بازار و رقبا (Market Research)</div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                فهم نقاط ضعف ابزارهای رقبا از زبان واقعی کاربران در گروه‌ها و فروم‌های عمومی.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-[#0a0a0a] border border-[#1b1b1b]">
              <div className="text-sm font-bold text-white mb-2">کشف نیاز و فیدبک محصول (Customer Discovery)</div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                تیم‌های محصول متوجه می‌شوند چه ویژگی‌هایی بیشترین درخواست را در بازار هدف دارند.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-[#0a0a0a] border border-[#1b1b1b]">
              <div className="text-sm font-bold text-white mb-2">استارتاپ‌های نوپا (Early Stage Startups)</div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                یافتن اولین مشتریان واقعی (First 100 Customers) بدون نیاز به بودجه‌های گزاف تبلیغات کلیکی.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================
            09 CREDIBLE MVP & ARCHITECTURE (صداقت در دمو و معماری)
        ======================================================== */}
        <section className="py-20 px-4 sm:px-6 max-w-6xl mx-auto border-t border-[#161616]">
          <div className="p-7 sm:p-10 rounded-3xl bg-[#0c0c0c] border border-[#242424]">
            <div className="max-w-3xl">
              <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">
                اصل صداقت در ارائه محصول (MVP Credibility)
              </div>
              <h2 className="text-xl sm:text-3xl font-extrabold text-white mb-4">
                معماری فعلی در برابر نقشه راه آینده
              </h2>
              <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed mb-6">
                رادار به عنوان یک سیستم ماژولار و توسعه‌پذیر طراحی شده است. نسخه فعلی MVP بر روی داده‌های اعتبارسنجی‌شده و شبیه‌سازی دقیق مکالمات جوامع ایرانی کار می‌کند، در حالی که لایه جمع‌آورنده‌های واقعی (Crawlers / Ingestion) در حال توسعه است.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-[#141414] border border-[#222222]">
                  <div className="font-bold text-[#00e599] mb-1.5 flex items-center gap-1.5">
                    <CheckCircle2Icon className="w-4 h-4 text-[#00e599]" />
                    <span>پیاده‌سازی‌شده در نسخه دمو فعلی:</span>
                  </div>
                  <ul className="space-y-1 text-neutral-400">
                    <li>• خط لوله تحلیل هوشمند نیت با LLM محلی/ابری</li>
                    <li>• پایگاه داده بلادرنگ PocketBase با پشتیبانی SSE</li>
                    <li>• تزریق زنده پیام‌ها و سنجش با مشخصات محصول (ICP)</li>
                    <li>• دستیار گفت‌وگویی مطلع از سرنخ‌ها و متریک‌ها</li>
                    <li>• محاسبه دقیق هزینه مصرفی توکن‌ها</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-[#141414] border border-[#222222]">
                  <div className="font-bold text-sky-400 mb-1.5 flex items-center gap-1.5">
                    <SparklesIcon className="w-4 h-4 text-sky-400" />
                    <span>نقشه راه فنی (Next Steps):</span>
                  </div>
                  <ul className="space-y-1 text-neutral-400">
                    <li>• اتصال کراولرهای رسمی پلتفرم‌های پیام‌رسان</li>
                    <li>• یکپارچگی دوطرفه با CRM‌های سازمانی (دیدار، هاب‌اسپات)</li>
                    <li>• معماری چندسازمانی (Multi-Tenant SaaS)</li>
                    <li>• حافظه تاریخی بلندمدت رفتاری سرنخ‌ها</li>
                    <li>• مدل‌های اختصاصی نیت‌سنجی گفتار فارسی</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            10 FINAL CTA SECTION
        ======================================================== */}
        <section className="py-24 px-4 sm:px-6 max-w-4xl mx-auto text-center border-t border-[#161616]">
          <h2 className="text-3xl sm:text-5xl font-black text-white mb-6 tracking-tight leading-tight">
            جست‌وجوی دستی در میان هیاهو را متوقف کنید.
            <br />
            <span className="text-white underline decoration-white/40 underline-offset-8">
              فرصت‌های واقعی خرید را شکار کنید.
            </span>
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base mb-10 max-w-xl mx-auto leading-relaxed">
            موتور هوشمندی فرصت رادار آماده است تا تفاوت میان پارازیت‌های روزمره و فرصت‌های واقعی فروش را به شما نشان دهد.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="w-full sm:w-auto h-12 px-8 rounded-xl font-bold text-sm bg-white text-black hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(255,255,255,0.25)] active:scale-95 cursor-pointer"
            >
              <PlayIcon className="w-4 h-4 text-black" />
              <span>ورود به داشبورد رادار (Live Demo)</span>
            </Link>

            <Link
              href="/pitch"
              className="w-full sm:w-auto h-12 px-8 rounded-xl font-semibold text-sm bg-[#121212] hover:bg-[#1a1918] text-white border border-[#2d2d2a] hover:border-neutral-500 transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
            >
              <span>مشاهده اسلایدهای ارائه (Pitch Deck)</span>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#171717] bg-[#050505] py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-neutral-500">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded bg-white text-black flex items-center justify-center font-bold">
              <RadarLogo className="w-3.5 h-3.5 text-black" />
            </div>
            <span className="font-bold text-white text-sm">رادار (Radar)</span>
            <span>—</span>
            <span>از میان هیاهو تا فرصت فروش (From Noise to Opportunity)</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-white transition-colors">
              داشبورد
            </Link>
            <Link href="/pitch" className="hover:text-white transition-colors">
              پیچ‌دک ارائه
            </Link>
            <Link href="/settings" className="hover:text-white transition-colors">
              تنظیمات ICP
            </Link>
            <span className="text-neutral-400 font-semibold">توسعه توسط تیم PriCoders</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
