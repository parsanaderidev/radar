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
  CopyIcon,
  FlameIcon,
  SettingsIcon,
} from "@/components/Icons";
import { VoiceOrb } from "@/components/agents/voice-orb";

/* -------------------------------------------------------------------------- */
/* SAMPLE FEED DATA FOR INTERACTIVE TERMINALS & PREVIEWS                      */
/* -------------------------------------------------------------------------- */
interface SampleSignal {
  id: string;
  channel: "bale" | "telegram" | "twitter" | "forum";
  channelTitle: string;
  sender: string;
  timestamp: string;
  score: number;
  tier: "HIGH INTENT" | "PROBLEM AWARE" | "CURIOUS" | "IRRELEVANT";
  tierColor: string;
  text: string;
  analysis: string;
  urgency: "فوری (۲۴ ساعت)" | "متوسط (۱ هفته)" | "کم (عمومی)";
  budget: string;
  suggestedReply: string;
  cost: string;
}

const SAMPLE_SIGNALS: SampleSignal[] = [
  {
    id: "sig-1",
    channel: "bale",
    channelTitle: "بله / گروه فین‌تک و خدمات مالی",
    sender: "علیرضا فراهانی (مدیر عملیات)",
    timestamp: "۸ دقیقه پیش",
    score: 94,
    tier: "HIGH INTENT",
    tierColor: "#00e599",
    text: "ما برای تیم ۲۰ نفرمون به شدت دنبال یه راهکار مطمئن اتوماسیون پیگیری لیدها در کانال‌ها هستیم. روزی ۳ ساعت وقت تیم فروش هدر میره. بودجه ماهانه آماده تا ۱۵ میلیون داریم. چه نرم‌افزاری پیشنهاد می‌دید؟",
    analysis:
      "اعلام صریح مشکل اتلاف زمان (۳ ساعت روزانه)، ابعاد تیم (۲۰ نفر)، سقف بودجه قطعی (۱۵ میلیون تومان) و فوریت بالا در انتخاب ابزار.",
    urgency: "فوری (۲۴ ساعت)",
    budget: "۱۵,۰۰۰,۰۰۰ تومان / ماهانه",
    suggestedReply:
      "درود علیرضا عزیز، رادار دقیقاً این چالش را حل می‌کند: پایش خودکار مکالمات و استخراج سرنخ‌های آماده خرید بدون دخالت دستی. خوشحال می‌شویم یک جلسه دموی زنده روی کانال‌های هدف شما هماهنگ کنیم.",
    cost: "$0.00014 (~۹ تومان)",
  },
  {
    id: "sig-2",
    channel: "telegram",
    channelTitle: "تلگرام / سوپرگروه مدیران فروش B2B",
    sender: "سارا موحد (مدیر رشد)",
    timestamp: "۲۱ دقیقه پیش",
    score: 82,
    tier: "HIGH INTENT",
    tierColor: "#00e599",
    text: "کسی تجربه استفاده از سرویس‌های ایرانی برای کشف مشتریان بالقوه در گروه‌ها داره؟ دنبال راهکاری هستیم که با CRM دیدار یکپارچه بشه.",
    analysis:
      "نیاز مشخص به کشف سرنخ در گروه‌های محلی، درخواست معرفی سرویس ایرانی و پیش‌شرط اتصال به CRM دیدار.",
    urgency: "متوسط (۱ هفته)",
    budget: "تعیین نشده (آماده مذاکره)",
    suggestedReply:
      "درود سارا گرامی، رادار سیگنال‌های خرید در پیام‌رسان‌ها را کشف کرده و از طریق وب‌هوک مستقیم به CRM دیدار منتقل می‌کند. برای تست نسخه دمو در خدمت شما هستیم.",
    cost: "$0.00012 (~۸ تومان)",
  },
  {
    id: "sig-3",
    channel: "forum",
    channelTitle: "فروم توسعه‌دهندگان و استارتاپ‌ها",
    sender: "مهدی کاظمی (بنیان‌گذار)",
    timestamp: "۵۴ دقیقه پیش",
    score: 65,
    tier: "PROBLEM AWARE",
    tierColor: "#f5a623",
    text: "چطور می‌تونیم بدون تبلیغات کلیکی پرهزینه، اولین ۱۰۰ مشتری سازمانی نرم‌افزارمون رو در کامیونیتی‌ها پیدا کنیم؟",
    analysis:
      "آگاهی از چالش کشف مشتری اولیه و اجتناب از هزینه‌های تبلیغات سنتی، مناسب برای آموزش و تبدیل به مشتری سازمانی.",
    urgency: "متوسط (۱ هفته)",
    budget: "استارتاپی",
    suggestedReply:
      "سلام مهدی عزیز، پایش هدفمند گفت‌وگوهای نیازمحور در فروم‌ها یکی از پربازده‌ترین روش‌هاست؛ رادار این کار را به شکل اتوماتیک برای شما انجام می‌دهد.",
    cost: "$0.00011 (~۷ تومان)",
  },
];

