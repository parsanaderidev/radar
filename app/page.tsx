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
  SettingsIcon,
} from "@/components/Icons";
import { VoiceOrb } from "@/components/agents/voice-orb";

/* -------------------------------------------------------------------------- */
/* SAMPLE INTERACTIVE FEED DATA FOR VERCEL-STYLE TERMINAL                    */
/* -------------------------------------------------------------------------- */
interface SampleFeedItem {
  id: string;
  platform: "bale" | "telegram" | "twitter" | "forum";
  platformName: string;
  author: string;
  timeAgo: string;
  score: number;
  tier: "HIGH INTENT" | "PROBLEM AWARE" | "CURIOUS" | "IRRELEVANT";
  tierColor: string;
  rawMessage: string;
  reasoning: string;
  productMatch: string;
  suggestedReply: string;
  cost: string;
}

const SAMPLE_LEADS: SampleFeedItem[] = [
  {
    id: "lead-1",
    platform: "bale",
    platformName: "بله / گروه فین‌تک و استارتاپ",
    author: "علیرضا فراهانی (مدیر عملیات)",
    timeAgo: "۱۰ دقیقه پیش",
    score: 94,
    tier: "HIGH INTENT",
    tierColor: "#00e599",
    rawMessage:
      "ما برای تیم ۲۰ نفرمون به شدت دنبال یه راهکار مطمئن اتوماسیون پیگیری لیدها در کانال‌ها هستیم. روزی ۳ ساعت وقت تیم فروش هدر میره. بودجه ماهانه آماده تا ۱۵ میلیون داریم. چه نرم‌افزاری پیشنهاد می‌دید؟",
    reasoning:
      "اعلام صریح مشکل اتلاف زمان (۳ ساعت روزانه)، ابعاد تیم (۲۰ نفر)، سقف بودجه قطعی (۱۵ میلیون تومان) و فوریت بالا در انتخاب ابزار.",
    productMatch: "سیستم پایش و غربالگری هوشمند لید با انطباق ICP رادار",
    suggestedReply:
      "درود علیرضا عزیز، رادار دقیقاً این چالش را حل می‌کند: پایش خودکار مکالمات و استخراج سرنخ‌های آماده خرید بدون دخالت دستی. خوشحال می‌شویم یک جلسه دموی زنده روی کانال‌های هدف شما هماهنگ کنیم.",
    cost: "$0.00014 (~۹ تومان)",
  },
  {
    id: "lead-2",
    platform: "telegram",
    platformName: "تلگرام / سوپرگروه مدیران فروش B2B",
    author: "سارا موحد (مدیر رشد)",
    timeAgo: "۲۵ دقیقه پیش",
    score: 82,
    tier: "HIGH INTENT",
    tierColor: "#00e599",
    rawMessage:
      "کسی تجربه استفاده از سرویس‌های ایرانی برای کشف مشتریان بالقوه در گروه‌ها داره؟ دنبال راهکاری هستیم که با CRM دیدار یکپارچه بشه.",
    reasoning:
      "نیاز مشخص به کشف سرنخ در گروه‌های محلی، درخواست معرفی سرویس ایرانی و پیش‌شرط اتصال به CRM دیدار.",
    productMatch: "یکپارچگی وب‌هوک و صدور مستقیم لید به CRM",
    suggestedReply:
      "درود سارا گرامی، رادار سیگنال‌های خرید در پیام‌رسان‌ها را کشف کرده و از طریق وب‌هوک مستقیم به CRM دیدار منتقل می‌کند. برای تست نسخه دمو در خدمت شما هستیم.",
    cost: "$0.00012 (~۸ تومان)",
  },
  {
    id: "lead-3",
    platform: "forum",
    platformName: "فروم تخصصی وب‌فارسی",
    author: "مهدی کاظمی (بنیان‌گذار)",
    timeAgo: "۱ ساعت پیش",
    score: 65,
    tier: "PROBLEM AWARE",
    tierColor: "#f5a623",
    rawMessage:
      "چطور می‌تونیم بدون تبلیغات کلیکی پرهزینه، اولین ۱۰۰ مشتری سازمانی نرم‌افزارمون رو در کامیونیتی‌ها پیدا کنیم؟",
    reasoning:
      "آگاهی از چالش کشف مشتری اولیه و اجتناب از هزینه‌های تبلیغات سنتی، مناسب برای مشاوره استراتژی فروش B2B.",
    productMatch: "پایش هدفمند کامیونیتی‌ها برای استارتاپ‌های نوپا",
    suggestedReply:
      "سلام مهدی عزیز، پایش گفت‌وگوهای نیازمحور در فروم‌ها یکی از پربازده‌ترین روش‌هاست؛ رادار این کار را به شکل اتوماتیک برای شما انجام می‌دهد.",
    cost: "$0.00011 (~۷ تومان)",
  },
];

