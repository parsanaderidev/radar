"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  RadarLogo,
  RadarBadge,
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
/* نمونه سیگنال‌های واقعی برای پیش‌نمایش تعاملی کنسول                            */
/* -------------------------------------------------------------------------- */
interface SampleSignal {
  id: string;
  channel: "bale" | "telegram" | "twitter" | "forum";
  channelTitle: string;
  sender: string;
  timestamp: string;
  score: number;
  tier: "قصد خرید بالا" | "آگاه از مشکل" | "کنجکاو" | "نامرتبط";
  tierColor: string;
  text: string;
  analysis: string;
  urgency: "فوری (۲۴ ساعت)" | "متوسط (۱ هفته)" | "عمومی";
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
    tier: "قصد خرید بالا",
    tierColor: "#00e599",
    text: "ما برای تیم ۲۰ نفرمون به شدت دنبال یه راهکار مطمئن اتوماسیون پیگیری لیدها در کانال‌ها هستیم. روزی ۳ ساعت وقت تیم فروش هدر میره. بودجه ماهانه آماده تا ۱۵ میلیون داریم. چه نرم‌افزاری پیشنهاد می‌دید؟",
    analysis:
      "اعلام صریح اتلاف زمان روزانه (۳ ساعت)، ابعاد تیم فروش (۲۰ نفر)، سقف بودجه معین (۱۵ میلیون تومان) و فوریت بالا در انتخاب سامانه.",
    urgency: "فوری (۲۴ ساعت)",
    budget: "۱۵,۰۰۰,۰۰۰ تومان ماهانه",
    suggestedReply:
      "درود علیرضا عزیز، رادار دقیقاً این چالش را حل می‌کند: پایش پیوسته مکالمات و استخراج سرنخ‌های آماده معامله بدون دخالت انسانی. برای تست دموی زنده روی کانال‌های هدف در خدمت شما هستیم.",
    cost: "۹ تومان (کمتر از ۰.۰۰۰۱ دلار)",
  },
  {
    id: "sig-2",
    channel: "telegram",
    channelTitle: "تلگرام / گروه مدیران فروش سازمانی",
    sender: "سارا موحد (مدیر رشد)",
    timestamp: "۲۱ دقیقه پیش",
    score: 82,
    tier: "قصد خرید بالا",
    tierColor: "#00e599",
    text: "کسی تجربه استفاده از سرویس‌های ایرانی برای کشف مشتریان بالقوه در گروه‌ها داره؟ دنبال راهکاری هستیم که با نرم‌افزار دیدار یکپارچه بشه.",
    analysis:
      "نیاز مشخص به کشف سرنخ در گروه‌های محلی، درخواست معرفی سرویس ایرانی و پیش‌شرط اتصال خودکار به نرم‌افزار مدیریت مشتریان دیدار.",
    urgency: "متوسط (۱ هفته)",
    budget: "آماده مذاکره و خرید",
    suggestedReply:
      "درود سارا گرامی، رادار سیگنال‌های خرید در پیام‌رسان‌ها را کشف کرده و از طریق وب‌هوک مستقیم به نرم‌افزار دیدار منتقل می‌کند. برای بررسی دمو در خدمت شما هستیم.",
    cost: "۸ تومان (کمتر از ۰.۰۰۰۱ دلار)",
  },
  {
    id: "sig-3",
    channel: "forum",
    channelTitle: "فروم استارتاپ‌ها و توسعه‌دهندگان",
    sender: "مهدی کاظمی (بنیان‌گذار)",
    timestamp: "۵۴ دقیقه پیش",
    score: 65,
    tier: "آگاه از مشکل",
    tierColor: "#f5a623",
    text: "چطور می‌تونیم بدون تبلیغات کلیکی پرهزینه، اولین ۱۰۰ مشتری سازمانی نرم‌افزارمون رو در جوامع آنلاین پیدا کنیم؟",
    analysis:
      "آگاهی کامل از چالش کشف مشتری اولیه و اجتناب از هزینه‌های بالای تبلیغات سنتی؛ موقعیتی مناسب برای ارائه مشاوره و تبدیل به مشتری پایدار.",
    urgency: "متوسط (۱ هفته)",
    budget: "بودجه استارتاپی",
    suggestedReply:
      "سلام مهدی عزیز، پایش هدفمند گفت‌وگوهای نیازمحور در فروم‌ها یکی از پربازده‌ترین روش‌هاست؛ رادار این فرایند را به شکل اتوماتیک برای شما انجام می‌دهد.",
    cost: "۷ تومان (کمتر از ۰.۰۰۰۱ دلار)",
  },
];

/* -------------------------------------------------------------------------- */
/* ساختار پلن‌های قیمت‌گذاری مدل B2B SaaS + مصرف‌محور                         */
/* -------------------------------------------------------------------------- */
interface PricingPlan {
  id: string;
  name: string;
  badge?: string;
  isPopular?: boolean;
  isUpcoming?: boolean;
  audience: string;
  monthlyPrice: string;
  annualEquivalentMonthly: string;
  messageLimit: string;
  ctaText: string;
  ctaLink: string;
  featuresHeader: string;
  features: string[];
}

const PRICING_PLANS: PricingPlan[] = [
  {
    id: "starter",
    name: "پلن استارتر",
    badge: "فعال و در دسترس • نسخه عملیاتی رادار",
    isPopular: true,
    isUpcoming: false,
    audience: "طراحی‌شده برای پایش بی‌درنگ، کشف هوشمند فرصت‌ها و شروع فوری مذاکره فروش با هوش مصنوعی رادار",
    monthlyPrice: "۲,۴۰۰,۰۰۰ تومان",
    annualEquivalentMonthly: "۱,۹۲۰,۰۰۰ تومان",
    messageLimit: "۱۰,۰۰۰ پیام ماهانه • سقف مصرف فعال",
    ctaText: "شروع کار با رادار",
    ctaLink: "/dashboard",
    featuresHeader: "امکانات و سطح هوشمندی (قابلیت‌های فعال):",
    features: [
      "پایش و شنود هوشمند پیام‌ها در پیام‌رسان‌های بله و تلگرام",
      "موتور تشخیص هوشمند نیت خرید، استخراج نیاز و فوریت مشتری",
      "انطباق خودکار با ویژگی‌های محصول هدف و پرسونای مخاطبان",
      "رتبه‌بندی کیفی و تریاژ دقیق سرنخ‌ها (بالا، متوسط، کم)",
      "استخراج زمینه مکالمه و ارائه استدلال چرایی انتخاب سرنخ",
      "تولید خودکار پیش‌نویس پاسخ شخصی‌سازی‌شده جهت شروع مذاکره",
      "صندوق هوشمند سرنخ‌ها با قابلیت تغییر وضعیت و مدیریت پیگیری",
      "محاسبه و شفافیت کامل هزینه هوش مصنوعی به ازای هر تحلیل",
      "تنظیمات اختصاصی محصول هدف و شاخص‌های انطباق",
      "پایگاه‌داده اختصاصی و پایدار برای نگهداری امن سرنخ‌ها",
    ],
  },
  {
    id: "growth",
    name: "پلن رشد",
    isPopular: false,
    isUpcoming: true,
    audience: "طراحی‌شده برای سازمان‌ها و تیم‌های توسعه‌یافته با نیاز به پردازش در مقیاس بالا و اتصال به ابزارهای فروش",
    monthlyPrice: "۶,۸۰۰,۰۰۰ تومان",
    annualEquivalentMonthly: "۵,۴۴۰,۰۰۰ تومان",
    messageLimit: "۵۰,۰۰۰ پیام ماهانه • در حال توسعه",
    ctaText: "به‌زودی در دسترس قرار می‌گیرد",
    ctaLink: "#pricing",
    featuresHeader: "قابلیت‌های آینده در نقشه راه توسعه:",
    features: [
      "اتصال خودکار به سامانه‌های مدیریت ارتباط با مشتریان",
      "پایش همزمان چندین کانال و جوامع آنلاین به صورت خودکار",
      "امکان استفاده همزمان چند کاربر برای اعضای تیم فروش",
      "پشتیبانی و تحلیل همزمان چند محصول و سناریوی فروش مجزا",
      "ارسال اعلان‌های آنی از طریق وب‌هوک و پیام‌رسان",
      "اولویت پردازش اختصاصی در صف هوش مصنوعی",
    ],
  },
];