export default function VercelStyleLandingPage() {
  const [activeCapability, setActiveCapability] = useState<number>(0);
  const [selectedSignalId, setSelectedSignalId] = useState<string>("sig-1");
  const [activeCodeTab, setActiveCodeTab] = useState<"curl" | "typescript" | "python">("typescript");
  const [copiedReply, setCopiedReply] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [productsOpen, setProductsOpen] = useState<boolean>(false);
  const [resourcesOpen, setResourcesOpen] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const selectedSignal = useMemo(
    () => SAMPLE_SIGNALS.find((s) => s.id === selectedSignalId) || SAMPLE_SIGNALS[0],
    [selectedSignalId]
  );

  const handleCopyReply = () => {
    navigator.clipboard.writeText(selectedSignal.suggestedReply);
    setCopiedReply(true);
    setTimeout(() => setCopiedReply(false), 2000);
  };

  const handleCopyCode = (codeText: string) => {
    navigator.clipboard.writeText(codeText);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const sampleCodeSnippets = {
    typescript: `import { RadarClient } from "@pricoders/radar";

const radar = new RadarClient({
  endpoint: "http://127.0.0.1:8090",
  apiKey: process.env.RADAR_API_KEY,
});

// Stream real-time high-intent buying signals
const stream = await radar.signals.subscribe({
  minScore: 75,
  platforms: ["bale", "telegram", "twitter"],
  onSignal: (opportunity) => {
    console.log("⚡ New Buying Signal Detected:", opportunity.author);
    console.log("Intent Score:", opportunity.score);
    console.log("Suggested Outreach:", opportunity.suggestedReply);
  },
});`,
    curl: `curl -X POST http://127.0.0.1:8090/api/radar/score \\
  -H "Content-Type: application/json" \\
  -d '{
    "message": "به شدت دنبال ابزار اتوماسیون لید برای تیم ۲۰ نفره با بودجه آماده هستیم",
    "channel": "bale",
    "icpId": "b2b_saas_sales"
  }'`,
    python: `from pricoders_radar import RadarClient

radar = RadarClient(endpoint="http://127.0.0.1:8090")

# Score intent and extract budget in real-time
signal = radar.analyze_message(
    content="ما برای تیممون دنبال نرم‌افزار مدیریت لید هستیم بودجه ۱۵ میلیون داریم",
    channel="telegram"
)

if signal.score >= 75:
    radar.crm.push_lead(signal, crm="didar")`,
  };

  return (
    <div className="min-h-screen bg-[#000000] text-[#ededed] selection:bg-white selection:text-black antialiased font-sans">
      {/* ========================================================
          BACKGROUND: VERCEL GEOMETRIC DOT GRID & AMBIENT GLOW
      ======================================================== */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Subtle dot matrix grid */}
        <div
          className="absolute inset-0 opacity-[0.14]"
          style={{
            backgroundImage: "radial-gradient(#444 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        {/* Top ambient illumination cone */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] vercel-hero-glow blur-[120px] rounded-full pointer-events-none" />
      </div>

      {/* ========================================================
          01 STICKY HEADER (Vercel Architecture)
      ======================================================== */}
      <header
        id="marketing-header"
        className="sticky top-0 z-50 w-full border-b border-[#1c1c1c] bg-black/80 backdrop-blur-xl transition-all"
      >
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-4">
          {/* Logo & Wordmark */}
          <div className="flex items-center gap-6">
            <Link href="/" className="inline-flex items-center gap-2.5 group cursor-pointer focus:outline-none">
              {/* Vercel Geometric Triangle Icon */}
              <div className="w-6 h-6 rounded-md bg-white text-black flex items-center justify-center font-bold shadow-sm transition-transform duration-300 group-hover:scale-105">
                <svg viewBox="0 0 115 100" height="13" width="15" fill="currentColor">
                  <path fillRule="evenodd" d="M57.5 0 115 100H0z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base text-white tracking-tight">رادار</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#141414] text-neutral-400 border border-[#262626] font-mono">
                  PriCoders
                </span>
              </div>
            </Link>

            {/* Nav Menu */}
            <nav className="hidden md:flex items-center gap-1 text-xs text-neutral-400 font-medium">
              {/* Products Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setProductsOpen(!productsOpen);
                    setResourcesOpen(false);
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-md hover:text-white hover:bg-[#121212] transition-colors cursor-pointer"
                >
                  <span>محصولات</span>
                  <svg
                    viewBox="0 0 16 16"
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${productsOpen ? "rotate-180" : ""}`}
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="m12.06 6.75-.53.53-2.82 2.82a1 1 0 0 1-1.42 0L4.47 7.28l-.53-.53L5 5.69l.53.53L8 8.69l2.47-2.47.53-.53z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                {productsOpen && (
                  <div
                    onMouseLeave={() => setProductsOpen(false)}
                    className="absolute top-full right-0 mt-2 w-[480px] p-4 rounded-xl bg-[#0c0c0c] border border-[#222222] shadow-[0_20px_60px_rgba(0,0,0,0.9)] z-50 animate-card-in"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-[11px] font-mono font-bold text-neutral-500 uppercase mb-2">Agent Stack</div>
                        <ul className="space-y-1.5 text-xs">
                          <li>
                            <Link
                              href="/dashboard"
                              onClick={() => setProductsOpen(false)}
                              className="block p-1.5 rounded-md hover:bg-[#181818] text-white hover:text-[#00e599] transition-colors"
                            >
                              <div className="font-semibold">پایش لحظه‌ای (Signal Stream)</div>
                              <div className="text-[11px] text-neutral-500">جریان زنده مکالمات با رتبه‌بندی نیت</div>
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/settings"
                              onClick={() => setProductsOpen(false)}
                              className="block p-1.5 rounded-md hover:bg-[#181818] text-white hover:text-[#00e599] transition-colors"
                            >
                              <div className="font-semibold">موتور تطبیق ICP</div>
                              <div className="text-[11px] text-neutral-500">پروفایل مشتری ایده‌آل و کلمات نیازمحور</div>
                            </Link>
                          </li>
                          <li>
                            <a
                              href="#voice-orb"
                              onClick={() => setProductsOpen(false)}
                              className="block p-1.5 rounded-md hover:bg-[#181818] text-white hover:text-[#00e599] transition-colors"
                            >
                              <div className="font-semibold">VoiceOrb Co-Pilot</div>
                              <div className="text-[11px] text-neutral-500">دستیار صوتی و متنی تحلیل مکالمات</div>
                            </a>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <div className="text-[11px] font-mono font-bold text-neutral-500 uppercase mb-2">Core Platform</div>
                        <ul className="space-y-1.5 text-xs">
                          <li>
                            <a
                              href="#economics"
                              onClick={() => setProductsOpen(false)}
                              className="block p-1.5 rounded-md hover:bg-[#181818] text-white hover:text-[#00e599] transition-colors"
                            >
                              <div className="font-semibold">اقتصاد هوش مصنوعی</div>
                              <div className="text-[11px] text-neutral-500">هزینه کمتر از ۱۰ تومان به ازای هر پیام</div>
                            </a>
                          </li>
                          <li>
                            <a
                              href="#architecture"
                              onClick={() => setProductsOpen(false)}
                              className="block p-1.5 rounded-md hover:bg-[#181818] text-white hover:text-[#00e599] transition-colors"
                            >
                              <div className="font-semibold">حریم خصوصی PocketBase</div>
                              <div className="text-[11px] text-neutral-500">دیتابیس کاملاً محلی و امن بدون نشت داده</div>
                            </a>
                          </li>
                          <li>
                            <a
                              href="#channels"
                              onClick={() => setProductsOpen(false)}
                              className="block p-1.5 rounded-md hover:bg-[#181818] text-white hover:text-[#00e599] transition-colors"
                            >
                              <div className="font-semibold">آداپتورهای پیام‌رسان</div>
                              <div className="text-[11px] text-neutral-500">پشتیبانی همزمان بله، تلگرام، X و فروم‌ها</div>
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Resources Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setResourcesOpen(!resourcesOpen);
                    setProductsOpen(false);
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-md hover:text-white hover:bg-[#121212] transition-colors cursor-pointer"
                >
                  <span>منابع و مستندات</span>
                  <svg
                    viewBox="0 0 16 16"
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${resourcesOpen ? "rotate-180" : ""}`}
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="m12.06 6.75-.53.53-2.82 2.82a1 1 0 0 1-1.42 0L4.47 7.28l-.53-.53L5 5.69l.53.53L8 8.69l2.47-2.47.53-.53z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                {resourcesOpen && (
                  <div
                    onMouseLeave={() => setResourcesOpen(false)}
                    className="absolute top-full right-0 mt-2 w-[280px] p-3 rounded-xl bg-[#0c0c0c] border border-[#222222] shadow-[0_20px_60px_rgba(0,0,0,0.9)] z-50 animate-card-in"
                  >
                    <ul className="space-y-1 text-xs">
                      <li>
                        <a
                          href="#architecture"
                          onClick={() => setResourcesOpen(false)}
                          className="block p-2 rounded-md hover:bg-[#181818] text-white transition-colors"
                        >
                          <div className="font-semibold">معماری فنی (Whitepaper)</div>
                          <div className="text-[11px] text-neutral-500">تحلیل پایپ‌لاین ۴ سطحی نیت‌سنجی</div>
                        </a>
                      </li>
                      <li>
                        <a
                          href="#code"
                          onClick={() => setResourcesOpen(false)}
                          className="block p-2 rounded-md hover:bg-[#181818] text-white transition-colors"
                        >
                          <div className="font-semibold">API و SDK رادار</div>
                          <div className="text-[11px] text-neutral-500">کد نمونه TypeScript و Python</div>
                        </a>
                      </li>
                      <li>
                        <a
                          href="#shipped"
                          onClick={() => setResourcesOpen(false)}
                          className="block p-2 rounded-md hover:bg-[#181818] text-white transition-colors"
                        >
                          <div className="font-semibold">تغییرات اخیر (Changelog)</div>
                          <div className="text-[11px] text-neutral-500">ویژگی‌های نسخه ۲.۴ پریکدرز</div>
                        </a>
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              <a href="#channels" className="px-3 py-1.5 rounded-md hover:text-white hover:bg-[#121212] transition-colors">
                کانال‌ها
              </a>
              <a href="#economics" className="px-3 py-1.5 rounded-md hover:text-white hover:bg-[#121212] transition-colors">
                اقتصاد توکن
              </a>
            </nav>
          </div>

          {/* Right Action CTAs (Vercel Exact Pill Buttons) */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/settings"
              className="hidden sm:inline-flex items-center gap-1.5 h-8 px-3 rounded-md text-xs font-medium text-neutral-300 hover:text-white bg-[#0e0e0e] border border-[#262626] hover:border-neutral-500 transition-colors cursor-pointer"
            >
              <SettingsIcon className="w-3.5 h-3.5" />
              <span>پیکربندی ICP</span>
            </Link>

            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 h-8 sm:h-9 px-4 rounded-md text-xs font-semibold bg-white text-black hover:bg-neutral-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.25)] active:scale-95 cursor-pointer"
            >
              <span>ورود به داشبورد</span>
              <span className="font-mono text-black">←</span>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-md text-neutral-400 hover:text-white hover:bg-[#181818]"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
                {mobileMenuOpen ? (
                  <path d="M18 6L6 18M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-[#222222] bg-[#080808] px-4 py-4 space-y-3">
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block p-2 text-sm text-white font-medium hover:bg-[#141414] rounded-md"
            >
              داشبورد لیدها
            </Link>
            <Link
              href="/settings"
              onClick={() => setMobileMenuOpen(false)}
              className="block p-2 text-sm text-neutral-300 hover:bg-[#141414] rounded-md"
            >
              تنظیمات ICP
            </Link>
            <a
              href="#channels"
              onClick={() => setMobileMenuOpen(false)}
              className="block p-2 text-sm text-neutral-300 hover:bg-[#141414] rounded-md"
            >
              کانال‌های تحت پایش
            </a>
            <a
              href="#economics"
              onClick={() => setMobileMenuOpen(false)}
              className="block p-2 text-sm text-neutral-300 hover:bg-[#141414] rounded-md"
            >
              اقتصاد هوش مصنوعی
            </a>
          </div>
        )}
      </header>

      {/* ========================================================
          02 TOP ANNOUNCEMENT BANNER (Vercel "Ship 26" Style)
      ======================================================== */}
      <div className="relative z-10 flex justify-center items-center w-full min-h-[44px] py-2 border-b border-[#141414] bg-black/40">
        <div className="flex flex-wrap gap-2.5 items-center justify-center px-4 text-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00e599] animate-pulse" />
          <span className="text-neutral-400">
            رونمایی رسمی نسخه ۲.۴: موتور هوشمندی فرصت‌های فروش توسعه‌یافته توسط تیم
          </span>
          <span className="text-white font-semibold">PriCoders</span>
          <span className="text-neutral-600">▲</span>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium text-white border border-[#2b2b2b] hover:border-neutral-500 bg-[#0e0e0e] hover:bg-[#161616] transition-all cursor-pointer"
          >
            <span>مشاهده زنده سیگنال‌ها</span>
            <span>←</span>
          </Link>
        </div>
      </div>

      <main className="relative z-10">
        {/* ========================================================
            03 HERO SECTION (Exact Vercel Redesign Architecture)
        ======================================================== */}
        <section className="relative flex min-h-[min(calc(100svh-110px),920px)] flex-col justify-center px-4 sm:px-6 max-w-[1240px] mx-auto select-none pt-12 pb-16">
          <div className="relative flex flex-1 flex-col items-center justify-between lg:flex-row lg:items-center gap-12">
            {/* Center Background Geometric Cone Glow (Vercel Style) */}
            <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden">
              <div className="relative w-[340px] sm:w-[540px] lg:w-[720px] aspect-[3/2] vercel-hero-triangle-glow blur-[100px] opacity-75" />
              {/* Subtle Geometric Cone Triangle Outline */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 sm:w-96 sm:h-96 opacity-10 pointer-events-none">
                <svg viewBox="0 0 100 100" className="w-full h-full text-white" fill="none" stroke="currentColor" strokeWidth="0.8">
                  <polygon points="50,10 90,85 10,85" />
                  <circle cx="50" cy="60" r="22" strokeDasharray="2 3" />
                </svg>
              </div>
            </div>

            {/* Left Column: Hero Master Typography & CTAs */}
            <div className="relative z-10 flex w-full max-w-[560px] flex-col items-center text-center lg:items-start lg:text-right">
              {/* Vercel Pill Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0a0a0a] border border-[#242424] hover:border-neutral-600 transition-colors text-xs text-neutral-300 mb-6 shadow-inner">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00e599] animate-pulse-glow" />
                <span className="font-mono text-neutral-400">OPPORTUNITY INFRASTRUCTURE</span>
                <span className="text-neutral-600">▲</span>
                <span className="text-white font-medium">PriCoders</span>
              </div>

              {/* Giant Master Headline */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.14] mb-6">
                هوشمندی کشف فرصت.
                <br />
                <span className="bg-gradient-to-b from-white via-neutral-200 to-neutral-500 bg-clip-text text-transparent">
                  از میان هیاهو تا معامله.
                </span>
              </h1>

              {/* Subheadline with Mono Font */}
              <p className="text-sm sm:text-base text-neutral-400 max-w-lg mb-8 leading-relaxed font-normal">
                رادار به جای جست‌وجوی سطحی کلمات کلیدی، بستر و مکالمات بومی در بله، تلگرام، توییتر و فروم‌ها را می‌فهمد، شدت قصد خرید را می‌سنجد و سرنخ‌های آماده معامله را به تیم فروش تحویل می‌دهد.
              </p>

              {/* CTA Action Buttons (Vercel Style Full-Pill) */}
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto mb-10">
                <Link
                  href="/dashboard"
                  className="w-full sm:w-auto h-11 px-7 rounded-full font-bold text-xs sm:text-sm bg-white text-black hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(255,255,255,0.3)] active:scale-95 cursor-pointer"
                >
                  <SparklesIcon className="w-4 h-4 text-black" />
                  <span>راه‌اندازی زنده داشبورد</span>
                  <span className="font-mono text-black">←</span>
                </Link>

                <a
                  href="#deep-dive-1"
                  className="w-full sm:w-auto h-11 px-6 rounded-full font-medium text-xs sm:text-sm bg-[#0a0a0a] hover:bg-[#141414] text-white border border-[#2b2b2b] hover:border-neutral-500 transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                >
                  <span>بررسی معماری سیستم</span>
                  <span className="text-neutral-500">↓</span>
                </a>
              </div>

              {/* Core Value Statement */}
              <div className="flex items-center gap-3 text-xs text-neutral-500 font-mono">
                <span>ارزش محوری:</span>
                <span className="text-neutral-300 font-semibold">From Noise to Opportunity</span>
                <span className="text-neutral-700">|</span>
                <span className="text-emerald-400">۹۲٪ دقت تفکیک نیت</span>
              </div>
            </div>

            {/* Right Column: Platform Capabilities Selector (Exact Vercel Hero Component) */}
            <div className="relative z-10 w-full max-w-[480px]">
              <div className="rounded-2xl bg-[#090909]/90 border border-[#222222] p-5 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#181818]">
                  <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
                    <span className="w-2 h-2 rounded-full bg-[#00e599] animate-pulse" />
                    <span>قابلیت‌های پلتفرم رادار</span>
                  </div>
                  <span className="text-[11px] font-mono text-neutral-500">v2.4 STABLE</span>
                </div>

                <div className="space-y-3">
                  {/* Item 1 */}
                  <div
                    onClick={() => setActiveCapability(0)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      activeCapability === 0
                        ? "bg-[#141414] border-neutral-400 shadow-md"
                        : "bg-[#0b0b0b] border-[#1d1d1d] hover:border-neutral-700"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-bold text-white">برای نمایندگان و تیم‌های فروش</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1c1c1c] text-neutral-400 border border-[#2c2c2c]">
                        01 / AGENTS
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      پایش مداوم و بومی کانال‌های بله، تلگرام، X و فروم‌ها؛ بدون نیاز به پیمایش دستی و صرف ساعت‌ها زمان بیهوده.
                    </p>
                  </div>

                  {/* Item 2 */}
                  <div
                    onClick={() => setActiveCapability(1)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      activeCapability === 1
                        ? "bg-[#141414] border-neutral-400 shadow-md"
                        : "bg-[#0b0b0b] border-[#1d1d1d] hover:border-neutral-700"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-bold text-white">برای اولویت‌بندی شدت نیاز (Intent)</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1c1c1c] text-neutral-400 border border-[#2c2c2c]">
                        02 / PRIORITIZE
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      دسته‌بندی ۴ سطحی هوشمند از ۰ تا ۱۰۰، تفکیک خریداران با بودجه آماده از کنجکاوهای معمولی قبل از اقدام رقبا.
                    </p>
                  </div>

                  {/* Item 3 */}
                  <div
                    onClick={() => setActiveCapability(2)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      activeCapability === 2
                        ? "bg-[#141414] border-neutral-400 shadow-md"
                        : "bg-[#0b0b0b] border-[#1d1d1d] hover:border-neutral-700"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-bold text-white">اتوماسیون اقدام و پاسخ‌سازی</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1c1c1c] text-neutral-400 border border-[#2c2c2c]">
                        03 / ACTION
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      تولید پاسخ شخصی‌سازی‌شده متناسب با درد اصلی کاربر، محاسبه دقیق توکن و ارسال وب‌هوک مستقیم به CRM سازمان.
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#181818] flex items-center justify-between text-[11px] font-mono text-neutral-500">
                  <span>PocketBase Local Engine</span>
                  <span className="text-emerald-400">Zero Cloud Leakage</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            04 CONTINUOUS CHANNELS & PARTNERS MARQUEE (Vercel Style)
        ======================================================== */}
        <section id="channels" className="py-14 border-y border-[#181818] bg-[#050505] overflow-hidden">
          <div className="max-w-[1240px] mx-auto px-4 sm:px-6 mb-6 text-center">
            <p className="text-xs font-mono text-neutral-500 tracking-wider uppercase">
              CHANNELS & COMMUNITIES MONITORED IN REAL-TIME
            </p>
          </div>

          <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
            <div className="animate-marquee flex items-center gap-12 sm:gap-16">
              {/* Channel 1: Bale */}
              <div className="flex items-center gap-2.5 text-neutral-400 hover:text-white transition-colors shrink-0">
                <BaleIcon className="w-5 h-5 text-emerald-400" />
                <span className="text-sm font-semibold tracking-wide">بله (Bale Messenger)</span>
              </div>

              {/* Channel 2: Telegram */}
              <div className="flex items-center gap-2.5 text-neutral-400 hover:text-white transition-colors shrink-0">
                <TelegramIcon className="w-5 h-5 text-sky-400" />
                <span className="text-sm font-semibold tracking-wide">تلگرام (Telegram Supergroups)</span>
              </div>

              {/* Channel 3: Twitter / X */}
              <div className="flex items-center gap-2.5 text-neutral-400 hover:text-white transition-colors shrink-0">
                <TwitterXIcon className="w-5 h-5 text-white" />
                <span className="text-sm font-semibold tracking-wide">توییتر / X</span>
              </div>

              {/* Channel 4: Forums */}
              <div className="flex items-center gap-2.5 text-neutral-400 hover:text-white transition-colors shrink-0">
                <ForumIcon className="w-5 h-5 text-amber-400" />
                <span className="text-sm font-semibold tracking-wide">انجمن‌ها و فروم‌های تخصصی</span>
              </div>

              {/* Channel 5: Virgool */}
              <div className="flex items-center gap-2.5 text-neutral-400 hover:text-white transition-colors shrink-0">
                <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white">
                  V
                </div>
                <span className="text-sm font-semibold tracking-wide">ویرگول (Virgool Tech)</span>
              </div>

              {/* Channel 6: GitHub Discussions */}
              <div className="flex items-center gap-2.5 text-neutral-400 hover:text-white transition-colors shrink-0">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current text-white">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                <span className="text-sm font-semibold tracking-wide">گیت‌هاب دیسکاشنز</span>
              </div>

              {/* Duplicate set for seamless loop */}
              <div className="flex items-center gap-2.5 text-neutral-400 hover:text-white transition-colors shrink-0">
                <BaleIcon className="w-5 h-5 text-emerald-400" />
                <span className="text-sm font-semibold tracking-wide">بله (Bale Messenger)</span>
              </div>
              <div className="flex items-center gap-2.5 text-neutral-400 hover:text-white transition-colors shrink-0">
                <TelegramIcon className="w-5 h-5 text-sky-400" />
                <span className="text-sm font-semibold tracking-wide">تلگرام (Telegram Supergroups)</span>
              </div>
              <div className="flex items-center gap-2.5 text-neutral-400 hover:text-white transition-colors shrink-0">
                <TwitterXIcon className="w-5 h-5 text-white" />
                <span className="text-sm font-semibold tracking-wide">توییتر / X</span>
              </div>
              <div className="flex items-center gap-2.5 text-neutral-400 hover:text-white transition-colors shrink-0">
                <ForumIcon className="w-5 h-5 text-amber-400" />
                <span className="text-sm font-semibold tracking-wide">انجمن‌ها و فروم‌های تخصصی</span>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            05 PLATFORM PILLAR 1: NOTION-STYLE LAYOUT
            Left (Col 1-8): Preview Card with Ambient Glow
            Right (Col 10-12): Quote Stat & Features
        ======================================================== */}
        <section id="deep-dive-1" className="py-24 px-4 sm:px-6 max-w-[1240px] mx-auto border-t border-[#141414]">
          <div className="mb-12">
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight max-w-2xl">
              شنود هوشمند در سرچشمه گفت‌وگوها
            </h2>
          </div>

          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Ambient Glow behind Preview Card */}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-white w-full h-40 rounded-full blur-[140px] opacity-[0.05] pointer-events-none lg:col-span-8"
            />

            {/* Left 8-Column Preview Card: Live Ingestion Monitor */}
            <div className="relative isolate w-full lg:col-span-8 rounded-2xl bg-[#090909] border border-[#202020] p-5 shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#181818]">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#222]" />
                  <span className="w-3 h-3 rounded-full bg-[#222]" />
                  <span className="w-3 h-3 rounded-full bg-[#222]" />
                  <span className="font-mono text-xs text-neutral-400 mr-2">live-stream-ingest.sh</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-[#00e599]">
                  <span className="w-2 h-2 rounded-full bg-[#00e599] animate-pulse" />
                  <span>STREAMING ACTIVE</span>
                </div>
              </div>

              {/* Feed Item Previews */}
              <div className="space-y-3">
                {SAMPLE_SIGNALS.map((sig) => (
                  <div
                    key={sig.id}
                    onClick={() => setSelectedSignalId(sig.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      selectedSignalId === sig.id
                        ? "bg-[#141414] border-neutral-500 shadow-md"
                        : "bg-[#0b0b0b] border-[#1a1a1a] hover:border-neutral-700"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {sig.channel === "bale" && <BaleIcon className="w-4 h-4 text-emerald-400" />}
                        {sig.channel === "telegram" && <TelegramIcon className="w-4 h-4 text-sky-400" />}
                        {sig.channel === "forum" && <ForumIcon className="w-4 h-4 text-amber-400" />}
                        <span className="text-xs font-semibold text-white">{sig.channelTitle}</span>
                        <span className="text-[11px] text-neutral-500">({sig.sender})</span>
                      </div>
                      <span
                        className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: `${sig.tierColor}15`,
                          color: sig.tierColor,
                          border: `1px solid ${sig.tierColor}33`,
                        }}
                      >
                        {sig.tier} ({sig.score})
                      </span>
                    </div>
                    <p className="text-xs text-neutral-300 leading-relaxed line-clamp-2">{sig.text}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-[#181818] flex items-center justify-between text-[11px] font-mono text-neutral-500">
                <span>فیلتر معنایی: حذف ۹۸.۵٪ پیام‌های فاقد نیت خرید</span>
                <span className="text-neutral-400">۳ از ۳ سیگنال با امتیاز بالا</span>
              </div>
            </div>

            {/* Right 4-Column Stat & Features */}
            <div className="flex flex-col gap-8 lg:col-span-4 lg:col-start-9">
              <p className="text-xl sm:text-2xl text-neutral-400 leading-relaxed">
                <span className="text-white font-bold">پریکدرز هزاران مکالمه</span> را روزانه در رادار رصد کرده و بدون ایجاد مزاحمت، خریداران تشنه راهکار را استخراج می‌کند.
              </p>

              <ul className="flex flex-col gap-3 p-0 m-0 list-none text-xs sm:text-sm">
                <li className="text-neutral-500 font-mono uppercase text-xs">قابلیت‌های کلیدی خط لوله</li>
                <li className="flex items-center gap-2.5 text-white font-medium">
                  <CheckIcon className="w-4 h-4 text-[#00e599] shrink-0" />
                  <span>پایش پیوسته کانال‌های ایرانی و خارجی (Bale & TG)</span>
                </li>
                <li className="flex items-center gap-2.5 text-white font-medium">
                  <CheckIcon className="w-4 h-4 text-[#00e599] shrink-0" />
                  <span>فیلتر هوشمند هرزنامه‌ها و مکالمات عمومی بی‌هدف</span>
                </li>
                <li className="flex items-center gap-2.5 text-white font-medium">
                  <CheckIcon className="w-4 h-4 text-[#00e599] shrink-0" />
                  <span>جریان داده بلادرنگ مبتنی بر پروتکل SSE</span>
                </li>
                <li className="flex items-center gap-2.5 text-white font-medium">
                  <CheckIcon className="w-4 h-4 text-[#00e599] shrink-0" />
                  <span>تطبیق فوری با کلمات کلیدی و نیازهای پروفایل ICP</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* ========================================================
            06 PLATFORM PILLAR 2: ZAPIER-STYLE (ALTERNATING LAYOUT)
            Left (Col 1-4): Stat Quote & Features
            Right (Col 5-12): Preview Card with Ambient Glow
        ======================================================== */}
        <section id="deep-dive-2" className="py-24 px-4 sm:px-6 max-w-[1240px] mx-auto border-t border-[#141414]">
          <div className="mb-12">
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight max-w-2xl">
              سنجش نیت خرید با تفکیک ۴ سطحی
            </h2>
          </div>

          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Ambient Glow behind Preview Card */}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[#00e599] w-full h-40 rounded-full blur-[140px] opacity-[0.06] pointer-events-none lg:col-span-8 lg:col-start-5"
            />

            {/* Left 4-Column Stat & Features */}
            <div className="flex flex-col gap-8 lg:col-span-4 order-2 lg:order-1">
              <p className="text-xl sm:text-2xl text-neutral-400 leading-relaxed">
                <span className="text-white font-bold">بیش از ۹۲٪ دقت</span> در تفکیک افراد صرفاً کنجکاو از مشتریانی که بودجه و فوریت خرید قطعی دارند.
              </p>

              <ul className="flex flex-col gap-3 p-0 m-0 list-none text-xs sm:text-sm">
                <li className="text-neutral-500 font-mono uppercase text-xs">مزایای موتور نیت‌سنجی</li>
                <li className="flex items-center gap-2.5 text-white font-medium">
                  <CheckIcon className="w-4 h-4 text-[#00e599] shrink-0" />
                  <span>امتیازدهی نیت از ۰ تا ۱۰۰ بر پایه بافت متن</span>
                </li>
                <li className="flex items-center gap-2.5 text-white font-medium">
                  <CheckIcon className="w-4 h-4 text-[#00e599] shrink-0" />
                  <span>استخراج هوشمند رقم بودجه و بازه زمانی فوریت</span>
                </li>
                <li className="flex items-center gap-2.5 text-white font-medium">
                  <CheckIcon className="w-4 h-4 text-[#00e599] shrink-0" />
                  <span>جلوگیری کامل از اتلاف وقت با لیدهای کم‌کیفیت</span>
                </li>
                <li className="flex items-center gap-2.5 text-white font-medium">
                  <CheckIcon className="w-4 h-4 text-[#00e599] shrink-0" />
                  <span>تنظیم داینامیک آستانه حساسیت غربالگری</span>
                </li>
              </ul>
            </div>

            {/* Right 8-Column Preview Card: 4-Tier Intent Matrix */}
            <div className="relative isolate w-full lg:col-span-8 lg:col-start-5 rounded-2xl bg-[#090909] border border-[#202020] p-6 shadow-2xl overflow-hidden order-1 lg:order-2">
              <div className="flex items-center justify-between pb-3 mb-5 border-b border-[#181818]">
                <div className="font-mono text-xs text-neutral-400">ماتریس رتبه‌بندی نیت (Intent Classification)</div>
                <div className="text-xs font-mono text-emerald-400">SCORE: {selectedSignal.score}/100</div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-6">
                {/* Tier 1 */}
                <div className="p-3.5 rounded-xl bg-[#0d0d0d] border border-[#00e599]/30 hover:border-[#00e599] transition-all">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-[#00e599]">HIGH INTENT (۷۵ - ۱۰۰)</span>
                    <FlameIcon className="w-4 h-4 text-[#00e599]" />
                  </div>
                  <div className="text-xs text-white font-semibold mb-1">آماده خرید و تصمیم‌گیری</div>
                  <p className="text-[11px] text-neutral-400 leading-relaxed">
                    درد فوری، بودجه مشخص و درخواست صریح ابزار یا فروشنده جایگزین.
                  </p>
                </div>

                {/* Tier 2 */}
                <div className="p-3.5 rounded-xl bg-[#0d0d0d] border border-amber-500/30 hover:border-amber-500 transition-all">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-amber-400">PROBLEM AWARE (۴۵ - ۷۴)</span>
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                  </div>
                  <div className="text-xs text-white font-semibold mb-1">آگاه از درد و به دنبال راه‌حل</div>
                  <p className="text-[11px] text-neutral-400 leading-relaxed">
                    بیان چالش‌های کاری، نارضایتی از وضع فعلی اما بدون بودجه قطعی اعلام‌شده.
                  </p>
                </div>

                {/* Tier 3 */}
                <div className="p-3.5 rounded-xl bg-[#0d0d0d] border border-blue-500/20 hover:border-blue-500 transition-all">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-sky-400">CURIOUS (۲۰ - ۴۴)</span>
                    <span className="w-2 h-2 rounded-full bg-sky-400" />
                  </div>
                  <div className="text-xs text-white font-semibold mb-1">کنجکاوی عمومی و تحقیق بازار</div>
                  <p className="text-[11px] text-neutral-400 leading-relaxed">
                    پرسش درباره قیمت‌ها یا تکنولوژی‌ها بدون اعلام فوریت اجرایی.
                  </p>
                </div>

                {/* Tier 4 */}
                <div className="p-3.5 rounded-xl bg-[#0d0d0d] border border-neutral-700/40 hover:border-neutral-500 transition-all">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-neutral-400">IRRELEVANT (۰ - ۱۹)</span>
                    <span className="w-2 h-2 rounded-full bg-neutral-600" />
                  </div>
                  <div className="text-xs text-white font-semibold mb-1">گفت‌وگوهای نامرتبط و نویز</div>
                  <p className="text-[11px] text-neutral-400 leading-relaxed">
                    تبلیغات هرزنامه، گپ عمومی و مکالمات نامربوط به حوزه فعالیت کسب‌وکار.
                  </p>
                </div>
              </div>

              {/* Analysis of selected signal */}
              <div className="p-3.5 rounded-xl bg-[#060606] border border-[#1b1b1b]">
                <div className="text-[11px] font-mono text-neutral-500 mb-1">استدلال هوش مصنوعی روی سیگنال انتخابی:</div>
                <div className="text-xs text-neutral-200 leading-relaxed">{selectedSignal.analysis}</div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            07 PLATFORM PILLAR 3: MINTLIFY-STYLE (ACTION & AI DRAFT)
            Left (Col 1-8): Preview Card with AI Inspector
            Right (Col 10-12): Stat Quote & Actionable Features
        ======================================================== */}
        <section id="deep-dive-3" className="py-24 px-4 sm:px-6 max-w-[1240px] mx-auto border-t border-[#141414]">
          <div className="mb-12">
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight max-w-2xl">
              پاسخ اختصاصی و اقدام فروش در ۳ ثانیه
            </h2>
          </div>

          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Ambient Glow */}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-sky-500 w-full h-40 rounded-full blur-[140px] opacity-[0.05] pointer-events-none lg:col-span-8"
            />

            {/* Left 8-Column Preview Card: AI Outreach Inspector */}
            <div className="relative isolate w-full lg:col-span-8 rounded-2xl bg-[#090909] border border-[#202020] p-6 shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between pb-3 mb-5 border-b border-[#181818]">
                <div className="flex items-center gap-2">
                  <SparklesIcon className="w-4 h-4 text-[#00e599]" />
                  <span className="font-mono text-xs text-white">تحلیلگر و پیش‌نویس خودکار رادار</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#161616] text-neutral-400 border border-[#262626]">
                    هزینه: {selectedSignal.cost}
                  </span>
                </div>
              </div>

              {/* Lead Details Breakdown */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-[#0d0d0d] border border-[#1c1c1c]">
                    <div className="text-[11px] font-mono text-neutral-500 mb-1">میزان فوریت خرید:</div>
                    <div className="text-xs font-bold text-emerald-400">{selectedSignal.urgency}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#0d0d0d] border border-[#1c1c1c]">
                    <div className="text-[11px] font-mono text-neutral-500 mb-1">بودجه تخمینی استخراج‌شده:</div>
                    <div className="text-xs font-bold text-white font-mono">{selectedSignal.budget}</div>
                  </div>
                </div>

                {/* Suggested Reply Box */}
                <div className="p-4 rounded-xl bg-[#060606] border border-[#252525]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-white">پیش‌نویس پیام شخصی‌سازی‌شده برای ارسال:</span>
                    <button
                      type="button"
                      onClick={handleCopyReply}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-[#161616] hover:bg-[#222222] text-neutral-200 border border-[#2c2c2c] transition-colors cursor-pointer"
                    >
                      {copiedReply ? (
                        <>
                          <CheckIcon className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">کپی شد!</span>
                        </>
                      ) : (
                        <>
                          <CopyIcon className="w-3.5 h-3.5" />
                          <span>کپی متن پاسخ</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans">{selectedSignal.suggestedReply}</p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#181818] flex items-center justify-between text-[11px] font-mono text-neutral-500">
                <span>زنجیره پشتیبان چندمدله: Claude 3.5 Sonnet → DeepSeek V3 → Gemini Flash</span>
                <span className="text-[#00e599]">یکپارچگی مستقیم با CRM</span>
              </div>
            </div>

            {/* Right 4-Column Stat & Features */}
            <div className="flex flex-col gap-8 lg:col-span-4 lg:col-start-9">
              <p className="text-xl sm:text-2xl text-neutral-400 leading-relaxed">
                <span className="text-white font-bold">۱۵ دقیقه زمان جست‌وجو</span> و پیام‌نگاری دستی، به ۳ ثانیه بررسی و تأیید نهایی توسط کارشناس فروش تبدیل می‌شود.
              </p>

              <ul className="flex flex-col gap-3 p-0 m-0 list-none text-xs sm:text-sm">
                <li className="text-neutral-500 font-mono uppercase text-xs">اتوماسیون هوشمند فروش</li>
                <li className="flex items-center gap-2.5 text-white font-medium">
                  <CheckIcon className="w-4 h-4 text-[#00e599] shrink-0" />
                  <span>تولید پاسخ فارسی با لحن محترمانه و حرفه‌ای</span>
                </li>
                <li className="flex items-center gap-2.5 text-white font-medium">
                  <CheckIcon className="w-4 h-4 text-[#00e599] shrink-0" />
                  <span>انطباق پیام با ویژگی‌های ارزش‌آفرین محصول</span>
                </li>
                <li className="flex items-center gap-2.5 text-white font-medium">
                  <CheckIcon className="w-4 h-4 text-[#00e599] shrink-0" />
                  <span>ارسال اتوماتیک لید به وب‌هوک و CRM دیدار یا Hubspot</span>
                </li>
                <li className="flex items-center gap-2.5 text-white font-medium">
                  <CheckIcon className="w-4 h-4 text-[#00e599] shrink-0" />
                  <span>شفافیت کامل در هزینه‌های توکن و پردازش</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* ========================================================
            08 "RECENTLY SHIPPED" BENTO GRID (Vercel Style)
        ======================================================== */}
        <section id="shipped" className="py-24 px-4 sm:px-6 max-w-[1240px] mx-auto border-t border-[#141414]">
          <div className="mb-12">
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              ویژگی‌های منتشر شده در رادار ۲.۴
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* Bento Card 1 (Span 6): VoiceOrb AI Sales Co-Pilot */}
            <div id="voice-orb" className="md:col-span-6 rounded-2xl bg-[#090909] border border-[#1f1f1f] p-6 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#141414] border border-[#262626] text-[11px] font-mono text-[#00e599]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00e599] animate-pulse" />
                    <span>VOICE INTELLIGENCE CO-PILOT</span>
                  </div>
                  <span className="text-xs text-neutral-500 font-mono">PRI-VOICE-01</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">دستیار صوتی و هوشمند VoiceOrb</h3>
                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed mb-6">
                  بررسی صوتی لیدها، شنیدن خلاصه فرصت‌ها در حین کار و پرسش صوتی درباره وضعیت پایپ‌لاین فروش بدون نیاز به کلیک.
                </p>
              </div>

              {/* Interactive VoiceOrb Showcase Component */}
              <div className="p-4 rounded-xl bg-[#040404] border border-[#191919] flex items-center justify-center min-h-[160px]">
                <div className="scale-90">
                  <VoiceOrb />
                </div>
              </div>
            </div>

            {/* Bento Card 2 (Span 6): Local PocketBase Privacy */}
            <div id="architecture" className="md:col-span-6 rounded-2xl bg-[#090909] border border-[#1f1f1f] p-6 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#141414] border border-[#262626] text-[11px] font-mono text-purple-400">
                    <span>ZERO CLOUD LEAKAGE</span>
                  </div>
                  <span className="text-xs text-neutral-500 font-mono">POCKETBASE v0.25</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">حریم خصوصی و ذخیره‌سازی محلی</h3>
                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed mb-6">
                  تمام سرنخ‌ها، متن پیام‌ها و تنظیمات ICP داخل موتور محلی PocketBase ذخیره می‌شوند؛ هیچ داده‌ای به کلادهای تجاری نامطمئن نشت نمی‌کند.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#040404] border border-[#191919] font-mono text-xs text-neutral-300 space-y-2">
                <div className="flex items-center justify-between text-neutral-500 pb-2 border-b border-[#141414]">
                  <span>Local SQLite Storage</span>
                  <span className="text-emerald-400">Running on 127.0.0.1:8090</span>
                </div>
                <div className="text-[11px] text-neutral-400">
                  <div>• Collections: leads, raw_messages, products, icp_configs</div>
                  <div>• Latency: &lt; 2ms query execution speed</div>
                  <div>• Encryption: Local database files with restricted access</div>
                </div>
              </div>
            </div>

            {/* Bento Card 3 (Span 4): Prompt Injection Defense */}
            <div className="md:col-span-4 rounded-2xl bg-[#090909] border border-[#1f1f1f] p-5 shadow-xl">
              <div className="text-xs font-mono text-amber-400 mb-2">NEURAL GUARDRAILS</div>
              <h4 className="text-base font-bold text-white mb-1.5">محافظت ضد تزریق پرامپت</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                پالایش حملات مهندسی معکوس و پیام‌های فریبنده کاربران برای جلوگیری از پاسخ‌های ناخواسته هوش مصنوعی.
              </p>
            </div>

            {/* Bento Card 4 (Span 4): Token Economics */}
            <div id="economics" className="md:col-span-4 rounded-2xl bg-[#090909] border border-[#1f1f1f] p-5 shadow-xl">
              <div className="text-xs font-mono text-emerald-400 mb-2">AI ECONOMICS</div>
              <h4 className="text-base font-bold text-white mb-1.5">اقتصاد شفاف توکن‌ها</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                هزینه میانگین ۹ تومان برای هر پیام تحلیل‌شده؛ ۹۹٪ ارزان‌تر از هزینه‌های حقوق SDR و بررسی انسانی سنتی.
              </p>
            </div>

            {/* Bento Card 5 (Span 4): Iranian Protocol Adapters */}
            <div className="md:col-span-4 rounded-2xl bg-[#090909] border border-[#1f1f1f] p-5 shadow-xl">
              <div className="text-xs font-mono text-sky-400 mb-2">NATIVE ADAPTERS</div>
              <h4 className="text-base font-bold text-white mb-1.5">پشتیبانی بومی زبان فارسی</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                شناسایی ظرایف زبانی، اصطلاحات عامیانه و چت‌های اختصاری تلگرام و بله با توکنایزر اختصاصی فارسی.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================
            09 DEVELOPER API & CODE TERMINAL (Vercel Style)
        ======================================================== */}
        <section id="code" className="py-24 px-4 sm:px-6 max-w-[1240px] mx-auto border-t border-[#141414]">
          <div className="mb-12">
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              یکپارچگی در چند دقیقه با API رادار
            </h2>
            <p className="text-sm text-neutral-400 mt-2">
              سیگنال‌های خرید را مستقیم در وب‌سایت، CRM یا اتوماسیون‌های سفارشی پایتون و تایپ‌اسکریپت دریافت کنید.
            </p>
          </div>

          <div className="rounded-2xl bg-[#070707] border border-[#1f1f1f] shadow-2xl overflow-hidden text-left" dir="ltr">
            {/* Terminal Tab Bar */}
            <div className="h-11 px-4 border-b border-[#181818] bg-[#0c0c0c] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveCodeTab("typescript")}
                  className={`px-3 py-1 rounded-md text-xs font-mono transition-colors cursor-pointer ${
                    activeCodeTab === "typescript" ? "bg-[#1c1c1c] text-white" : "text-neutral-500 hover:text-neutral-300"
                  }`}
                >
                  TypeScript
                </button>
                <button
                  type="button"
                  onClick={() => setActiveCodeTab("python")}
                  className={`px-3 py-1 rounded-md text-xs font-mono transition-colors cursor-pointer ${
                    activeCodeTab === "python" ? "bg-[#1c1c1c] text-white" : "text-neutral-500 hover:text-neutral-300"
                  }`}
                >
                  Python
                </button>
                <button
                  type="button"
                  onClick={() => setActiveCodeTab("curl")}
                  className={`px-3 py-1 rounded-md text-xs font-mono transition-colors cursor-pointer ${
                    activeCodeTab === "curl" ? "bg-[#1c1c1c] text-white" : "text-neutral-500 hover:text-neutral-300"
                  }`}
                >
                  cURL
                </button>
              </div>

              <button
                type="button"
                onClick={() => handleCopyCode(sampleCodeSnippets[activeCodeTab])}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono text-neutral-400 hover:text-white bg-[#141414] hover:bg-[#1f1f1f] border border-[#242424] transition-colors cursor-pointer"
              >
                {copiedCode ? <CheckIcon className="w-3.5 h-3.5 text-emerald-400" /> : <CopyIcon className="w-3.5 h-3.5" />}
                <span>{copiedCode ? "Copied" : "Copy"}</span>
              </button>
            </div>

            {/* Code Body */}
            <div className="p-5 font-mono text-xs sm:text-sm text-neutral-300 overflow-x-auto leading-relaxed">
              <pre>
                <code>{sampleCodeSnippets[activeCodeTab]}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* ========================================================
            10 GIANT HIGH-IMPACT CTA (Vercel Style)
        ======================================================== */}
        <section className="relative py-28 px-4 sm:px-6 max-w-[1240px] mx-auto text-center border-t border-[#141414] overflow-hidden">
          <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
            <div className="w-[600px] h-[300px] vercel-hero-glow blur-[140px] opacity-75" />
          </div>

          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight mb-6">
              آماده‌اید اولین سیگنال واقعی را شکار کنید؟
            </h2>
            <p className="text-sm sm:text-base text-neutral-400 leading-relaxed mb-10">
              گفت‌وگوهای شلوغ پیام‌رسان‌ها را به جریان مستمر و باکیفیت فرصت‌های فروش سازمانتان تبدیل نمایید.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Link
                href="/dashboard"
                className="w-full sm:w-auto h-12 px-8 rounded-full font-bold text-sm bg-white text-black hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 shadow-[0_0_35px_rgba(255,255,255,0.35)] active:scale-95 cursor-pointer"
              >
                <SparklesIcon className="w-4 h-4 text-black" />
                <span>ورود به کنسول رادار</span>
                <span className="font-mono text-black">←</span>
              </Link>
              <Link
                href="/settings"
                className="w-full sm:w-auto h-12 px-7 rounded-full font-medium text-sm bg-[#0d0d0d] hover:bg-[#171717] text-white border border-[#2b2b2b] hover:border-neutral-500 transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
              >
                <span>شخصی‌سازی کلمات و ICP</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ========================================================
          11 COMPREHENSIVE FOOTER (Vercel Directory Architecture)
      ======================================================== */}
      <footer className="border-t border-[#181818] bg-[#030303] text-neutral-400 py-16 px-4 sm:px-6">
        <div className="max-w-[1240px] mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-16">
            {/* Column 1: Products */}
            <div>
              <div className="text-xs font-mono font-bold text-white uppercase tracking-wider mb-4">محصولات رادار</div>
              <ul className="space-y-2.5 text-xs">
                <li>
                  <Link href="/dashboard" className="hover:text-white transition-colors">
                    پایش لیدها (Signal Stream)
                  </Link>
                </li>
                <li>
                  <Link href="/settings" className="hover:text-white transition-colors">
                    پیکربندی ICP هوشمند
                  </Link>
                </li>
                <li>
                  <a href="#voice-orb" className="hover:text-white transition-colors">
                    دستیار صوتی VoiceOrb
                  </a>
                </li>
                <li>
                  <a href="#deep-dive-2" className="hover:text-white transition-colors">
                    موتور نیت‌سنجی ۴ سطحی
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 2: Channels */}
            <div>
              <div className="text-xs font-mono font-bold text-white uppercase tracking-wider mb-4">کانال‌های پشتیبانی‌شده</div>
              <ul className="space-y-2.5 text-xs">
                <li>
                  <span className="hover:text-white transition-colors cursor-default">پیام‌رسان بله (Bale)</span>
                </li>
                <li>
                  <span className="hover:text-white transition-colors cursor-default">سوپرگروه‌های تلگرام</span>
                </li>
                <li>
                  <span className="hover:text-white transition-colors cursor-default">توییتر / X</span>
                </li>
                <li>
                  <span className="hover:text-white transition-colors cursor-default">انجمن‌ها و فروم‌های تخصصی</span>
                </li>
              </ul>
            </div>

            {/* Column 3: Resources */}
            <div>
              <div className="text-xs font-mono font-bold text-white uppercase tracking-wider mb-4">منابع و مستندات</div>
              <ul className="space-y-2.5 text-xs">
                <li>
                  <a href="#architecture" className="hover:text-white transition-colors">
                    معماری فنی سیستم
                  </a>
                </li>
                <li>
                  <a href="#code" className="hover:text-white transition-colors">
                    راهنمای یکپارچگی API
                  </a>
                </li>
                <li>
                  <a href="#economics" className="hover:text-white transition-colors">
                    محاسبه اقتصاد و توکن‌ها
                  </a>
                </li>
                <li>
                  <a href="#shipped" className="hover:text-white transition-colors">
                    تغییرات اخیر (Changelog)
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 4: PriCoders */}
            <div>
              <div className="text-xs font-mono font-bold text-white uppercase tracking-wider mb-4">تیم PriCoders</div>
              <ul className="space-y-2.5 text-xs">
                <li>
                  <span className="text-white font-medium">Radar Opportunity Intelligence</span>
                </li>
                <li className="text-neutral-500 text-[11px] leading-relaxed">
                  طراحی و پیاده‌سازی سامانه غربالگری و تحلیل نیت خرید مبتنی بر یادگیری ماشین و پردازش محلی.
                </li>
                <li className="pt-2 text-neutral-400">
                  <span>وضعیت: آماده ارائه به سرمایه‌گذاران و داوران</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar with Status Indicator */}
          <div className="pt-8 border-t border-[#141414] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-md bg-white text-black flex items-center justify-center font-bold">
                <svg viewBox="0 0 115 100" height="10" width="12" fill="currentColor">
                  <path fillRule="evenodd" d="M57.5 0 115 100H0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-neutral-400">© 2026 PriCoders Radar Engine. تمام حقوق محفوظ است.</span>
            </div>

            <div className="flex items-center gap-2 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>All Systems Operational ▲ PocketBase & SSE Connected</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