export default function VercelStyleLandingPage() {
  const [selectedLeadId, setSelectedLeadId] = useState<string>("lead-1");
  const [activeCodeTab, setActiveCodeTab] = useState<"analysis" | "raw" | "json">("analysis");
  const [copied, setCopied] = useState<boolean>(false);

  const selectedLead = useMemo(
    () => SAMPLE_LEADS.find((l) => l.id === selectedLeadId) || SAMPLE_LEADS[0],
    [selectedLeadId]
  );

  const handleCopyReply = () => {
    navigator.clipboard.writeText(selectedLead.suggestedReply);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#000000] text-[#ededed] selection:bg-white selection:text-black antialiased font-sans">
      {/* ========================================================
          VERCEL-STYLE GEOMETRIC GRID & CONE GRADIENT
      ======================================================== */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Subtle dot matrix grid */}
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: "radial-gradient(#333 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        {/* Top ambient illumination cone */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[850px] h-[400px] bg-gradient-to-b from-white/10 via-white/2 to-transparent blur-[140px] rounded-full pointer-events-none" />
      </div>

      {/* ========================================================
          NAVBAR: EXACT VERCEL GEOMETRIC MINIMALISM
      ======================================================== */}
      <header className="sticky top-0 z-50 w-full border-b border-[#1b1b1b] bg-black/75 backdrop-blur-xl transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-4">
          {/* Brand Identity */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 group cursor-pointer">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white text-black flex items-center justify-center font-bold shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.4)]">
                <RadarLogo className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-black" />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base text-white tracking-tight">رادار</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#141414] text-neutral-400 border border-[#262626] font-mono">
                  PriCoders
                </span>
              </div>
            </Link>
          </div>

          {/* Vercel Nav Tabs */}
          <nav className="hidden md:flex items-center gap-1 text-xs text-neutral-400 font-medium">
            <a href="#pipeline" className="px-3 py-1.5 rounded-md hover:text-white hover:bg-[#121212] transition-colors">
              خط لوله هوشمندی
            </a>
            <a href="#intent" className="px-3 py-1.5 rounded-md hover:text-white hover:bg-[#121212] transition-colors">
              موتور نیت‌سنجی
            </a>
            <a href="#console" className="px-3 py-1.5 rounded-md hover:text-white hover:bg-[#121212] transition-colors">
              کنسول ارزیابی
            </a>
            <a href="#economics" className="px-3 py-1.5 rounded-md hover:text-white hover:bg-[#121212] transition-colors">
              اقتصاد هوش مصنوعی
            </a>
            <a href="#architecture" className="px-3 py-1.5 rounded-md hover:text-white hover:bg-[#121212] transition-colors">
              معماری فنی
            </a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/settings"
              className="hidden sm:inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-medium text-neutral-300 hover:text-white bg-[#111111] border border-[#262626] hover:border-neutral-500 transition-colors cursor-pointer"
            >
              <SettingsIcon className="w-3.5 h-3.5" />
              <span>تنظیمات ICP</span>
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 h-8 sm:h-9 px-3.5 sm:px-4 rounded-lg text-xs font-semibold bg-white text-black hover:bg-neutral-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] active:scale-95 cursor-pointer"
            >
              <span>ورود به داشبورد</span>
              <span className="text-black font-mono">←</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        {/* ========================================================
            01 HERO SECTION (Vercel Style)
        ======================================================== */}
        <section className="pt-20 pb-20 sm:pt-28 sm:pb-32 px-4 sm:px-6 max-w-5xl mx-auto text-center">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0d0d0d] border border-[#242424] hover:border-neutral-600 transition-colors text-xs text-neutral-300 mb-8 shadow-inner">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00e599] animate-pulse-glow" />
            <span className="font-mono text-neutral-400">OPPORTUNITY INTELLIGENCE ENGINE</span>
            <span className="text-neutral-600">▲</span>
            <span className="text-white font-medium">PriCoders</span>
          </div>

          {/* Master Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight leading-[1.18] sm:leading-[1.12] mb-6">
            هزاران پیام و گفت‌وگو.
            <br />
            <span className="bg-gradient-to-b from-white via-neutral-100 to-neutral-500 bg-clip-text text-transparent">
              تنها چند فرصت خرید واقعی.
            </span>
            <br />
            <span className="text-white underline decoration-neutral-700 underline-offset-8">
              رادار آن‌ها را شکار می‌کند.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-lg text-neutral-400 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            رادار به جای جست‌وجوی سطحی کلمات کلیدی، کل مکالمه و زمینه گفت‌وگو در جوامع آنلاین را می‌فهمد، شدت قصد خرید را می‌سنجد و فرصت‌ها را اولویت‌بندی می‌کند.
          </p>

          {/* Vercel Value Prop Chip */}
          <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-[#0a0a0a] border border-[#222222] text-xs font-mono text-neutral-300 mb-10">
            <span className="text-neutral-500">ارزش محوری:</span>
            <span className="text-white font-bold">از میان هیاهو تا فرصت فروش</span>
            <span className="text-neutral-600">/</span>
            <span className="text-neutral-400">From Noise to Opportunity</span>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md mx-auto mb-16">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto h-11 px-7 rounded-xl font-bold text-xs sm:text-sm bg-white text-black hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(255,255,255,0.3)] active:scale-95 cursor-pointer"
            >
              <SparklesIcon className="w-4 h-4 text-black" />
              <span>مشاهده زنده داشبورد لیدها</span>
            </Link>

            <a
              href="#console"
              className="w-full sm:w-auto h-11 px-6 rounded-xl font-medium text-xs sm:text-sm bg-[#0e0e0e] hover:bg-[#181818] text-white border border-[#2b2b2b] hover:border-neutral-500 transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
            >
              <span>تست زنده کنسول هوشمندی</span>
              <span className="text-neutral-500">↓</span>
            </a>
          </div>

          {/* Micro Stats Bar */}
          <div className="pt-8 border-t border-[#181818] grid grid-cols-2 sm:grid-cols-4 gap-4 text-right">
            <div className="p-3.5 rounded-xl bg-[#090909] border border-[#1b1b1b]">
              <div className="text-[11px] font-mono text-neutral-500 mb-1">01 / ANALYZED CONTEXT</div>
              <div className="text-sm font-bold text-white">متن کامل + بافت مکالمه</div>
            </div>
            <div className="p-3.5 rounded-xl bg-[#090909] border border-[#1b1b1b]">
              <div className="text-[11px] font-mono text-neutral-500 mb-1">02 / INTENT TIERS</div>
              <div className="text-sm font-bold text-[#00e599]">۴ سطح نیت‌سنجی خرید</div>
            </div>
            <div className="p-3.5 rounded-xl bg-[#090909] border border-[#1b1b1b]">
              <div className="text-[11px] font-mono text-neutral-500 mb-1">03 / COST PER LEAD</div>
              <div className="text-sm font-bold text-sky-400">کمتر از ۱۰ تومان / پیام</div>
            </div>
            <div className="p-3.5 rounded-xl bg-[#090909] border border-[#1b1b1b]">
              <div className="text-[11px] font-mono text-neutral-500 mb-1">04 / LOCAL PRIVACY</div>
              <div className="text-sm font-bold text-purple-400">دیتابیس مستقل PocketBase</div>
            </div>
          </div>
        </section>

        {/* ========================================================
            02 LIVE INTERACTIVE CONSOLE (Heart of the Vercel Demo)
        ======================================================== */}
        <section id="console" className="py-20 px-4 sm:px-6 max-w-6xl mx-auto border-t border-[#141414]">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="text-xs font-mono font-bold text-[#00e599] tracking-wider uppercase mb-2">
              LIVE CONSOLE // INTERACTIVE DEMO
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-3">
              کنسول زنده غربالگری و هوشمندی فرصت‌ها
            </h2>
            <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed">
              روی هر یک از پیام‌های استخراج‌شده کلیک کنید تا شناسنامه، استدلال و پاسخ پیشنهادی آن را ببینید.
            </p>
          </div>

          <div className="rounded-2xl bg-[#080808] border border-[#1f1f1f] shadow-[0_20px_70px_rgba(0,0,0,0.9)] overflow-hidden text-right">
            {/* Window Top Controls */}
            <div className="h-11 px-4 border-b border-[#181818] bg-[#0c0c0c] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#262626]" />
                <span className="w-3 h-3 rounded-full bg-[#262626]" />
                <span className="w-3 h-3 rounded-full bg-[#262626]" />
                <span className="mr-2 text-[11px] font-mono text-neutral-500">radar-feed-stream.local</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-mono text-[#00e599]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00e599] animate-pulse-glow" />
                <span>REALTIME INGESTION ACTIVE</span>
              </div>
            </div>

            {/* Console Workspace: Left Feed List, Right Inspector */}
            <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x lg:divide-x-reverse divide-[#181818]">
              {/* Left Column (5 cols): Stream List */}
              <div className="lg:col-span-5 p-4 sm:p-5 space-y-2.5 bg-[#090909]">
                <div className="text-[11px] font-mono font-bold text-neutral-500 mb-2 px-1">
                  INCOMING COMMUNITY MESSAGES:
                </div>

                {SAMPLE_LEADS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedLeadId(item.id)}
                    className={`w-full text-right p-3.5 rounded-xl border transition-all cursor-pointer ${
                      selectedLeadId === item.id
                        ? "bg-[#141414] border-neutral-500 shadow-md"
                        : "bg-[#0b0b0b] border-[#1c1c1c] hover:border-neutral-700"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        {item.platform === "bale" && <BaleIcon className="w-3.5 h-3.5 text-[#00e599]" />}
                        {item.platform === "telegram" && <TelegramIcon className="w-3.5 h-3.5 text-sky-400" />}
                        {item.platform === "forum" && <ForumIcon className="w-3.5 h-3.5 text-purple-400" />}
                        <span className="text-xs font-bold text-white">{item.author}</span>
                      </div>
                      <span
                        className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: `${item.tierColor}18`,
                          color: item.tierColor,
                          border: `1px solid ${item.tierColor}40`,
                        }}
                      >
                        {item.score}٪
                      </span>
                    </div>

                    <p className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed mb-2">
                      {item.rawMessage}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-neutral-500 font-mono">
                      <span>{item.platformName}</span>
                      <span>{item.timeAgo}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Right Column (7 cols): Lead Inspector */}
              <div className="lg:col-span-7 p-5 sm:p-6 bg-[#060606] flex flex-col justify-between">
                <div>
                  {/* Inspector Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[#181818] mb-4">
                    <div>
                      <div className="text-sm font-bold text-white flex items-center gap-2">
                        <span>{selectedLead.author}</span>
                        <span
                          className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: `${selectedLead.tierColor}18`,
                            color: selectedLead.tierColor,
                            border: `1px solid ${selectedLead.tierColor}40`,
                          }}
                        >
                          {selectedLead.tier} ({selectedLead.score}٪)
                        </span>
                      </div>
                      <div className="text-[11px] text-neutral-400 font-mono mt-0.5">
                        {selectedLead.platformName} • {selectedLead.timeAgo}
                      </div>
                    </div>

                    <div className="text-[11px] font-mono text-neutral-400 bg-[#121212] px-2.5 py-1 rounded-md border border-[#222222]">
                      هزینه تحلیل: {selectedLead.cost}
                    </div>
                  </div>

                  {/* Inspector Tabs */}
                  <div className="flex items-center gap-2 mb-4">
                    <button
                      type="button"
                      onClick={() => setActiveCodeTab("analysis")}
                      className={`px-3 py-1 rounded-md text-xs font-mono transition-colors cursor-pointer ${
                        activeCodeTab === "analysis"
                          ? "bg-white text-black font-bold"
                          : "text-neutral-400 hover:text-white bg-[#111111]"
                      }`}
                    >
                      تحلیل هوشمند (Analysis)
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveCodeTab("raw")}
                      className={`px-3 py-1 rounded-md text-xs font-mono transition-colors cursor-pointer ${
                        activeCodeTab === "raw"
                          ? "bg-white text-black font-bold"
                          : "text-neutral-400 hover:text-white bg-[#111111]"
                      }`}
                    >
                      متن خام پیام
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveCodeTab("json")}
                      className={`px-3 py-1 rounded-md text-xs font-mono transition-colors cursor-pointer ${
                        activeCodeTab === "json"
                          ? "bg-white text-black font-bold"
                          : "text-neutral-400 hover:text-white bg-[#111111]"
                      }`}
                    >
                      خروجی ساخت‌یافته JSON
                    </button>
                  </div>

                  {/* Tab 1: Analysis */}
                  {activeCodeTab === "analysis" && (
                    <div className="space-y-3 animate-fade-in">
                      <div className="p-3.5 rounded-xl bg-[#0c0c0c] border border-[#1a1a1a]">
                        <div className="text-[11px] font-bold text-amber-400 mb-1 flex items-center gap-1.5">
                          <FlameIcon className="w-3.5 h-3.5 text-amber-400" />
                          <span>استدلال هوش مصنوعی (AI Reasoning):</span>
                        </div>
                        <p className="text-xs text-neutral-300 leading-relaxed">
                          {selectedLead.reasoning}
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-[#0c0c0c] border border-[#1a1a1a]">
                        <div className="text-[11px] font-bold text-[#00e599] mb-1 flex items-center gap-1.5">
                          <SparklesIcon className="w-3.5 h-3.5 text-[#00e599]" />
                          <span>انطباق با محصول (Product ICP Match):</span>
                        </div>
                        <p className="text-xs text-neutral-300 leading-relaxed">
                          {selectedLead.productMatch}
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-[#121212] border border-[#242424]">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[11px] font-bold text-sky-400">
                            پیش‌نویس پاسخ آماده برای نماینده فروش:
                          </span>
                          <button
                            type="button"
                            onClick={handleCopyReply}
                            className="px-2 py-0.5 rounded bg-[#1e1e1e] hover:bg-[#282828] text-neutral-300 hover:text-white text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            {copied ? (
                              <>
                                <CheckIcon className="w-3 h-3 text-[#00e599]" />
                                <span className="text-[#00e599]">کپی شد</span>
                              </>
                            ) : (
                              <>
                                <CopyIcon className="w-3 h-3" />
                                <span>کپی متن</span>
                              </>
                            )}
                          </button>
                        </div>
                        <p className="text-xs text-neutral-200 leading-relaxed bg-[#0a0a0a] p-3 rounded-lg border border-[#1a1a1a]">
                          {selectedLead.suggestedReply}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Tab 2: Raw Message */}
                  {activeCodeTab === "raw" && (
                    <div className="p-4 rounded-xl bg-[#0c0c0c] border border-[#1a1a1a] text-xs sm:text-sm text-neutral-200 leading-relaxed font-mono animate-fade-in">
                      «{selectedLead.rawMessage}»
                    </div>
                  )}

                  {/* Tab 3: JSON */}
                  {activeCodeTab === "json" && (
                    <div className="p-4 rounded-xl bg-[#0c0c0c] border border-[#1a1a1a] text-[11px] text-[#00e599] font-mono leading-relaxed overflow-x-auto text-left dir-ltr animate-fade-in">
                      <pre>
                        {JSON.stringify(
                          {
                            id: selectedLead.id,
                            author: selectedLead.author,
                            intent_score: selectedLead.score,
                            intent_tier: selectedLead.tier,
                            analysis_cost: selectedLead.cost,
                            reasoning: selectedLead.reasoning,
                            product_match: selectedLead.productMatch,
                          },
                          null,
                          2
                        )}
                      </pre>
                    </div>
                  )}
                </div>

                <div className="mt-5 pt-3 border-t border-[#181818] flex items-center justify-between text-xs">
                  <span className="text-neutral-500 font-mono text-[11px]">STATUS: QUALIFIED OPPORTUNITY</span>
                  <Link
                    href="/dashboard"
                    className="text-white hover:underline flex items-center gap-1 font-medium cursor-pointer"
                  >
                    <span>مدیریت کامل در داشبورد رادار</span>
                    <span>←</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            03 THE 5-STAGE PIPELINE (Vercel Grid)
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
              از پایش مکالمات تا آماده‌سازی پیام و اقدام قطعی برای کارشناس فروش.
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
            04 INTENT TIERS (Vercel Cards)
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
            05 AI ECONOMICS & INFRASTRUCTURE TRANSPARENCY
        ======================================================== */}
        <section id="economics" className="py-20 px-4 sm:px-6 max-w-6xl mx-auto border-t border-[#141414]">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="text-xs font-mono font-bold text-emerald-400 tracking-wider uppercase mb-2">
              04 // AI ECONOMICS
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
                پایگاه داده محلی PocketBase و امکان اتصال به موتورهای محلی Ollama و vLLM بدون وابستگی به کلاد خارجی.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================
            06 BENTO USE CASES
        ======================================================== */}
        <section id="use-cases" className="py-20 px-4 sm:px-6 max-w-6xl mx-auto border-t border-[#141414]">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="text-xs font-mono font-bold text-neutral-400 tracking-wider uppercase mb-2">
              05 // ENTERPRISE USE CASES
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
            07 ARCHITECTURE (PriCoders Engineering Specs)
        ======================================================== */}
        <section id="architecture" className="py-20 px-4 sm:px-6 max-w-5xl mx-auto border-t border-[#141414]">
          <div className="p-8 sm:p-10 rounded-3xl bg-[#090909] border border-[#1f1f1f] text-right">
            <div className="text-xs font-mono font-bold text-amber-400 mb-2">ENGINEERING ARCHITECTURE // PRICODERS</div>
            <h2 className="text-xl sm:text-3xl font-extrabold text-white mb-4">
              معماری فنی رادار: استقلال، پایداری و امنیت
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed mb-6">
              رادار با ترکیب Next.js 16، پایگاه داده بلادرنگ PocketBase، و زنجیره فال‌بک استنتاج چندمدلی پیاده‌سازی شده است.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-4 rounded-xl bg-[#050505] border border-[#1a1a1a]">
                <div className="text-[#00e599] font-bold mb-1">CURRENT MVP CAPABILITIES:</div>
                <ul className="space-y-1.5 text-neutral-400">
                  <li>• Local PocketBase with zero latency SSE</li>
                  <li>• Semantic Intent Classification (0-100)</li>
                  <li>• Realtime Simulation & Feed Ingestion</li>
                  <li>• In-App AI Assistant with VoiceOrb</li>
                  <li>• Token Cost & Pricing Analytics</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-[#050505] border border-[#1a1a1a]">
                <div className="text-sky-400 font-bold mb-1">ROADMAP TO PRODUCTION:</div>
                <ul className="space-y-1.5 text-neutral-400">
                  <li>• Official Bale & Telegram Crawlers</li>
                  <li>• Bi-directional CRM Sync (Didar, HubSpot)</li>
                  <li>• Fine-Tuned Persian Intent Model</li>
                  <li>• Multi-Tenant SaaS Architecture</li>
                  <li>• Long-Term Lead Memory Graph</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            08 GIANT CALL TO ACTION (Vercel Style)
        ======================================================== */}
        <section className="py-28 sm:py-36 px-4 sm:px-6 max-w-4xl mx-auto text-center border-t border-[#141414] relative">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[600px] h-[300px] bg-gradient-to-b from-white/8 to-transparent blur-[140px] rounded-full" />
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
          09 VERCEL MULTI-COLUMN FOOTER
      ======================================================== */}
      <footer className="border-t border-[#141414] bg-[#050505] pt-14 pb-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
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