const COMPARISON_DIMENSIONS = [
  { label: "سقف پایش پیام ماهانه", starter: "۱۰,۰۰۰ پیام", growth: "۵۰,۰۰۰ پیام (به‌زودی)" },
  { label: "هوشمندی تشخیص نیت خرید", starter: "فعال (استخراج نیاز و فوریت)", growth: "پیشرفته چندلایه" },
  { label: "انطباق با ویژگی‌های محصول", starter: "فعال (تک‌محصول هدف)", growth: "چندمحصولی همزمان" },
  { label: "تولید پاسخ‌های پیشنهادی", starter: "فعال (شخصی‌سازی‌شده)", growth: "شخصی‌سازی پیشرفته چندلحنی" },
  { label: "صندوق و تریاژ سرنخ‌ها", starter: "فعال با وضعیت پیگیری", growth: "پیشرفته با ارجاع تیمی" },
  { label: "محاسبه شفاف هزینه مصرف", starter: "فعال (به ازای هر پیام)", growth: "گزارش تحلیلی پیشرفته" },
  { label: "کانال‌های تحت پایش", starter: "پیام‌رسان‌های بله و تلگرام", growth: "چندکاناله گسترده" },
  { label: "تعداد اعضای تیم فروش", starter: "۱ کاربر فعال", growth: "چند کاربر همزمان" },
  { label: "اتصال به سامانه مدیریت مشتریان", starter: "—", growth: "اتصال وب‌هوک و یکپارچگی" },
];

