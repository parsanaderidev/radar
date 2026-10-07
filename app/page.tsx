"use client";

import React, { useState } from "react";
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
  SettingsIcon,
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

export default function VercelStyleLandingPage() {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"lead" | "raw" | "reasoning">("lead");

  const handleCopyReply = () => {
    navigator.clipboard.writeText(DEMO_LEAD.suggestedReply);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#000000] text-[#ededed] selection:bg-white selection:text-black font-sans antialiased">
      {/* Vercel Ambient Glow Gradients */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] bg-gradient-to-b from-[#222222]/20 via-[#111111]/10 to-transparent blur-[140px] rounded-full" />
        <div className="absolute top-[800px] left-1/4 w-[500px] h-[300px] bg-gradient-to-tr from-[#00e599]/5 to-transparent blur-[120px] rounded-full" />
      </div>

      {/* ========================================================
          VERCEL-STYLE STICKY HEADER
      ======================================================== */}
      <header className="sticky top-0 z-50 w-full border-b border-[#181818] bg-black/80 backdrop-blur-xl transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-4">
          {/* Left: Brand Identity */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 group cursor-pointer">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white text-black flex items-center justify-center font-bold shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_16px_rgba(255,255,255,0.4)]">
                <RadarLogo className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-black" />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base text-white tracking-tight">رادار</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#141414] text-neutral-400 border border-[#262626] font-mono">
                  PriCoders
                </span>
              </div>
            </Link>
          </div>

          {/* Center: Vercel-Style Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs text-neutral-400 font-medium">
            <a href="#pipeline" className="hover:text-white transition-colors">
              خط لوله هوشمندی
            </a>
            <a href="#intent" className="hover:text-white transition-colors">
              موتور نیت‌سنجی
            </a>
            <a href="#preview" className="hover:text-white transition-colors">
              شناسنامه فرصت
            </a>
            <a href="#economics" className="hover:text-white transition-colors">
              اقتصاد هوش مصنوعی
            </a>
            <a href="#use-cases" className="hover:text-white transition-colors">
              کاربردها
            </a>
            <Link href="/settings" className="hover:text-white transition-colors flex items-center gap-1">
              <span>تنظیمات ICP</span>
            </Link>
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-2.5">
            <Link
              href="/login"
              className="hidden sm:inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              ورود
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 h-8 sm:h-9 px-3.5 sm:px-4 rounded-lg text-xs font-semibold bg-white text-black hover:bg-neutral-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] active:scale-95 cursor-pointer"
            >
              <span>داشبورد رادار</span>
              <span className="text-black font-mono">←</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        {/* ========================================================
            01 HERO SECTION (Vercel Aesthetics)
        ======================================================== */}
        <section className="pt-16 pb-20 sm:pt-24 sm:pb-32 px-4 sm:px-6 max-w-5xl mx-auto text-center">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0a0a0a] border border-[#222222] hover:border-neutral-600 transition-colors text-xs text-neutral-300 mb-8 shadow-inner">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00e599] animate-pulse-glow" />
            <span className="font-medium">Opportunity Intelligence Engine</span>
            <span className="text-neutral-600">|</span>
            <span className="text-neutral-400">توسعه توسط PriCoders</span>
          </div>

          {/* Master Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.2] sm:leading-[1.15] mb-6">
            هزاران پیام و گفت‌وگو.
            <br />
            <span className="bg-gradient-to-b from-white via-neutral-200 to-neutral-500 bg-clip-text text-transparent">
              تنها چند فرصت خرید واقعی.
            </span>
            <br />
            <span className="text-white underline decoration-neutral-700 underline-offset-8">
              رادار آن‌ها را کشف می‌کند.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-lg text-neutral-400 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            رادار گفت‌وگوهای روزمره در جوامع آنلاین را می‌شنود، بافت و زمینه را درک می‌کند، سیگنال‌های خرید را می‌سنجد و آن‌ها را به فرصت‌های آماده اقدام برای تیم فروش تبدیل می‌کند.
          </p>

          {/* Vercel Tagline Banner */}
          <div className="inline-flex items-center justify-center gap-2.5 px-4 py-2 rounded-xl bg-[#0a0a0a] border border-[#1e1e1e] text-xs sm:text-sm text-neutral-300 mb-10 font-mono shadow-sm">
            <span className="text-neutral-500">ارزش محوری:</span>
            <span className="font-bold text-white tracking-wide">از میان هیاهو تا فرصت فروش</span>
            <span className="text-neutral-600 text-xs">(From Noise to Opportunity)</span>
          </div>

          {/* Primary CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md mx-auto mb-16">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto h-11 px-7 rounded-xl font-bold text-xs sm:text-sm bg-white text-black hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(255,255,255,0.25)] active:scale-95 cursor-pointer"
            >
              <SparklesIcon className="w-4 h-4 text-black" />
              <span>ورود به داشبورد و دمو زنده</span>
            </Link>

            <a
              href="#pipeline"
              className="w-full sm:w-auto h-11 px-6 rounded-xl font-medium text-xs sm:text-sm bg-[#0c0c0c] hover:bg-[#161616] text-white border border-[#242424] hover:border-neutral-500 transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
            >
              <span>مشاهده معماری خط لوله</span>
              <span className="text-neutral-500">↓</span>
            </a>
          </div>

          {/* Vercel-Style Live Stream Hero Showcase */}
          <div className="max-w-4xl mx-auto rounded-2xl bg-[#080808] border border-[#1f1f1f] shadow-[0_20px_70px_rgba(0,0,0,0.9)] overflow-hidden text-right">
            {/* Window Topbar */}
            <div className="h-10 px-4 border-b border-[#181818] bg-[#0c0c0c] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#262626]" />
                <span className="w-3 h-3 rounded-full bg-[#262626]" />
                <span className="w-3 h-3 rounded-full bg-[#262626]" />
                <span className="mr-2 text-[11px] font-mono text-neutral-500">radar-opportunity-engine.local</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-mono text-[#00e599]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00e599] animate-pulse-glow" />
                <span>REALTIME STREAM ACTIVE</span>
              </div>
            </div>

            {/* Showcase Body */}
            <div className="p-5 sm:p-7">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4 text-xs">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-[#161616] text-white font-mono font-semibold border border-[#262626]">
                    سرنخ شناسایی‌شده
                  </span>
                  <span className="text-neutral-400">منبع: پیام‌رسان بله (کانال و گروه کسب‌وکار)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#00e599]/15 text-[#00e599] border border-[#00e599]/30 font-bold">
                    نمره نیت: ۹۴٪ (HIGH INTENT)
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#0f0f0f] border border-[#1c1c1c] mb-4 text-xs sm:text-sm text-neutral-200 leading-relaxed">
                «ما برای تیم ۲۰ نفرمون به شدت دنبال یه راهکار مطمئن اتوماسیون پیگیری لیدها هستیم. بودجه ماهانه آماده داریم. چه ابزاری پیشنهاد می‌دید؟»
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-[#0a0a0a] border border-[#171717]">
                  <div className="text-[10px] text-neutral-500 mb-1">استدلال هوش مصنوعی</div>
                  <div className="text-neutral-300 font-medium">بیان نیاز مشخص + بودجه آماده + فوریت تیمی</div>
                </div>
                <div className="p-3 rounded-lg bg-[#0a0a0a] border border-[#171717]">
                  <div className="text-[10px] text-neutral-500 mb-1">انطباق با محصول (ICP)</div>
                  <div className="text-[#00e599] font-medium">پایش خودکار و غربالگری هوشمند لیدها</div>
                </div>
                <div className="p-3 rounded-lg bg-[#0a0a0a] border border-[#171717]">
                  <div className="text-[10px] text-neutral-500 mb-1">هزینه محاسبه‌شده توکن</div>
                  <div className="text-sky-400 font-mono font-medium">$0.00014 (~۹ تومان)</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            02 THE PROBLEM (Noise vs. Signal)
        ======================================================== */}
        <section id="problem" className="py-20 px-4 sm:px-6 max-w-6xl mx-auto border-t border-[#141414]">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="text-xs font-mono font-bold text-rose-400 tracking-wider uppercase mb-2">
              01 // THE PROBLEM
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-4">
              هزاران مکالمه روزانه؛ مدفون در دل اقیانوس پارازیت.
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
              خریداران واقعی در حال شرح مشکلاتشان در کانال‌ها و گروه‌ها هستند، اما روش‌های دستی جستجو فلج‌کننده و پرهزینه‌اند.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Chaos Card */}
            <div className="p-6 rounded-2xl bg-[#090909] border border-[#1c1c1c] flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4 text-xs font-bold text-rose-400 font-mono">
                  <span>TRADITIONAL SDR BOTTLENECK</span>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="p-3 rounded-lg bg-[#111111] border border-[#1a1a1a] text-xs text-neutral-500">
                    «سلام دوستان، کسی لینک دانلود رو داره؟» (اسپم / بی‌فایده)
                  </div>
                  <div className="p-3 rounded-lg bg-[#111111] border border-[#1a1a1a] text-xs text-neutral-500">
                    «تبلیغ ویژه سرور مجازی با ۵۰ درصد تخفیف...» (تبلیغات هرز)
                  </div>
                  <div className="p-3.5 rounded-lg bg-[#1a1410] border border-amber-800/60 text-xs text-amber-200">
                    <span className="font-bold text-amber-400">فرصت واقعی خریدار (پنهان در اعماق): </span>
                    «ما دنبال نرم‌افزار مدیریت لید هستیم و ماهانه تا ۱۵ میلیون بودجه داریم...»
                  </div>
                </div>
              </div>
              <div className="text-xs text-neutral-400 pt-4 border-t border-[#161616]">
                اتلاف روزانه ۳ ساعت زمان کارشناس فروش فقط برای خواندن متن‌های نامرتبط.
              </div>
            </div>

            {/* Radar Solution Card */}
            <div className="p-6 rounded-2xl bg-[#090909] border border-[#1c1c1c] flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4 text-xs font-bold text-[#00e599] font-mono">
                  <span>RADAR CONTEXTUAL INTELLIGENCE</span>
                </div>
                <blockquote className="text-base sm:text-lg font-bold text-white leading-relaxed mb-4 border-r-2 border-[#00e599] pr-3">
                  «رادار به جای تطبیق سطحی چند کلمه کلیدی، کل مکالمه، بافت نیاز و فوریت تجاری خریدار را می‌فهمد.»
                </blockquote>
                <div className="space-y-2 text-xs text-neutral-300">
                  <div className="flex items-center gap-2">
                    <span className="text-[#00e599] font-bold">✓</span>
                    <span>استخراج دقیق نیاز اصلی بدون خطای کلمات کلیدی تصادفی</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#00e599] font-bold">✓</span>
                    <span>سنجش تطابق درد مشتری با قابلیت‌های محصول تعریف‌شده شما (ICP)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#00e599] font-bold">✓</span>
                    <span>ارائه پیش‌نویس پاسخ فروش برای ورود فوری به مذاکره</span>
                  </div>
                </div>
              </div>
              <div className="text-xs text-neutral-400 pt-4 border-t border-[#161616]">
                نتیجه: تمرکز ۱۰۰٪ تیم فروش روی افرادی که هم‌اکنون آماده خرید هستند.
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            03 THE 5-STAGE PIPELINE (Vercel-Style Process)
        ======================================================== */}
        <section id="pipeline" className="py-20 px-4 sm:px-6 max-w-6xl mx-auto border-t border-[#141414]">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="text-xs font-mono font-bold text-sky-400 tracking-wider uppercase mb-2">
              02 // THE PIPELINE
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-4">
              خط لوله هوشمندی رادار در ۵ گام
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
              از دریافت پیام‌های جوامع آنلاین تا آماده‌سازی اقدام قطعی برای کارشناس فروش.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5">
            <div className="p-5 rounded-2xl bg-[#090909] border border-[#1b1b1b] flex flex-col justify-between hover:border-neutral-700 transition-colors">
              <div>
                <div className="text-[11px] font-mono font-bold text-neutral-500 mb-2">01 // COLLECT</div>
                <h3 className="text-sm font-bold text-white mb-2">جمع‌آوری پیام</h3>
                <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                  دریافت پیام‌ها از بله، تلگرام، توییتر و انجمن‌های تخصصی.
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-neutral-400">
                <BaleIcon className="w-3.5 h-3.5 text-[#00e599]" />
                <TelegramIcon className="w-3.5 h-3.5 text-sky-400" />
                <TwitterXIcon className="w-3.5 h-3.5 text-neutral-300" />
                <ForumIcon className="w-3.5 h-3.5 text-purple-400" />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#090909] border border-[#1b1b1b] flex flex-col justify-between hover:border-neutral-700 transition-colors">
              <div>
                <div className="text-[11px] font-mono font-bold text-sky-400 mb-2">02 // UNDERSTAND</div>
                <h3 className="text-sm font-bold text-white mb-2">درک بافت</h3>
                <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                  تحلیل معنایی بافت مکالمه و لحن گوینده با LLM محلی/ابری.
                </p>
              </div>
              <span className="text-[10px] text-sky-400 font-mono">Semantic Parser</span>
            </div>

            <div className="p-5 rounded-2xl bg-[#090909] border border-[#1b1b1b] flex flex-col justify-between hover:border-neutral-700 transition-colors">
              <div>
                <div className="text-[11px] font-mono font-bold text-amber-400 mb-2">03 // SCORE</div>
                <h3 className="text-sm font-bold text-white mb-2">امتیازدهی نیت</h3>
                <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                  محاسبه نمره ۰ تا ۱۰۰ شدت قصد خرید و تطابق با محصول.
                </p>
              </div>
              <span className="text-[10px] text-amber-400 font-mono">0 - 100 Metric</span>
            </div>

            <div className="p-5 rounded-2xl bg-[#090909] border border-[#1b1b1b] flex flex-col justify-between hover:border-neutral-700 transition-colors">
              <div>
                <div className="text-[11px] font-mono font-bold text-[#00e599] mb-2">04 // PRIORITIZE</div>
                <h3 className="text-sm font-bold text-white mb-2">اولویت‌بندی</h3>
                <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                  رتبه‌بندی فرصت‌های طلایی و فیلتر کردن اتوماتیک پیام‌های بی‌ربط.
                </p>
              </div>
              <span className="text-[10px] text-[#00e599] font-mono">High Intent First</span>
            </div>

            <div className="p-5 rounded-2xl bg-[#090909] border border-[#1b1b1b] flex flex-col justify-between hover:border-neutral-700 transition-colors">
              <div>
                <div className="text-[11px] font-mono font-bold text-purple-400 mb-2">05 // ACT</div>
                <h3 className="text-sm font-bold text-white mb-2">اقدام فروش</h3>
                <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                  ارائه سناریوی پاسخ، استدلال و محاسبه هزینه برای شروع مذاکره.
                </p>
              </div>
              <span className="text-[10px] text-purple-400 font-mono">Draft & Copy</span>
            </div>
          </div>
        </section>

        {/* ========================================================
            04 INTENT ENGINE (4 Tiers)
        ======================================================== */}
        <section id="intent" className="py-20 px-4 sm:px-6 max-w-6xl mx-auto border-t border-[#141414]">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="text-xs font-mono font-bold text-[#00e599] tracking-wider uppercase mb-2">
              03 // INTENT ENGINE
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-4">
              تفکیک ۴ سطح شدت قصد خرید
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
              رادار پیام‌ها را بر اساس میزان تمایل خریدار به حل مشکل و پتانسیل تجاری در ۴ سطح رده‌بندی می‌کند.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-[#080d09] border border-[#16301e] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-black text-[#00e599] font-mono">HIGH INTENT</span>
                  <span className="text-xs font-mono font-bold text-[#00e599]">۷۵ – ۱۰۰</span>
                </div>
                <h3 className="text-sm font-bold text-white mb-2">قصد صریح خرید</h3>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  نیاز فوری، اعلام بودجه یا جستجوی راه‌حل. اولویت شماره یک تیم فروش برای تماس فوری.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#0e0c06] border border-[#2d220e] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-black text-amber-400 font-mono">PROBLEM AWARE</span>
                  <span className="text-xs font-mono font-bold text-amber-400">۴۵ – ۷۴</span>
                </div>
                <h3 className="text-sm font-bold text-white mb-2">آگاه از چالش</h3>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  کاربر با درد مشخصی روبروست و به دنبال راهکار و مقایسه سرویس‌ها می‌گردد.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#070b0f] border border-[#142330] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-black text-sky-400 font-mono">CURIOUS</span>
                  <span className="text-xs font-mono font-bold text-sky-400">۲۰ – ۴۴</span>
                </div>
                <h3 className="text-sm font-bold text-white mb-2">کنجکاو / سوال کلی</h3>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  علاقه اولیه یا پرسش عمومی بدون فوریت زمانی در حال حاضر.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#0a0a0a] border border-[#1c1c1c] flex flex-col justify-between opacity-75">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-black text-neutral-400 font-mono">IRRELEVANT</span>
                  <span className="text-xs font-mono font-bold text-neutral-400">۰ – ۱۹</span>
                </div>
                <h3 className="text-sm font-bold text-white mb-2">نامرتبط / اسپم</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  پیام‌های عمومی و غیرتجاری که به صورت خودکار فیلتر و بایگانی می‌شوند.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            05 LEAD INTELLIGENCE INSPECTOR (Vercel-Style Component)
        ======================================================== */}
        <section id="preview" className="py-20 px-4 sm:px-6 max-w-5xl mx-auto border-t border-[#141414]">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="text-xs font-mono font-bold text-purple-400 tracking-wider uppercase mb-2">
              04 // LEAD INTELLIGENCE
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-4">
              شناسنامه هوشمند هر فرصت
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
              برای هر سرنخ، تمام اطلاعات مورد نیاز برای تصمیم‌گیری و اقدام فروش با یک کلیک در دسترس است.
            </p>
          </div>

          <div className="rounded-2xl bg-[#090909] border border-[#1f1f1f] shadow-2xl overflow-hidden text-right">
            {/* Topbar */}
            <div className="h-12 px-4 border-b border-[#181818] bg-[#0d0d0d] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-xs">{DEMO_LEAD.author}</span>
                <span className="text-[10px] text-neutral-400 font-mono">({DEMO_LEAD.sourceName})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#00e599]/15 text-[#00e599] border border-[#00e599]/30 font-bold">
                  نمره نیت: {DEMO_LEAD.intentScore}٪
                </span>
                <span className="text-[10px] font-mono text-neutral-400">{DEMO_LEAD.analysisCost}</span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="mb-4">
                <div className="text-[11px] font-mono text-neutral-400 mb-1">پیام اصلی کاربر در منبع:</div>
                <div className="p-3.5 rounded-xl bg-[#121212] border border-[#1f1f1f] text-xs sm:text-sm text-neutral-200 leading-relaxed font-medium">
                  «{DEMO_LEAD.rawMessage}»
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                <div className="p-3.5 rounded-xl bg-[#0d0d0d] border border-[#1a1a1a]">
                  <div className="text-[11px] font-bold text-amber-400 mb-1 flex items-center gap-1.5">
                    <FlameIcon className="w-3.5 h-3.5 text-amber-400" />
                    <span>استدلال و تشخیص هوش مصنوعی:</span>
                  </div>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    {DEMO_LEAD.reasoning}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#0d0d0d] border border-[#1a1a1a]">
                  <div className="text-[11px] font-bold text-[#00e599] mb-1 flex items-center gap-1.5">
                    <SparklesIcon className="w-3.5 h-3.5 text-[#00e599]" />
                    <span>انطباق با محصول (ICP Match):</span>
                  </div>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    {DEMO_LEAD.productMatch}
                  </p>
                </div>
              </div>

              {/* Reply box */}
              <div className="p-4 rounded-xl bg-[#121212] border border-[#222222]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-sky-400">پیش‌نویس پاسخ آماده برای نماینده فروش:</span>
                  <button
                    type="button"
                    onClick={handleCopyReply}
                    className="px-2.5 py-1 rounded-md bg-[#1f1f1f] hover:bg-[#2a2a2a] text-neutral-300 hover:text-white text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
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
                <p className="text-xs text-neutral-200 leading-relaxed bg-[#0a0a0a] p-3 rounded-lg border border-[#1a1a1a]">
                  {DEMO_LEAD.suggestedReply}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            06 ECONOMICS & TRANSPARENCY (Vercel Metrics Style)
        ======================================================== */}
        <section id="economics" className="py-20 px-4 sm:px-6 max-w-6xl mx-auto border-t border-[#141414]">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="text-xs font-mono font-bold text-emerald-400 tracking-wider uppercase mb-2">
              05 // AI ECONOMICS
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-4">
              شفافیت کامل در هزینه‌های هوش مصنوعی
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
              هزینه کشف هر فرصت چقدر است؟ در رادار، هیچ هزینه محاسباتی پنهان نمی‌ماند.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#090909] border border-[#1b1b1b] text-center">
              <div className="text-3xl sm:text-4xl font-black text-white mb-2 font-mono">
                $0.00012
              </div>
              <div className="text-xs font-bold text-neutral-300 mb-2 font-mono">AVG COST / MESSAGE</div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                حدود ۷ تا ۱۰ تومان برای تحلیل کامل معنایی، نیت‌سنجی، استدلال و پیشنهاد پاسخ با معماری هیبریدی.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#090909] border border-[#1b1b1b] text-center">
              <div className="text-3xl sm:text-4xl font-black text-[#00e599] mb-2 font-mono">
                ۹۸٪ صرفه‌جویی
              </div>
              <div className="text-xs font-bold text-neutral-300 mb-2 font-mono">VS MANUAL SDR TIME</div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                بررسی دستی ۱۰۰۰ پیام ساعت‌ها زمان می‌برد؛ رادار در چند ثانیه با هزینه ناچیز فرصت‌ها را جدا می‌کند.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#090909] border border-[#1b1b1b] text-center">
              <div className="text-3xl sm:text-4xl font-black text-sky-400 mb-2 font-mono">
                ۱۰۰٪ مستقل
              </div>
              <div className="text-xs font-bold text-neutral-300 mb-2 font-mono">LOCAL & OFFLINE READY</div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                پایگاه داده محلی PocketBase و امکان اتصال به موتورهای محلی Ollama و vLLM بدون قفل شدن روی کلادهای خارجی.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================
            07 RADAR ASSISTANT (Vercel-style AI co-pilot preview)
        ======================================================== */}
        <section className="py-20 px-4 sm:px-6 max-w-5xl mx-auto border-t border-[#141414]">
          <div className="p-8 sm:p-12 rounded-3xl bg-[#080808] border border-[#1f1f1f] flex flex-col md:flex-row items-center justify-between gap-8 text-right">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121212] border border-[#242424] text-xs text-neutral-300 mb-4 font-mono">
                <span>AI CO-PILOT</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
                دستیار هوشمند رادار: کوپایلوت تیم فروش
              </h2>
              <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed mb-6">
                دستیار رادار به صورت زنده به دیتابیس لیدها، امتیازات نیت و متریک‌های سیستم دسترسی دارد و با یک کلیک در گوشه تصویر آماده پاسخگویی به تحلیل‌های فروش شماست.
              </p>
              <div className="space-y-2 text-xs text-neutral-300 font-medium">
                <div>• «کدام لیدهای بله بیشترین امتیاز نیت خرید را دارند؟»</div>
                <div>• «استدلال رادار برای پیام علیرضا فراهانی چه بوده است؟»</div>
                <div>• «میانگین هزینه ارزیابی پیام‌ها تا امروز چقدر ثبت شده؟»</div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-[#0e0e0e] border border-[#222222]">
              <div className="w-20 h-20 mb-3 flex items-center justify-center">
                <VoiceOrb
                  activity={0.3}
                  speed={0.7}
                  colors={["#f0eee6", "#ffffff", "#0c0c0a"]}
                  className="w-20 h-20"
                />
              </div>
              <span className="text-xs font-bold text-white mb-1">دستیار رادار</span>
              <span className="text-[10px] text-neutral-400 font-mono">همیشه حاضر در گوشه صفحه</span>
            </div>
          </div>
        </section>

        {/* ========================================================
            08 USE CASES (Bento Grid)
        ======================================================== */}
        <section id="use-cases" className="py-20 px-4 sm:px-6 max-w-6xl mx-auto border-t border-[#141414]">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="text-xs font-mono font-bold text-neutral-400 tracking-wider uppercase mb-2">
              06 // USE CASES
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-4">
              کاربردهای رادار برای رشد کسب‌وکار
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
              طراحی شده برای تیم‌های فروش سازمانی، بازاریابی B2B و استارتاپ‌های محصول‌محور.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-[#080808] border border-[#1a1a1a]">
              <div className="font-bold text-white text-sm mb-2">هوشمندی فروش (Sales Intelligence)</div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                ورود زودهنگام به گفتگو پیش از آنکه مشتری به راهکار رقیب مراجعه کند.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-[#080808] border border-[#1a1a1a]">
              <div className="font-bold text-white text-sm mb-2">پایش پیوسته جوامع (Community Monitoring)</div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                پایش ۲۴ ساعته کانال‌ها و گروه‌های تخصصی بدون نیاز به نیروی انسانی شیفت.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-[#080808] border border-[#1a1a1a]">
              <div className="font-bold text-white text-sm mb-2">کشف مشتریان اولیه (Startup Discovery)</div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                یافتن ۱۰۰ مشتری اول برای استارتاپ‌های نوپا بدون صرف هزینه‌های سنگین تبلیغات کلیکی.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-[#080808] border border-[#1a1a1a]">
              <div className="font-bold text-white text-sm mb-2">تحقیقات رقبا (Competitive Intelligence)</div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                فهم نقاط ضعف ابزارهای رقبا مستقیماً از زبان گلایه‌های کاربران در جوامع آنلاین.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-[#080808] border border-[#1a1a1a]">
              <div className="font-bold text-white text-sm mb-2">توسعه محصول بر مبنای نیاز (Customer Pain)</div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                شناسایی فیچرهایی که بیشترین تکرار درخواست را از طرف مشتریان دارند.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-[#080808] border border-[#1a1a1a]">
              <div className="font-bold text-white text-sm mb-2">شرکت‌های خدمات و آژانس‌ها (Agencies)</div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                پیدا کردن پروژه‌ها و کارفرمایان بالقوه در گروه‌های تخصصی برنامه‌نویسی و دیجیتال مارکتینگ.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================
            09 VERCEL-STYLE GIANT CTA SECTION
        ======================================================== */}
        <section className="py-24 sm:py-32 px-4 sm:px-6 max-w-4xl mx-auto text-center border-t border-[#141414] relative">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[600px] h-[300px] bg-gradient-to-b from-white/5 to-transparent blur-[120px] rounded-full" />
          </div>

          <div className="relative z-10">
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white mb-6 tracking-tight leading-tight">
              جست‌وجوی دستی در میان هیاهو را متوقف کنید.
              <br />
              <span className="text-white underline decoration-neutral-600 underline-offset-8">
                فرصت‌های واقعی خرید را شکار کنید.
              </span>
            </h2>

            <p className="text-neutral-400 text-sm sm:text-base mb-10 max-w-lg mx-auto leading-relaxed">
              داشبورد عملیاتی رادار آماده است تا تفاوت میان نویزهای بی‌ارزش و خریداران واقعی را به شما نشان دهد.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/dashboard"
                className="w-full sm:w-auto h-12 px-8 rounded-xl font-bold text-xs sm:text-sm bg-white text-black hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 shadow-[0_0_35px_rgba(255,255,255,0.3)] active:scale-95 cursor-pointer"
              >
                <SparklesIcon className="w-4 h-4 text-black" />
                <span>ورود به داشبورد رادار (Live Demo)</span>
              </Link>

              <Link
                href="/settings"
                className="w-full sm:w-auto h-12 px-8 rounded-xl font-medium text-xs sm:text-sm bg-[#111111] hover:bg-[#1a1a1a] text-white border border-[#262626] hover:border-neutral-500 transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
              >
                <SettingsIcon className="w-4 h-4" />
                <span>تنظیمات پرسونای محصول (ICP)</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ========================================================
          VERCEL-STYLE MULTI-COLUMN FOOTER
      ======================================================== */}
      <footer className="border-t border-[#141414] bg-[#050505] pt-14 pb-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Top Multi-Column Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 text-xs">
            {/* Col 1: Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-6 h-6 rounded-md bg-white text-black flex items-center justify-center font-bold">
                  <RadarLogo className="w-3.5 h-3.5 text-black" />
                </div>
                <span className="font-bold text-white text-sm">رادار (Radar)</span>
              </div>
              <p className="text-neutral-400 text-xs leading-relaxed mb-4">
                موتور هوشمندی فرصت‌های فروش برای کشف و اولویت‌بندی سیگنال‌های خرید در گفت‌وگوهای آنلاین.
              </p>
              <div className="text-[11px] font-mono text-neutral-500">
                DEVELOPED BY PRICODERS
              </div>
            </div>

            {/* Col 2: Product */}
            <div>
              <div className="font-bold text-white mb-3">محصول و ابزارها</div>
              <ul className="space-y-2 text-neutral-400">
                <li>
                  <Link href="/dashboard" className="hover:text-white transition-colors">
                    داشبورد عملیاتی لیدها
                  </Link>
                </li>
                <li>
                  <Link href="/settings" className="hover:text-white transition-colors">
                    تنظیمات محصول و ICP
                  </Link>
                </li>
                <li>
                  <a href="#pipeline" className="hover:text-white transition-colors">
                    خط لوله ۵ مرحله‌ای
                  </a>
                </li>
                <li>
                  <a href="#intent" className="hover:text-white transition-colors">
                    موتور نیت‌سنجی
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 3: Architecture & Privacy */}
            <div>
              <div className="font-bold text-white mb-3">معماری و امنیت</div>
              <ul className="space-y-2 text-neutral-400">
                <li>
                  <a href="#economics" className="hover:text-white transition-colors">
                    شفافیت هزینه توکن
                  </a>
                </li>
                <li>
                  <span className="text-neutral-400">دیتابیس محلی PocketBase</span>
                </li>
                <li>
                  <span className="text-neutral-400">پشتیبانی رویدادهای زنده SSE</span>
                </li>
                <li>
                  <span className="text-neutral-400">فال‌بک چندلایه‌ای LLM</span>
                </li>
              </ul>
            </div>

            {/* Col 4: PriCoders */}
            <div>
              <div className="font-bold text-white mb-3">درباره PriCoders</div>
              <ul className="space-y-2 text-neutral-400">
                <li>
                  <span className="text-neutral-400">توسعه توسط تیم PriCoders</span>
                </li>
                <li>
                  <span className="text-neutral-400">نسخه MVP آماده ارزیابی</span>
                </li>
                <li>
                  <span className="text-neutral-400">پاییز ۱۴۰۴</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-[#141414] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00e599]" />
              <span>تمام سیستم‌های رادار فعال و متصل هستند.</span>
            </div>

            <div>
              © 2026 PriCoders. از میان هیاهو تا فرصت فروش (From Noise to Opportunity).
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