export default function PersianLandingPage() {
  const [selectedSignalId, setSelectedSignalId] = useState<string>("sig-1");
  const [copiedReply, setCopiedReply] = useState<boolean>(false);
  const [productsOpen, setProductsOpen] = useState<boolean>(false);
  const [resourcesOpen, setResourcesOpen] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const [showTable, setShowTable] = useState<boolean>(false);

  const selectedSignal = useMemo(
    () => SAMPLE_SIGNALS.find((s) => s.id === selectedSignalId) || SAMPLE_SIGNALS[0],
    [selectedSignalId]
  );

  const handleCopyReply = () => {
    navigator.clipboard.writeText(selectedSignal.suggestedReply);
    setCopiedReply(true);
    setTimeout(() => setCopiedReply(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#000000] text-[#ededed] selection:bg-white selection:text-black antialiased font-sans pb-28">
      {/* ========================================================
          پس‌زمینه: بافت نقطه‌ای مینیمال و نور ملایم محلی 
      ======================================================== */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage: "radial-gradient(#444 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[850px] h-[380px] vercel-hero-glow blur-[140px] rounded-full pointer-events-none" />
      </div>

      {/* ========================================================
          ۰۱. هدر ناوبری اصلی
      ======================================================== */}
      <header
        id="marketing-header"
        className="sticky top-0 z-50 w-full border-b border-[#1c1c1c] bg-black/85 backdrop-blur-xl transition-all"
      >
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-4">
          {/* لوگوی رادار با نشان PriCoders */}
          <div className="flex items-center gap-6">
            <Link href="/" className="inline-flex items-center gap-2.5 group cursor-pointer focus:outline-none">
              <RadarBadge className="w-7 h-7 rounded-lg shadow-sm" iconClassName="w-4 h-4 text-black" />
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg text-white tracking-tight">رادار</span>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#141414] text-neutral-400 border border-[#262626] font-mono">
                  PriCoders
                </span>
              </div>
            </Link>

            {/* منوی ناوبری فارسی */}
            <nav className="hidden md:flex items-center gap-1 text-xs text-neutral-400 font-medium">
              {/* منوی بازشونده محصولات */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setProductsOpen(!productsOpen);
                    setResourcesOpen(false);
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg hover:text-white hover:bg-[#121212] transition-colors cursor-pointer"
                >
                  <span>محصولات و امکانات</span>
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
                    className="absolute top-full right-0 mt-2 w-[440px] p-4 rounded-xl bg-[#0c0c0c] border border-[#222222] shadow-[0_20px_60px_rgba(0,0,0,0.9)] z-50 animate-card-in"
                  >
                    <div className="grid grid-cols-2 gap-4 text-right">
                      <div>
                        <div className="text-[11px] font-bold text-neutral-500 mb-2">هوشمندی فروش</div>
                        <ul className="space-y-1 text-xs">
                          <li>
                            <Link
                              href="/dashboard"
                              onClick={() => setProductsOpen(false)}
                              className="block p-2 rounded-lg hover:bg-[#181818] text-white hover:text-[#00e599] transition-colors"
                            >
                              <div className="font-semibold">پایش زنده سرنخ‌ها</div>
                              <div className="text-[11px] text-neutral-500">جریان لحظه‌ای با رتبه‌بندی نیت</div>
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/settings"
                              onClick={() => setProductsOpen(false)}
                              className="block p-2 rounded-lg hover:bg-[#181818] text-white hover:text-[#00e599] transition-colors"
                            >
                              <div className="font-semibold">پیکربندی مشتری ایده‌آل</div>
                              <div className="text-[11px] text-neutral-500">تعریف کلیدواژه‌ها و نیازمندی‌ها</div>
                            </Link>
                          </li>
                          <li>
                            <a
                              href="#voice-orb"
                              onClick={() => setProductsOpen(false)}
                              className="block p-2 rounded-lg hover:bg-[#181818] text-white hover:text-[#00e599] transition-colors"
                            >
                              <div className="font-semibold">دستیار صوتی و هوشمند</div>
                              <div className="text-[11px] text-neutral-500">شنیدن خلاصه فرصت‌ها و گزارش</div>
                            </a>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <div className="text-[11px] font-bold text-neutral-500 mb-2">زیرساخت و امنیت</div>
                        <ul className="space-y-1 text-xs">
                          <li>
                            <a
                              href="#economics"
                              onClick={() => setProductsOpen(false)}
                              className="block p-2 rounded-lg hover:bg-[#181818] text-white hover:text-[#00e599] transition-colors"
                            >
                              <div className="font-semibold">اقتصاد توکن و هزینه‌ها</div>
                              <div className="text-[11px] text-neutral-500">شفافیت کامل کمتر از ۱۰ تومان</div>
                            </a>
                          </li>
                          <li>
                            <a
                              href="#architecture"
                              onClick={() => setProductsOpen(false)}
                              className="block p-2 rounded-lg hover:bg-[#181818] text-white hover:text-[#00e599] transition-colors"
                            >
                              <div className="font-semibold">حریم خصوصی محلی</div>
                              <div className="text-[11px] text-neutral-500">پایگاه داده داخلی بدون نشت ابری</div>
                            </a>
                          </li>
                          <li>
                            <a
                              href="#channels"
                              onClick={() => setProductsOpen(false)}
                              className="block p-2 rounded-lg hover:bg-[#181818] text-white hover:text-[#00e599] transition-colors"
                            >
                              <div className="font-semibold">کانال‌های بومی</div>
                              <div className="text-[11px] text-neutral-500">پشتیبانی بله، تلگرام و فروم‌ها</div>
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* منوی بازشونده راهنما */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setResourcesOpen(!resourcesOpen);
                    setProductsOpen(false);
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg hover:text-white hover:bg-[#121212] transition-colors cursor-pointer"
                >
                  <span>راهنما و مستندات</span>
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
                    className="absolute top-full right-0 mt-2 w-[280px] p-3 rounded-xl bg-[#0c0c0c] border border-[#222222] shadow-[0_20px_60px_rgba(0,0,0,0.9)] z-50 animate-card-in text-right"
                  >
                    <ul className="space-y-1 text-xs">
                      <li>
                        <a
                          href="#architecture"
                          onClick={() => setResourcesOpen(false)}
                          className="block p-2 rounded-lg hover:bg-[#181818] text-white transition-colors"
                        >
                          <div className="font-semibold">معماری فنی سامانه</div>
                          <div className="text-[11px] text-neutral-500">پایپ‌لاین ۴ سطحی نیت‌سنجی</div>
                        </a>
                      </li>
                      <li>
                        <a
                          href="#pricing"
                          onClick={() => setResourcesOpen(false)}
                          className="block p-2 rounded-lg hover:bg-[#181818] text-white transition-colors"
                        >
                          <div className="font-semibold">مدل تجاری و قیمت‌گذاری</div>
                          <div className="text-[11px] text-neutral-500">پلن‌های مصرف‌محور و سرمایه‌گذاری</div>
                        </a>
                      </li>
                      <li>
                        <a
                          href="#shipped"
                          onClick={() => setResourcesOpen(false)}
                          className="block p-2 rounded-lg hover:bg-[#181818] text-white transition-colors"
                        >
                          <div className="font-semibold">گزارش تغییرات</div>
                          <div className="text-[11px] text-neutral-500">امکانات نسخه جدید PriCoders</div>
                        </a>
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              <a href="#channels" className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-[#121212] transition-colors">
                کانال‌ها
              </a>
              <a href="#pricing" className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-[#121212] transition-colors">
                قیمت‌گذاری
              </a>
              <a href="#economics" className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-[#121212] transition-colors">
                هزینه‌ها
              </a>
            </nav>
          </div>

          {/* دکمه‌های کنشی هدر */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/settings"
              className="hidden sm:inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-medium text-neutral-300 hover:text-white bg-[#0e0e0e] border border-[#262626] hover:border-neutral-500 transition-colors cursor-pointer"
            >
              <SettingsIcon className="w-3.5 h-3.5" />
              <span>تنظیمات</span>
            </Link>

            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 h-8 sm:h-9 px-4 rounded-xl text-xs font-semibold bg-white text-black hover:bg-neutral-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] active:scale-95 cursor-pointer"
            >
              <span>ورود به داشبورد</span>
              <span className="text-black">←</span>
            </Link>

            {/* دکمه منوی موبایل */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-[#181818]"
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

        {/* کشوی منوی موبایل */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-[#222222] bg-[#080808] px-4 py-4 space-y-2 text-right">
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block p-2 text-sm text-white font-medium hover:bg-[#141414] rounded-lg"
            >
              داشبورد لیدها
            </Link>
            <Link
              href="/settings"
              onClick={() => setMobileMenuOpen(false)}
              className="block p-2 text-sm text-neutral-300 hover:bg-[#141414] rounded-lg"
            >
              پیکربندی مشتری ایده‌آل
            </Link>
            <a
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="block p-2 text-sm text-neutral-300 hover:bg-[#141414] rounded-lg"
            >
              قیمت‌گذاری و مدل تجاری
            </a>
            <a
              href="#channels"
              onClick={() => setMobileMenuOpen(false)}
              className="block p-2 text-sm text-neutral-300 hover:bg-[#141414] rounded-lg"
            >
              کانال‌های تحت پایش
            </a>
            <a
              href="#economics"
              onClick={() => setMobileMenuOpen(false)}
              className="block p-2 text-sm text-neutral-300 hover:bg-[#141414] rounded-lg"
            >
              اقتصاد هوش مصنوعی
            </a>
          </div>
        )}
      </header>

      {/* ========================================================
          ۰۲. بنر اعلانات بالایی
      ======================================================== */}
      <div className="relative z-10 flex justify-center items-center w-full min-h-[44px] py-2 border-b border-[#141414] bg-black/40">
        <div className="flex flex-wrap gap-2.5 items-center justify-center px-4 text-xs text-center">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00e599] animate-pulse" />
          <span className="text-neutral-400">
            موتور هوشمندی فرصت‌های فروش توسعه‌یافته توسط تیم
          </span>
          <span className="text-white font-semibold">PriCoders</span>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium text-white border border-[#2b2b2b] hover:border-neutral-500 bg-[#0e0e0e] hover:bg-[#161616] transition-all cursor-pointer"
          >
            <span>مشاهده زنده سیگنال‌ها</span>
            <span>←</span>
          </Link>
        </div>
      </div>

      <main className="relative z-10">
        {/* ========================================================
            ۰۳. بخش هیرو: متن کاملاً وسط‌چین با پوشش خطی متوازن
        ======================================================== */}
        <section className="relative flex min-h-[min(calc(100svh-180px),720px)] flex-col justify-center items-center px-4 sm:px-6 max-w-[1240px] mx-auto select-none pt-16 pb-20 text-center">
          <div className="relative z-10 flex flex-col items-center justify-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.18] sm:leading-[1.14] mb-6 text-center text-balance">
              هوشمندی کشف فرصت‌های فروش.
              <br />
              <span className="bg-gradient-to-b from-white via-neutral-200 to-neutral-500 bg-clip-text text-transparent">
                از میان هیاهو تا معامله موفق.
              </span>
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-neutral-400 max-w-2xl mx-auto mb-10 leading-relaxed font-normal text-center text-balance">
              رادار به جای جست‌وجوی سطحی کلمات کلیدی، بافت و مکالمات بومی در بله، تلگرام، توییتر و فروم‌ها را درک می‌کند، شدت قصد خرید را می‌سنجد و سرنخ‌های آماده معامله را به تیم فروش تحویل می‌دهد.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto mb-10">
              <Link
                href="/dashboard"
                className="w-full sm:w-auto h-11 px-7 rounded-xl font-bold text-xs sm:text-sm bg-white text-black hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(255,255,255,0.25)] active:scale-95 cursor-pointer"
              >
                <SparklesIcon className="w-4 h-4 text-black" />
                <span>ورود به داشبورد لیدها</span>
                <span className="text-black">←</span>
              </Link>

              <a
                href="#pricing"
                className="w-full sm:w-auto h-11 px-6 rounded-xl font-medium text-xs sm:text-sm bg-[#0a0a0a] hover:bg-[#141414] text-white border border-[#2b2b2b] hover:border-neutral-500 transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
              >
                <span>مشاهده پلن‌های سرمایه‌گذاری</span>
                <span className="text-neutral-500">↓</span>
              </a>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-neutral-500">
              <span>ارزش محوری:</span>
              <span className="text-neutral-200 font-semibold">از میان هیاهو تا فرصت فروش</span>
              <span className="text-neutral-700 mx-1">|</span>
              <span className="text-emerald-400">۹۲٪ دقت تفکیک شدت قصد خرید</span>
            </div>
          </div>
        </section>

        {/* ========================================================
            ۰۴. نوار متحرک کانال‌ها: حلقه نامحدود و پیوسته (Infinite Loop)
        ======================================================== */}
        <section id="channels" className="py-12 border-y border-[#181818] bg-[#050505] overflow-hidden">
          <div className="max-w-[1240px] mx-auto px-4 sm:px-6 mb-5 text-center">
            <p className="text-xs text-neutral-500 tracking-wider">
              کانال‌ها و جوامع آنلاین تحت پایش لحظه‌ای
            </p>
          </div>

          <div
            className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]"
            dir="ltr"
          >
            <div className="animate-marquee flex items-center gap-12 sm:gap-16">
              {/* سری اول */}
              <div className="flex items-center gap-2.5 text-neutral-400 hover:text-white transition-colors shrink-0">
                <BaleIcon className="w-5 h-5 text-emerald-400" />
                <span className="text-sm font-semibold tracking-wide">پیام‌رسان بله</span>
              </div>
              <div className="flex items-center gap-2.5 text-neutral-400 hover:text-white transition-colors shrink-0">
                <TelegramIcon className="w-5 h-5 text-sky-400" />
                <span className="text-sm font-semibold tracking-wide">سوپرگروه‌های تلگرام</span>
              </div>
              <div className="flex items-center gap-2.5 text-neutral-400 hover:text-white transition-colors shrink-0">
                <TwitterXIcon className="w-5 h-5 text-white" />
                <span className="text-sm font-semibold tracking-wide">توییتر / شبکه اجتماعی ایکس</span>
              </div>
              <div className="flex items-center gap-2.5 text-neutral-400 hover:text-white transition-colors shrink-0">
                <ForumIcon className="w-5 h-5 text-amber-400" />
                <span className="text-sm font-semibold tracking-wide">انجمن‌ها و فروم‌های تخصصی</span>
              </div>
              <div className="flex items-center gap-2.5 text-neutral-400 hover:text-white transition-colors shrink-0">
                <div className="w-5 h-5 rounded-md bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white">
                  V
                </div>
                <span className="text-sm font-semibold tracking-wide">پایگاه‌های محتوایی ویرگول</span>
              </div>
              <div className="flex items-center gap-2.5 text-neutral-400 hover:text-white transition-colors shrink-0">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current text-white">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                <span className="text-sm font-semibold tracking-wide">گیت‌هاب دیسکاشنز</span>
              </div>

              {/* سری تکراری برای چرخش کاملاً پیوسته */}
              <div className="flex items-center gap-2.5 text-neutral-400 hover:text-white transition-colors shrink-0">
                <BaleIcon className="w-5 h-5 text-emerald-400" />
                <span className="text-sm font-semibold tracking-wide">پیام‌رسان بله</span>
              </div>
              <div className="flex items-center gap-2.5 text-neutral-400 hover:text-white transition-colors shrink-0">
                <TelegramIcon className="w-5 h-5 text-sky-400" />
                <span className="text-sm font-semibold tracking-wide">سوپرگروه‌های تلگرام</span>
              </div>
              <div className="flex items-center gap-2.5 text-neutral-400 hover:text-white transition-colors shrink-0">
                <TwitterXIcon className="w-5 h-5 text-white" />
                <span className="text-sm font-semibold tracking-wide">توییتر / شبکه اجتماعی ایکس</span>
              </div>
              <div className="flex items-center gap-2.5 text-neutral-400 hover:text-white transition-colors shrink-0">
                <ForumIcon className="w-5 h-5 text-amber-400" />
                <span className="text-sm font-semibold tracking-wide">انجمن‌ها و فروم‌های تخصصی</span>
              </div>
              <div className="flex items-center gap-2.5 text-neutral-400 hover:text-white transition-colors shrink-0">
                <div className="w-5 h-5 rounded-md bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white">
                  V
                </div>
                <span className="text-sm font-semibold tracking-wide">پایگاه‌های محتوایی ویرگول</span>
              </div>
              <div className="flex items-center gap-2.5 text-neutral-400 hover:text-white transition-colors shrink-0">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current text-white">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                <span className="text-sm font-semibold tracking-wide">گیت‌هاب دیسکاشنز</span>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            ۰۵. بخش عمیق ۱: شنود هوشمند در سرچشمه گفت‌وگوها
        ======================================================== */}
        <section id="deep-dive-1" className="py-24 px-4 sm:px-6 max-w-[1240px] mx-auto border-t border-[#141414]">
          <div className="flex flex-col items-center justify-center text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight flex flex-wrap justify-center text-center mb-3">
              شنود هوشمند در سرچشمه گفت‌وگوها
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 text-center max-w-xl mx-auto leading-relaxed">
              پایش مستقیم مکالمات بدون واسطه و تفکیک خودکار پیام‌های هدفمند از نویزهای روزمره در جوامع آنلاین.
            </p>
          </div>

          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* کارت پیش‌نمایش مانیتور استریم */}
            <div className="relative isolate w-full lg:col-span-8 rounded-xl bg-[#090909] border border-[#202020] p-5 shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#181818]">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#222]" />
                  <span className="w-3 h-3 rounded-full bg-[#222]" />
                  <span className="w-3 h-3 rounded-full bg-[#222]" />
                  <span className="text-xs text-neutral-400 mr-2">جریان زنده ورودی پیام‌ها</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#00e599]">
                  <span className="w-2 h-2 rounded-full bg-[#00e599] animate-pulse" />
                  <span>پایش فعال و آنلاین</span>
                </div>
              </div>

              {/* لیست پیش‌نمایش پیام‌ها */}
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
                        className="text-[10px] font-bold px-2 py-0.5 rounded-lg"
                        style={{
                          backgroundColor: `${sig.tierColor}15`,
                          color: sig.tierColor,
                          border: `1px solid ${sig.tierColor}33`,
                        }}
                      >
                        {sig.tier} (امتیاز {sig.score})
                      </span>
                    </div>
                    <p className="text-xs text-neutral-300 leading-relaxed line-clamp-2">{sig.text}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-[#181818] flex items-center justify-between text-[11px] text-neutral-500">
                <span>فیلتر معنایی: حذف ۹۸.۵٪ پیام‌های فاقد نیت خرید</span>
                <span className="text-neutral-400">۳ از ۳ پیام با شدت نیاز معین</span>
              </div>
            </div>

            {/* توضیحات ستون کناری */}
            <div className="flex flex-col gap-6 lg:col-span-4 lg:col-start-9 text-right">
              <p className="text-lg sm:text-xl text-neutral-300 leading-relaxed">
                تیم <span className="text-white font-bold">PriCoders</span> با پردازش بومی ساختار مکالمات، خریداران واقعی را از میان هزاران گفت‌وگوی پراکنده جدا می‌سازد.
              </p>

              <ul className="flex flex-col gap-3 p-0 m-0 list-none text-xs sm:text-sm">
                <li className="text-neutral-500 text-xs font-bold">قابلیت‌های کلیدی خط لوله</li>
                <li className="flex items-center gap-2.5 text-white font-medium">
                  <CheckIcon className="w-4 h-4 text-[#00e599] shrink-0" />
                  <span>پایش پیوسته کانال‌های بله و سوپرگروه‌های تلگرام</span>
                </li>
                <li className="flex items-center gap-2.5 text-white font-medium">
                  <CheckIcon className="w-4 h-4 text-[#00e599] shrink-0" />
                  <span>فیلتر هوشمند پیام‌های تبلیغاتی و چت‌های نامرتبط</span>
                </li>
                <li className="flex items-center gap-2.5 text-white font-medium">
                  <CheckIcon className="w-4 h-4 text-[#00e599] shrink-0" />
                  <span>جریان داده بلادرنگ بدون وقفه و نیاز به رفرش دستی</span>
                </li>
                <li className="flex items-center gap-2.5 text-white font-medium">
                  <CheckIcon className="w-4 h-4 text-[#00e599] shrink-0" />
                  <span>تطبیق فوری با کلیدواژه‌ها و نیازمندی‌های مشتری هدف</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* ========================================================
            ۰۶. بخش عمیق ۲: سنجش نیت خرید با تفکیک ۴ سطحی
        ======================================================== */}
        <section id="deep-dive-2" className="py-24 px-4 sm:px-6 max-w-[1240px] mx-auto border-t border-[#141414]">
          <div className="flex flex-col items-center justify-center text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight flex flex-wrap justify-center text-center mb-3">
              سنجش نیت خرید با تفکیک ۴ سطحی
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 text-center max-w-xl mx-auto leading-relaxed">
              دسته‌بندی هوشمندانه مشتریان بر پایه فوریت، درد اعلام‌شده و آمادگی مالی برای تصمیم‌گیری سریع تیم فروش.
            </p>
          </div>

          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* ستون متنی */}
            <div className="flex flex-col gap-6 lg:col-span-4 order-2 lg:order-1 text-right">
              <p className="text-lg sm:text-xl text-neutral-300 leading-relaxed">
                <span className="text-white font-bold">بیش از ۹۲٪ دقت</span> در تفکیک افراد صرفاً کنجکاو از خریدارانی که بودجه و فوریت اعلام‌شده دارند.
              </p>

              <ul className="flex flex-col gap-3 p-0 m-0 list-none text-xs sm:text-sm">
                <li className="text-neutral-500 text-xs font-bold">مزایای موتور نیت‌سنجی</li>
                <li className="flex items-center gap-2.5 text-white font-medium">
                  <CheckIcon className="w-4 h-4 text-[#00e599] shrink-0" />
                  <span>امتیازدهی نیت از ۰ تا ۱۰۰ بر پایه زمینه مکالمه</span>
                </li>
                <li className="flex items-center gap-2.5 text-white font-medium">
                  <CheckIcon className="w-4 h-4 text-[#00e599] shrink-0" />
                  <span>استخراج هوشمندانه بودجه و بازه زمانی فوریت</span>
                </li>
                <li className="flex items-center gap-2.5 text-white font-medium">
                  <CheckIcon className="w-4 h-4 text-[#00e599] shrink-0" />
                  <span>جلوگیری از اتلاف وقت کارشناسان با لیدهای بی‌نتیجه</span>
                </li>
                <li className="flex items-center gap-2.5 text-white font-medium">
                  <CheckIcon className="w-4 h-4 text-[#00e599] shrink-0" />
                  <span>امکان تنظیم میزان حساسیت و فیلترها در بخش تنظیمات</span>
                </li>
              </ul>
            </div>

            {/* کارت ماتریس ۴ سطحی نیت */}
            <div className="relative isolate w-full lg:col-span-8 lg:col-start-5 rounded-xl bg-[#090909] border border-[#202020] p-6 shadow-2xl overflow-hidden order-1 lg:order-2">
              <div className="flex items-center justify-between pb-3 mb-5 border-b border-[#181818]">
                <div className="text-xs text-neutral-400">ماتریس رتبه‌بندی نیت خرید</div>
                <div className="text-xs text-emerald-400 font-semibold">امتیاز پیام فعال: {selectedSignal.score} از ۱۰۰</div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-6 text-right">
                {/* سطح ۱ */}
                <div className="p-3.5 rounded-xl bg-[#0d0d0d] border border-[#00e599]/30 hover:border-[#00e599] transition-all">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-[#00e599]">قصد خرید بالا (۷۵ تا ۱۰۰)</span>
                    <FlameIcon className="w-4 h-4 text-[#00e599]" />
                  </div>
                  <div className="text-xs text-white font-semibold mb-1">آماده خرید و تصمیم‌گیری</div>
                  <p className="text-[11px] text-neutral-400 leading-relaxed">
                    بیان مشکل حاد، بودجه معین و جست‌وجوی فوری برای ابزار یا سرویس مناسب.
                  </p>
                </div>

                {/* سطح ۲ */}
                <div className="p-3.5 rounded-xl bg-[#0d0d0d] border border-amber-500/30 hover:border-amber-500 transition-all">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-amber-400">آگاه از مشکل (۴۵ تا ۷۴)</span>
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                  </div>
                  <div className="text-xs text-white font-semibold mb-1">آگاه از درد و به دنبال راه‌حل</div>
                  <p className="text-[11px] text-neutral-400 leading-relaxed">
                    طرح چالش‌های کاری و نیاز به بهبود، بدون اعلام صریح سقف بودجه قطعی.
                  </p>
                </div>

                {/* سطح ۳ */}
                <div className="p-3.5 rounded-xl bg-[#0d0d0d] border border-blue-500/20 hover:border-blue-500 transition-all">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-sky-400">کنجکاو و پژوهشگر (۲۰ تا ۴۴)</span>
                    <span className="w-2 h-2 rounded-full bg-sky-400" />
                  </div>
                  <div className="text-xs text-white font-semibold mb-1">تحقیق بازار و مقایسه اولیه</div>
                  <p className="text-[11px] text-neutral-400 leading-relaxed">
                    پرسش درباره قیمت‌ها یا فناوری‌ها بدون اعلام فوریت اجرایی کوتاه‌مدت.
                  </p>
                </div>

                {/* سطح ۴ */}
                <div className="p-3.5 rounded-xl bg-[#0d0d0d] border border-neutral-700/40 hover:border-neutral-500 transition-all">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-neutral-400">نامرتبط و هرزنامه (۰ تا ۱۹)</span>
                    <span className="w-2 h-2 rounded-full bg-neutral-600" />
                  </div>
                  <div className="text-xs text-white font-semibold mb-1">گفت‌وگوهای غیرکاری و نویز</div>
                  <p className="text-[11px] text-neutral-400 leading-relaxed">
                    تبلیغات هرزنامه، گپ عمومی و پیام‌های خارج از حوزه هدف کسب‌وکار.
                  </p>
                </div>
              </div>

              {/* استدلال پیام انتخابی */}
              <div className="p-3.5 rounded-xl bg-[#060606] border border-[#1b1b1b] text-right">
                <div className="text-[11px] text-neutral-500 mb-1">استدلال هوش مصنوعی روی پیام انتخابی:</div>
                <div className="text-xs text-neutral-200 leading-relaxed">{selectedSignal.analysis}</div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            ۰۷. بخش عمیق ۳: پاسخ اختصاصی و اقدام فروش در ۳ ثانیه
        ======================================================== */}
        <section id="deep-dive-3" className="py-24 px-4 sm:px-6 max-w-[1240px] mx-auto border-t border-[#141414]">
          <div className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight flex flex-wrap justify-center text-center mb-3">
              پاسخ اختصاصی و اقدام فروش در ۳ ثانیه
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 text-center max-w-3xl mx-auto leading-relaxed">
              تحلیل عمیق درد کاربر و آماده‌سازی پیشنهاد متناسب در لحظه با قابلیت کپی فوری و ارسال مستقیم به ارتباط با مشتریان.
            </p>
          </div>

          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* کارت بازرس لید و پیش‌نویس پاسخ */}
            <div className="relative isolate w-full lg:col-span-8 rounded-xl bg-[#090909] border border-[#202020] p-6 shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between pb-3 mb-5 border-b border-[#181818]">
                <div className="flex items-center gap-2">
                  <SparklesIcon className="w-4 h-4 text-[#00e599]" />
                  <span className="text-xs text-white font-medium">تحلیلگر و پیش‌نویس خودکار رادار</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] px-2.5 py-1 rounded-lg bg-[#161616] text-neutral-400 border border-[#262626]">
                    هزینه استخراج: {selectedSignal.cost}
                  </span>
                </div>
              </div>

              {/* جزئیات استخراج‌شده */}
              <div className="space-y-4 text-right">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-[#0d0d0d] border border-[#1c1c1c]">
                    <div className="text-[11px] text-neutral-500 mb-1">میزان فوریت خرید:</div>
                    <div className="text-xs font-bold text-emerald-400">{selectedSignal.urgency}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#0d0d0d] border border-[#1c1c1c]">
                    <div className="text-[11px] text-neutral-500 mb-1">بودجه تخمینی استخراج‌شده:</div>
                    <div className="text-xs font-bold text-white">{selectedSignal.budget}</div>
                  </div>
                </div>

                {/* کادر متن پاسخ پیشنهادی */}
                <div className="p-4 rounded-xl bg-[#060606] border border-[#252525]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-white">پیش‌نویس پیام شخصی‌سازی‌شده برای ارسال:</span>
                    <button
                      type="button"
                      onClick={handleCopyReply}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#161616] hover:bg-[#222222] text-neutral-200 border border-[#2c2c2c] transition-colors cursor-pointer"
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
                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">{selectedSignal.suggestedReply}</p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#181818] flex items-center justify-between text-[11px] text-neutral-500">
                <span>زنجیره پشتیبان چندمدله برای اطمینان از پاسخ بدون اختلال</span>
                <span className="text-[#00e599]">یکپارچگی مستقیم با نرم‌افزارهای فروش</span>
              </div>
            </div>

            {/* ستون آمار و توضیحات */}
            <div className="flex flex-col gap-6 lg:col-span-4 lg:col-start-9 text-right">
              <p className="text-lg sm:text-xl text-neutral-300 leading-relaxed">
                <span className="text-white font-bold">۱۵ دقیقه زمان جست‌وجو</span> و پیام‌نگاری سنتی، به ۳ ثانیه بررسی و تأیید نهایی توسط کارشناس تبدیل می‌شود.
              </p>

              <ul className="flex flex-col gap-3 p-0 m-0 list-none text-xs sm:text-sm">
                <li className="text-neutral-500 text-xs font-bold">اتوماسیون هوشمند فروش</li>
                <li className="flex items-center gap-2.5 text-white font-medium">
                  <CheckIcon className="w-4 h-4 text-[#00e599] shrink-0" />
                  <span>تولید متن فارسی با لحن محترمانه و حرفه‌ای</span>
                </li>
                <li className="flex items-center gap-2.5 text-white font-medium">
                  <CheckIcon className="w-4 h-4 text-[#00e599] shrink-0" />
                  <span>انطباق پیام با ویژگی‌های ارزش‌آفرین محصول</span>
                </li>
                <li className="flex items-center gap-2.5 text-white font-medium">
                  <CheckIcon className="w-4 h-4 text-[#00e599] shrink-0" />
                  <span>ارسال مستقیم سرنخ به سامانه مدیریت مشتریان دیدار</span>
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
            ۰۸. کارت‌های بنتو: ویژگی‌های منتشرشده در رادار
        ======================================================== */}
        <section id="shipped" className="py-24 px-4 sm:px-6 max-w-[1240px] mx-auto border-t border-[#141414]">
          <div className="flex flex-col items-center justify-center text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight flex flex-wrap justify-center text-center mb-3">
              ویژگی‌های توسعه‌یافته در رادار
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 text-center max-w-xl mx-auto leading-relaxed">
              نوآوری‌های اختصاصی PriCoders برای تضمین امنیت، حفظ حریم داده‌ها و بالاترین سرعت پایش بازار.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 text-right">
            {/* کارت ۱: دستیار صوتی */}
            <div id="voice-orb" className="md:col-span-6 rounded-xl bg-[#090909] border border-[#1f1f1f] p-6 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#141414] border border-[#262626] text-xs text-neutral-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    <span>دستیار صوتی و هوشمند</span>
                  </div>
                  <span className="text-xs text-neutral-500">PriCoders</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">دستیار صوتی و هوشمند رادار</h3>
                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed mb-6">
                  بررسی صوتی لیدها، شنیدن خلاصه فرصت‌ها در حین انجام کارهای روزمره و پرسش صوتی درباره وضعیت پایپ‌لاین فروش.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-[#040404] border border-[#191919] flex items-center justify-center min-h-[170px] filter grayscale">
                <div className="scale-90">
                  <VoiceOrb colors={["#ffffff", "#888888", "#111111"] as const} />
                </div>
              </div>
            </div>

            {/* کارت ۲: امنیت و پردازش محلی */}
            <div id="architecture" className="md:col-span-6 rounded-xl bg-[#090909] border border-[#1f1f1f] p-6 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#141414] border border-[#262626] text-xs text-neutral-300">
                    <span>حریم خصوصی کامل</span>
                  </div>
                  <span className="text-xs text-neutral-500">پاکت‌بیس محلی</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">حفظ محرمانگی و ذخیره‌سازی محلی</h3>
                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed mb-6">
                  تمامی سرنخ‌ها، مکالمات و تنظیمات مشتری ایده‌آل روی سرور محلی ذخیره می‌شوند؛ هیچ داده‌ای به بیرون درز نمی‌کند.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#040404] border border-[#191919] text-xs text-neutral-300 space-y-2">
                <div className="flex items-center justify-between text-neutral-500 pb-2 border-b border-[#141414]">
                  <span>پایگاه داده داخلی و مستقل</span>
                  <span className="text-emerald-400">اتصال محلی و امن</span>
                </div>
                <div className="text-[11px] text-neutral-400 space-y-1">
                  <div>• سرعت فوق‌العاده با زمان پاسخ کمتر از ۲ میلی‌ثانیه</div>
                  <div>• رمزنگاری داده‌های محلی و بدون نیاز به کلاد خارجی</div>
                  <div>• امکان اجرای مستقل در زیرساخت‌های سازمانی</div>
                </div>
              </div>
            </div>

            {/* کارت ۳: محافظت عصبی */}
            <div className="md:col-span-4 rounded-xl bg-[#090909] border border-[#1f1f1f] p-5 shadow-xl">
              <div className="text-xs text-amber-400 mb-2 font-bold">سپرهای عصبی</div>
              <h4 className="text-base font-bold text-white mb-1.5">محافظت ضد تزریق پرامپت</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                پالایش هوشمند تلاش‌های فریبنده و نویزهای عمدی کاربران برای جلوگیری از پاسخ‌های ناخواسته.
              </p>
            </div>

            {/* کارت ۴: اقتصاد شفاف */}
            <div id="economics" className="md:col-span-4 rounded-xl bg-[#090909] border border-[#1f1f1f] p-5 shadow-xl">
              <div className="text-xs text-emerald-400 mb-2 font-bold">اقتصاد هوش مصنوعی</div>
              <h4 className="text-base font-bold text-white mb-1.5">اقتصاد شفاف و بهینه</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                هزینه میانگین ۹ تومان برای هر پیام تحلیل‌شده؛ بیش از ۹۹٪ صرفه‌جویی نسبت به پیمایش دستی.
              </p>
            </div>

            {/* کارت ۵: پردازش زبان بومی */}
            <div className="md:col-span-4 rounded-xl bg-[#090909] border border-[#1f1f1f] p-5 shadow-xl">
              <div className="text-xs text-sky-400 mb-2 font-bold">پردازش زبان بومی</div>
              <h4 className="text-base font-bold text-white mb-1.5">درک اصطلاحات فارسی</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                شناسایی ظرایف زبانی، لحن عامیانه و اصطلاحات اختصاری پیام‌رسان‌ها با مدل بومی زبان فارسی.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================
            ۰۹. بخش اختصاصی مدل تجاری و قیمت‌گذاری (Business Model & Pricing)
            B2B SaaS + Usage-Based Pricing بر مبنای ارزش واقعی و مصرف هوشمند
        ======================================================== */}
        <section id="pricing" className="py-28 px-4 sm:px-6 max-w-[1380px] mx-auto border-t border-[#141414]">
          {/* سربرگ بخش قیمت‌گذاری */}
          <div className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#111111] border border-[#242424] text-xs text-neutral-300 mb-4 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#00e599] animate-pulse" />
              <span>مدل اشتراک مبتنی بر مصرف هوشمند</span>
            </div>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight flex flex-wrap justify-center text-center mb-4 text-balance">
              سرمایه‌گذاری بر پایه کشف فرصت، نه اشتراک صوری
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-neutral-400 text-center max-w-2xl mx-auto leading-relaxed text-balance">
              مشتریان رادار متناسب با میزان هوشمندی و کشف فرصت‌هایی که مصرف می‌کنند پرداخت انجام می‌دهند؛ رادار ابزاری برای خلق مستقیم درآمد است.
            </p>

            {/* سوئیچ پرداخت ماهانه / سالانه */}
            <div className="mt-8 p-1.5 rounded-xl bg-[#0c0c0c] border border-[#222222] inline-flex items-center gap-1.5 shadow-inner">
              <button
                type="button"
                onClick={() => setBillingCycle("monthly")}
                className={`px-5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  billingCycle === "monthly"
                    ? "bg-[#222222] text-white shadow-sm"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                پرداخت ماهانه
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle("annual")}
                className={`px-5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                  billingCycle === "annual"
                    ? "bg-[#222222] text-white shadow-sm"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                <span>پرداخت سالانه</span>
                <span className="px-2 py-0.5 rounded-md bg-[#00e599]/15 text-[#00e599] text-[11px] font-bold border border-[#00e599]/30">
                  ۲۰٪ تخفیف
                </span>
              </button>
            </div>
          </div>

          {/* کارت‌های قیمت‌گذاری: استارتر (فعال) و رشد (شیشه‌ای شفاف و مینیمال با نشان متقارن به‌زودی) */}
          <div className="grid grid-cols-1 md:grid-cols-2 max-w-[940px] mx-auto gap-6 sm:gap-7 mb-16 text-right items-stretch justify-center">
            {PRICING_PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 min-h-[540px] overflow-hidden ${
                  plan.isUpcoming
                    ? "backdrop-blur-xl bg-white/[0.03] border border-white/10 hover:border-white/20 shadow-[0_8px_30px_rgb(0,0,0,0.35)]"
                    : "bg-[#0d0d0d] border border-[#00e599]/60 shadow-[0_0_35px_rgba(0,229,153,0.12)] hover:border-[#00e599]"
                }`}
              >
                {/* های‌لایت شیدری ملایم لبه بالای کارت شیشه‌ای رشد */}
                {plan.isUpcoming && (
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />
                )}

                {/* برچسب متقارن بالای کارت */}
                {plan.isUpcoming ? (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <span className="px-3.5 py-1 rounded-full bg-[#161616] border border-[#2e2e2e] text-neutral-300 text-xs font-semibold shadow-md flex items-center gap-1.5 whitespace-nowrap">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                      <span>به‌زودی</span>
                    </span>
                  </div>
                ) : (
                  plan.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                      <span className="px-3.5 py-1 rounded-full bg-[#00e599] text-black text-xs font-bold shadow-md flex items-center gap-1.5 whitespace-nowrap">
                        <SparklesIcon className="w-3.5 h-3.5 text-black" />
                        <span>{plan.badge}</span>
                      </span>
                    </div>
                  )
                )}

                {/* محتوای داخلی کارت */}
                <div>
                  {/* سربرگ کارت در مرکز */}
                  <div className="text-center mb-5">
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-1.5">{plan.name}</h3>
                    <p className="text-xs text-neutral-400 leading-relaxed min-h-[34px] max-w-sm mx-auto">
                      {plan.audience}
                    </p>
                  </div>

                  {/* قیمت پلن در مرکز */}
                  <div className="text-center pb-5 mb-5 border-b border-[#1c1c1c] flex flex-col items-center">
                    <div className="flex items-baseline justify-center gap-1.5">
                      <span className="text-2xl sm:text-3xl font-extrabold text-white">
                        {billingCycle === "annual" ? plan.annualEquivalentMonthly : plan.monthlyPrice}
                      </span>
                      <span className="text-xs text-neutral-400">/ ماه</span>
                    </div>
                    {billingCycle === "annual" && (
                      <div className="text-[11px] text-emerald-400 mt-1 font-medium">
                        صورت‌حساب سالانه با ۲۰٪ صرفه‌جویی
                      </div>
                    )}
                    <div className="mt-2.5 inline-block px-3 py-1 rounded-md bg-[#141414] border border-[#242424] text-[11px] font-mono text-neutral-300">
                      {plan.messageLimit}
                    </div>
                  </div>

                  {/* لیست امکانات با عنوان اختصاصی هر پلن */}
                  <div className="space-y-2.5 mb-6 max-w-md mx-auto w-full">
                    <div className="text-xs font-bold text-neutral-400 mb-2">
                      {plan.featuresHeader}
                    </div>
                    {plan.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-neutral-300 leading-relaxed">
                        <CheckIcon className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${plan.isUpcoming ? "text-neutral-500" : "text-[#00e599]"}`} />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* دکمه عملیاتی پلن در پایین کارت */}
                <div className="w-full max-w-md mx-auto mt-2">
                  {plan.isUpcoming ? (
                    <div className="w-full h-11 rounded-xl text-xs sm:text-sm font-medium bg-[#141414] text-neutral-400 border border-[#242424] flex items-center justify-center select-none cursor-default shadow-inner">
                      <span>{plan.ctaText}</span>
                    </div>
                  ) : (
                    <Link
                      href={plan.ctaLink}
                      className="w-full h-11 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 shadow-md bg-white text-black hover:bg-neutral-200 shadow-[0_0_20px_rgba(255,255,255,0.25)]"
                    >
                      <span>{plan.ctaText}</span>
                      <span>←</span>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* ========================================================
              بخش ارزش تجاری و بازگشت سرمایه (Business Value Formula)
          ======================================================== */}
          <div className="rounded-2xl bg-[#090909] border border-[#1f1f1f] p-8 sm:p-10 mb-14 shadow-2xl text-center">
            <div className="max-w-3xl mx-auto mb-8">
              <span className="text-xs sm:text-sm text-[#00e599] font-bold tracking-wider uppercase mb-1.5 block">
                زنجیره خلق ارزش تجاری رادار
              </span>
              <h3 className="text-xl sm:text-3xl font-black text-white mb-2.5">
                زمان کمتر برای جست‌وجو، زمان بیشتر برای بستن قرارداد
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed max-w-xl mx-auto">
                مدل درآمدی رادار مستقیماً بر مبنای بازدهی مالی تیم فروش طراحی شده است:
              </p>
            </div>

            {/* زنجیره ارزش پیوسته (باکس‌های بزرگ‌تر) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 text-right">
              <div className="p-5 sm:p-6 rounded-xl bg-[#0e0e0e] border border-[#1c1c1c] space-y-2">
                <div className="text-xs text-neutral-500 font-medium">۰۱. پایش پیام‌ها</div>
                <div className="text-sm sm:text-base font-bold text-white">غربالگری مکالمات</div>
                <p className="text-xs text-neutral-400 leading-relaxed">جمع‌آوری مداوم پیام‌های جوامع بله، تلگرام و فروم‌ها</p>
              </div>
              <div className="p-5 sm:p-6 rounded-xl bg-[#0e0e0e] border border-[#1c1c1c] space-y-2">
                <div className="text-xs text-neutral-500 font-medium">۰۲. استخراج فرصت</div>
                <div className="text-sm sm:text-base font-bold text-emerald-400">حذف ۹۸٪ نویز</div>
                <p className="text-xs text-neutral-400 leading-relaxed">کشف سیگنال‌های واقعی خرید از میان شلوغی گفت‌وگوها</p>
              </div>
              <div className="p-5 sm:p-6 rounded-xl bg-[#0e0e0e] border border-[#1c1c1c] space-y-2">
                <div className="text-xs text-neutral-500 font-medium">۰۳. اعتبارسنجی نیت</div>
                <div className="text-sm sm:text-base font-bold text-sky-400">استخراج بودجه و فوریت</div>
                <p className="text-xs text-neutral-400 leading-relaxed">تفکیک خریداران قطعی و آماده‌سازی پیشنهاد متناسب</p>
              </div>
              <div className="p-5 sm:p-6 rounded-xl bg-[#0e0e0e] border border-[#1c1c1c] space-y-2">
                <div className="text-xs text-neutral-500 font-medium">۰۴. بستن معامله</div>
                <div className="text-sm sm:text-base font-bold text-amber-400">درآمد مستقیم</div>
                <p className="text-xs text-neutral-400 leading-relaxed">ارسال پاسخ اختصاصی در ۳ ثانیه و هدایت لید به سامانه فروش</p>
              </div>
            </div>
          </div>

          {/* ========================================================
              تجسم شفافیت مصرف هوش مصنوعی (Usage Transparency Widget)
          ======================================================== */}
          <div className="rounded-2xl bg-[#090909] border border-[#1f1f1f] p-8 sm:p-10 mb-14 shadow-2xl text-right">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 mb-5 border-b border-[#1a1a1a]">
              <div>
                <div className="text-base sm:text-lg font-bold text-white flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#00e599] animate-pulse" />
                  <span>پنل شفافیت مصرف ماهانه (نمونه زنده سازمان)</span>
                </div>
                <div className="text-xs sm:text-sm text-neutral-400 mt-1">
                  پلن فعال: استارتر • پایش و غربالگری هوشمند پیام‌ها
                </div>
              </div>
              <span className="text-xs px-3 py-1.5 rounded-lg bg-[#141414] text-neutral-300 border border-[#252525] font-medium">
                ۱۴ روز تا تمدید دوره
              </span>
            </div>

            {/* نوار بصری پیشرفت مصرف */}
            <div className="space-y-2.5 mb-7">
              <div className="flex justify-between text-xs sm:text-sm text-neutral-400">
                <span>مصرف ظرفیت پیام‌ها: ۶,۸۴۰ از ۱۰,۰۰۰ پیام</span>
                <span className="font-bold text-white font-mono">۶۸.۴٪</span>
              </div>
              <div className="w-full h-3.5 rounded-full bg-[#161616] overflow-hidden p-0.5 border border-[#262626]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-[#00e599] transition-all duration-500 shadow-[0_0_12px_rgba(0,229,153,0.4)]"
                  style={{ width: "68.4%" }}
                />
              </div>
            </div>

            {/* کارت‌های شاخص شفافیت مصرف (بزرگ‌تر) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="p-4 sm:p-5 rounded-xl bg-[#0e0e0e] border border-[#1b1b1b]">
                <div className="text-neutral-500 text-xs">پیام‌های پایش‌شده:</div>
                <div className="text-base sm:text-lg font-black text-white mt-1.5">۶,۸۴۰ پیام</div>
              </div>
              <div className="p-4 sm:p-5 rounded-xl bg-[#0e0e0e] border border-[#1b1b1b]">
                <div className="text-neutral-500 text-xs">فرصت‌های باکیفیت کشف‌شده:</div>
                <div className="text-base sm:text-lg font-black text-[#00e599] mt-1.5">۱۸۴ سرنخ معتبر</div>
              </div>
              <div className="p-4 sm:p-5 rounded-xl bg-[#0e0e0e] border border-[#1b1b1b]">
                <div className="text-neutral-500 text-xs">میانگین هزینه هر تحلیل:</div>
                <div className="text-base sm:text-lg font-black text-sky-400 mt-1.5">۹ تومان</div>
              </div>
              <div className="p-4 sm:p-5 rounded-xl bg-[#0e0e0e] border border-[#1b1b1b]">
                <div className="text-neutral-500 text-xs">اعتبار باقی‌مانده دوره:</div>
                <div className="text-base sm:text-lg font-black text-neutral-200 mt-1.5">۳,۱۶۰ پیام</div>
              </div>
            </div>
          </div>

          {/* ========================================================
              منطق ارتقای پلن‌ها (Value-Based Upgrade Logic)
          ======================================================== */}
          <div className="rounded-2xl bg-[#090909] border border-[#1f1f1f] p-8 sm:p-10 mb-14 shadow-2xl text-right">
            <h3 className="text-lg sm:text-xl font-black text-white mb-2">
              مسیر ارتقا و توسعه پلتفرم رادار
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 mb-7 leading-relaxed">
              قابلیت‌های پلتفرم همگام با افزایش نیازهای داده‌ای و عملیاتی تیم‌های فروش گسترش می‌یابد:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
              {/* ارتقا ۱: استارتر */}
              <div className="p-5 sm:p-6 rounded-xl bg-[#0d0d0d] border border-[#1c1c1c] space-y-2.5">
                <div className="font-bold text-white flex items-center justify-between pb-2 border-b border-[#181818] text-sm">
                  <span>پلن استارتر (هم‌اکنون فعال)</span>
                  <span className="text-[#00e599] text-xs font-bold">کشف مستقیم فرصت‌ها</span>
                </div>
                <p className="text-neutral-400 leading-relaxed text-xs sm:text-[13px]">
                  تمام امکانات کلیدی عملیاتی: غربالگری مداوم پیام‌های پیام‌رسان‌ها، تشخیص دقیق نیت خرید، انطباق با محصول، رتبه‌بندی فرصت‌ها و تولید پاسخ‌های پیشنهادی برای مذاکره فوری.
                </p>
              </div>

              {/* ارتقا ۲: رشد */}
              <div className="p-5 sm:p-6 rounded-xl bg-[#0d0d0d] border border-[#1c1c1c] space-y-2.5">
                <div className="font-bold text-white flex items-center justify-between pb-2 border-b border-[#181818] text-sm">
                  <span>پلن رشد (به‌زودی)</span>
                  <span className="text-amber-400 text-xs font-bold">اتصال و مقیاس‌پذیری</span>
                </div>
                <p className="text-neutral-400 leading-relaxed text-xs sm:text-[13px]">
                  افزایش سقف پیام‌ها به ۵۰,۰۰۰ پیام ماهانه، اتصال مستقیم به سامانه‌های مدیریت ارتباط با مشتریان، پایش همزمان چندین کانال و کاربری چندنفره برای تیم‌های فروش.
                </p>
              </div>
            </div>
          </div>

          {/* ========================================================
              جدول مقایسه جامع قابلیت‌های پلن‌ها (Feature Comparison Table)
          ======================================================== */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => setShowTable(!showTable)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#111111] hover:bg-[#1a1a1a] border border-[#242424] hover:border-neutral-500 text-xs text-white font-medium transition-all cursor-pointer mb-6 active:scale-95"
            >
              <span>{showTable ? "بستن جدول مقایسه کامل" : "مشاهده جدول مقایسه دقیق قابلیت‌ها"}</span>
              <svg
                viewBox="0 0 16 16"
                className={`w-3.5 h-3.5 transition-transform duration-200 ${showTable ? "rotate-180" : ""}`}
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="m12.06 6.75-.53.53-2.82 2.82a1 1 0 0 1-1.42 0L4.47 7.28l-.53-.53L5 5.69l.53.53L8 8.69l2.47-2.47.53-.53z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {showTable && (
              <div className="rounded-2xl bg-[#090909] border border-[#1f1f1f] overflow-x-auto shadow-2xl animate-card-in text-right">
                <table className="w-full text-xs sm:text-[13px] text-neutral-300">
                  <thead>
                    <tr className="border-b border-[#1f1f1f] bg-[#0e0e0e] text-neutral-400 font-bold">
                      <th className="p-4 sm:p-5 text-right font-bold text-white">قابلیت کلیدی</th>
                      <th className="p-4 sm:p-5 text-center text-[#00e599]">استارتر (فعال)</th>
                      <th className="p-4 sm:p-5 text-center text-amber-400">رشد (به‌زودی)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {COMPARISON_DIMENSIONS.map((row, i) => (
                      <tr
                        key={i}
                        className={`border-b border-[#161616] transition-colors hover:bg-[#0f0f0f] ${
                          i % 2 === 0 ? "bg-[#090909]" : "bg-[#060606]"
                        }`}
                      >
                        <td className="p-4 sm:p-5 font-semibold text-white">{row.label}</td>
                        <td className="p-4 sm:p-5 text-center text-emerald-300 font-bold">{row.starter}</td>
                        <td className="p-4 sm:p-5 text-center text-neutral-300">{row.growth}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        {/* ========================================================
            ۱۰. بخش فراخوان نهایی (کارت‌های گرد شده و متوازن)
        ======================================================== */}
        <section className="relative py-28 px-4 sm:px-6 max-w-[1240px] mx-auto text-center border-t border-[#141414] overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight mb-6">
              آماده‌اید اولین سیگنال واقعی را شکار کنید؟
            </h2>
            <p className="text-sm sm:text-base text-neutral-400 leading-relaxed mb-10 text-balance">
              گفت‌وگوهای پراکنده پیام‌رسان‌ها را به جریان مستمر و باکیفیت فرصت‌های فروش سازمانتان تبدیل نمایید.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Link
                href="/dashboard"
                className="w-full sm:w-auto h-12 px-8 rounded-xl font-bold text-sm bg-white text-black hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(255,255,255,0.3)] active:scale-95 cursor-pointer"
              >
                <SparklesIcon className="w-4 h-4 text-black" />
                <span>ورود به کنسول رادار</span>
                <span className="text-black">←</span>
              </Link>
              <Link
                href="/settings"
                className="w-full sm:w-auto h-12 px-7 rounded-xl font-medium text-sm bg-[#0d0d0d] hover:bg-[#171717] text-white border border-[#2b2b2b] hover:border-neutral-500 transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
              >
                <span>شخصی‌سازی کلمات و تنظیمات</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ========================================================
          ۱۱. فوتر در موقعیت ثابت (Fixed Position Footer Bar)
          شامل لوگوی بازگشته رادار، وضعیت سامانه‌ها و نشان PriCoders
      ======================================================== */}
      <footer className="fixed bottom-0 inset-x-0 z-40 border-t border-[#1a1a1a] bg-black/95 backdrop-blur-md px-4 sm:px-8 py-3 text-xs text-neutral-400 shadow-2xl">
        <div className="max-w-[1240px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-right">
          {/* سمت راست: لوگوی رادار و نام PriCoders */}
          <div className="flex items-center gap-2.5">
            <RadarBadge className="w-5 h-5 rounded-md" iconClassName="w-3.5 h-3.5 text-black" />
            <span className="text-neutral-200 font-semibold">رادار</span>
            <span className="text-neutral-600">•</span>
            <span className="text-neutral-400">موتور هوشمندی فرصت‌های فروش</span>
            <span className="text-neutral-600">•</span>
            <span className="text-neutral-300 font-medium font-mono text-[11px]">PriCoders</span>
          </div>

          {/* وسط: پیوندهای دسترسی سریع */}
          <div className="hidden md:flex items-center gap-4 text-[11px] text-neutral-400">
            <Link href="/dashboard" className="hover:text-white transition-colors">
              پایش لیدها
            </Link>
            <span className="text-neutral-700">|</span>
            <a href="#pricing" className="hover:text-white transition-colors">
              قیمت‌گذاری
            </a>
            <span className="text-neutral-700">|</span>
            <a href="#deep-dive-2" className="hover:text-white transition-colors">
              ماتریس نیت
            </a>
            <span className="text-neutral-700">|</span>
            <a href="#voice-orb" className="hover:text-white transition-colors">
              دستیار صوتی
            </a>
            <span className="text-neutral-700">|</span>
            <Link href="/settings" className="hover:text-white transition-colors">
              تنظیمات
            </Link>
          </div>

          {/* سمت چپ: وضعیت زنده سامانه‌ها */}
          <div className="flex items-center gap-2 text-emerald-400 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>تمامی سامانه‌ها فعال و متصل به دیتابیس محلی</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
