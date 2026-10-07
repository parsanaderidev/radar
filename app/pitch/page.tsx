"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  RadarLogo,
  PlayIcon,
  SparklesIcon,
  BaleIcon,
  TelegramIcon,
  TwitterXIcon,
  ForumIcon,
  CheckCircle2Icon,
  FlameIcon,
} from "@/components/Icons";

interface SlideData {
  id: number;
  tag: string;
  title: string;
  subtitle: string;
  content: React.ReactNode;
}

export default function PitchDeckPage() {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const slides: SlideData[] = [
    // 01 - THE PROBLEM
    {
      id: 1,
      tag: "۰۱ — مسئله (THE PROBLEM)",
      title: "مسئله حجم داده‌ها نیست؛ مسئله پنهان بودن فرصت‌ها در دل پارازیت است.",
      subtitle: "هر روز هزاران گفت‌وگو درباره نیازها و مشکلات در جوامع آنلاین شکل می‌گیرد.",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-[#0e0e0e] border border-[#222222]">
              <div className="text-xs font-bold text-neutral-400 mb-2">پیام‌های واقعی خریداران:</div>
              <p className="text-sm text-neutral-200 leading-relaxed italic">
                «برای اتوماسیون پیگیری لیدها چه نرم‌افزاری پیشنهاد می‌کنید؟»
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-[#0e0e0e] border border-[#222222]">
              <div className="text-xs font-bold text-neutral-400 mb-2">پیام‌های مقایسه‌ای:</div>
              <p className="text-sm text-neutral-200 leading-relaxed italic">
                «کسی با سرویس CRM ابری کار کرده؟ راضی هستید یا جایگزین داخلی داره؟»
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-[#0e0e0e] border border-[#222222]">
              <div className="text-xs font-bold text-neutral-400 mb-2">اعلام نیاز تیمی:</div>
              <p className="text-sm text-neutral-200 leading-relaxed italic">
                «تیم ما داره دنبال یک راهکار برای جمع‌آوری سرنخ‌ها از پیام‌رسان‌ها می‌گرده.»
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-rose-950/20 border border-rose-900/40 text-neutral-300">
            <div className="font-bold text-rose-400 mb-2 text-sm">چرا روش‌های دستی شکست می‌خورند؟</div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs leading-relaxed text-neutral-300">
              <li>• خواندن حجم وحشتناک محتوای نامرتبط و اسپم (اتلاف وقت تیم SDR)</li>
              <li>• عدم توانایی در درک بافت مکالمه با جستجوی ساده کلمات کلیدی</li>
              <li>• عدم امکان تشخیص سوالات گذرا از قصد واقعی و فوری خرید</li>
              <li>• فرصت‌سوزی: از دست رفتن سرنخ‌هایی که ظرف چند ساعت به رقیب می‌رسند</li>
            </ul>
          </div>
        </div>
      ),
    },

    // 02 - THE INSIGHT
    {
      id: 2,
      tag: "۰۲ — بینش کلیدی (THE INSIGHT)",
      title: "یک پیام به تنهایی کافی نیست؛ رادار مکالمات را می‌فهمد نه فقط کلمات را.",
      subtitle: "انتقال از دسته‌بندی سطحی کلمات به درک عمیق بافت و نیت تجاری",
      content: (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-gradient-to-l from-[#111111] to-[#0a0a0a] border border-[#262626]">
            <blockquote className="text-lg md:text-xl font-bold text-white leading-relaxed mb-4 border-r-4 border-[#00e599] pr-4">
              «به جای دسته‌بندی ساده و ماشینی پیام‌ها، رادار گفت‌وگوها را می‌فهمد: درد کجاست، نیاز چیست، و آیا محصول ما راه‌حل آن است؟»
            </blockquote>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-[#0d0d0d] border border-[#222222]">
              <div className="text-xs font-bold text-neutral-400 mb-3">آنچه رادار عمیقاً تحلیل می‌کند:</div>
              <div className="space-y-2 text-xs text-neutral-300 leading-relaxed">
                <div>• <strong>نیاز واقعی:</strong> کاربر در عمل با چه چالش عملیاتی مواجه است؟</div>
                <div>• <strong>بافت مکالمه:</strong> پیام‌های قبلی و بعدی چه سرنخ‌هایی می‌دهند؟</div>
                <div>• <strong>تناسب محصول:</strong> آیا محصول ما پاسخ این چالش را دارد؟</div>
              </div>
            </div>
            <div className="p-5 rounded-2xl bg-[#0d0d0d] border border-[#222222]">
              <div className="text-xs font-bold text-neutral-400 mb-3">تصمیم‌گیری برای تیم فروش:</div>
              <div className="space-y-2 text-xs text-neutral-300 leading-relaxed">
                <div>• <strong>ارزش فرصت:</strong> آیا این لید ارزش وقت کارشناس فروش را دارد؟</div>
                <div>• <strong>فوریت پیگیری:</strong> چقدر سریع باید پاسخ داد؟</div>
                <div>• <strong>پیشنهاد متن:</strong> بهترین نقطه ورود برای شروع گفتگو چیست؟</div>
              </div>
            </div>
          </div>
        </div>
      ),
    },

    // 03 - THE SOLUTION
    {
      id: 3,
      tag: "۰۳ — راه‌حل (THE SOLUTION)",
      title: "رادار: موتور هوشمندی فرصت برای کشف و اولویت‌بندی مشتریان",
      subtitle: "سامانه هوشمند کشف سیگنال خرید در میان گفت‌وگوهای جوامع آنلاین",
      content: (
        <div className="space-y-5">
          <div className="p-4 rounded-xl bg-[#0c1610] border border-[#1d3d27] text-xs text-[#00e599] font-medium">
            تغییر بنیادین: تبدیل هزاران پیام خام به تعداد انگشت‌شماری فرصت عملیاتی و آماده مذاکره.
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center">
            <div className="p-4 rounded-xl bg-[#0e0e0e] border border-[#222222]">
              <div className="text-xs text-neutral-400 mb-1">۱. نمره نیت</div>
              <div className="text-sm font-bold text-white font-mono">Intent Score</div>
            </div>
            <div className="p-4 rounded-xl bg-[#0e0e0e] border border-[#222222]">
              <div className="text-xs text-neutral-400 mb-1">۲. نوع نیت</div>
              <div className="text-sm font-bold text-white font-mono">Intent Type</div>
            </div>
            <div className="p-4 rounded-xl bg-[#0e0e0e] border border-[#222222]">
              <div className="text-xs text-neutral-400 mb-1">۳. استدلال هوش</div>
              <div className="text-sm font-bold text-white font-mono">Reasoning</div>
            </div>
            <div className="p-4 rounded-xl bg-[#0e0e0e] border border-[#222222]">
              <div className="text-xs text-neutral-400 mb-1">۴. تطابق محصول</div>
              <div className="text-sm font-bold text-white font-mono">ICP Match</div>
            </div>
            <div className="p-4 rounded-xl bg-[#0e0e0e] border border-[#222222]">
              <div className="text-xs text-neutral-400 mb-1">۵. متن پیشنهادی</div>
              <div className="text-sm font-bold text-white font-mono">Reply Draft</div>
            </div>
            <div className="p-4 rounded-xl bg-[#0e0e0e] border border-[#222222]">
              <div className="text-xs text-neutral-400 mb-1">۶. هزینه تحلیل</div>
              <div className="text-sm font-bold text-[#00e599] font-mono">Token Cost</div>
            </div>
          </div>
        </div>
      ),
    },

    // 04 - HOW RADAR WORKS
    {
      id: 4,
      tag: "۰۴ — نحوه کارکرد (HOW RADAR WORKS)",
      title: "خط لوله ۵ مرحله‌ای: از داده خام تا اقدام فروش",
      subtitle: "معماری سرتاسری هوشمندی داده به جای یک پوسته ساده چت",
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3.5">
          <div className="p-4.5 rounded-2xl bg-[#0c0c0c] border border-[#1e1e1e]">
            <div className="text-xs font-mono font-bold text-neutral-500 mb-2">01 / COLLECT</div>
            <div className="text-sm font-bold text-white mb-2">جمع‌آوری</div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              دریافت پیام‌ها از بله، تلگرام، توییتر/X و انجمن‌های ایرانی.
            </p>
          </div>
          <div className="p-4.5 rounded-2xl bg-[#0c0c0c] border border-[#1e1e1e]">
            <div className="text-xs font-mono font-bold text-sky-400 mb-2">02 / UNDERSTAND</div>
            <div className="text-sm font-bold text-white mb-2">درک بافت</div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              تحلیل معنایی پیام، تاریخچه و ادبیات گوینده با LLM.
            </p>
          </div>
          <div className="p-4.5 rounded-2xl bg-[#0c0c0c] border border-[#1e1e1e]">
            <div className="text-xs font-mono font-bold text-amber-400 mb-2">03 / SCORE</div>
            <div className="text-sm font-bold text-white mb-2">امتیازدهی</div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              محاسبه نمره ۰ تا ۱۰۰ شدت قصد خرید و تطابق با محصول.
            </p>
          </div>
          <div className="p-4.5 rounded-2xl bg-[#0c0c0c] border border-[#1e1e1e]">
            <div className="text-xs font-mono font-bold text-[#00e599] mb-2">04 / PRIORITIZE</div>
            <div className="text-sm font-bold text-white mb-2">اولویت‌بندی</div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              رتبه‌بندی فرصت‌ها برای تمرکز بر لیدهای داغ و فیلتر اسپم.
            </p>
          </div>
          <div className="p-4.5 rounded-2xl bg-[#0c0c0c] border border-[#1e1e1e]">
            <div className="text-xs font-mono font-bold text-purple-400 mb-2">05 / ACT</div>
            <div className="text-sm font-bold text-white mb-2">اقدام فروش</div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              ارائه پیش‌نویس پاسخ، استدلال و هزینه برای پیگیری سریع.
            </p>
          </div>
        </div>
      ),
    },

    // 05 - INTENT ENGINE
    {
      id: 5,
      tag: "۰۵ — موتور نیت‌سنجی (INTENT ENGINE)",
      title: "۴ سطح علمی قصد خرید در موتور رادار",
      subtitle: "دستیابی به بالاترین نرخ تبدیل با تمرکز بر سیگنال‌های پرپتانسیل",
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-[#0e1610] border border-[#1f3d28]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black text-[#00e599]">HIGH INTENT</span>
              <span className="text-xs font-mono font-bold text-[#00e599]">۷۵ – ۱۰۰</span>
            </div>
            <div className="text-xs text-neutral-300 leading-relaxed">
              سیگنال صریح نیاز و آمادگی خرید. اولویت شماره یک تیم فروش.
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#14120a] border border-[#3d2e14]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black text-amber-400">PROBLEM AWARE</span>
              <span className="text-xs font-mono font-bold text-amber-400">۴۵ – ۷۴</span>
            </div>
            <div className="text-xs text-neutral-300 leading-relaxed">
              کاربر چالش مشخصی دارد و آماده دریافت مشاوره و راه‌حل است.
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0b131a] border border-[#14283b]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black text-sky-400">CURIOUS</span>
              <span className="text-xs font-mono font-bold text-sky-400">۲۰ – ۴۴</span>
            </div>
            <div className="text-xs text-neutral-300 leading-relaxed">
              کنجکاوی یا پرسش کلی؛ پتانسیل بلندمدت برای آموزش و پرورش.
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0e0e0e] border border-[#222222]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black text-neutral-400">IRRELEVANT</span>
              <span className="text-xs font-mono font-bold text-neutral-400">۰ – ۱۹</span>
            </div>
            <div className="text-xs text-neutral-400 leading-relaxed">
              پیام‌های نامرتبط، احوالپرسی یا محتوای فاقد ارزش تجاری (حذف خودکار).
            </div>
          </div>
        </div>
      ),
    },

    // 06 - THE PRODUCT
    {
      id: 6,
      tag: "۰۶ — محصول (THE PRODUCT)",
      title: "داشبورد عملیاتی: کاهش زمان تصمیم‌گیری برای فروش",
      subtitle: "نه یک پلتفرم سنگین آمار، بلکه ابزاری سبک برای اقدام سریع",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-[#0c0c0c] border border-[#1f1f1f]">
            <div className="font-bold text-white text-sm mb-2">کشف فوری فرصت‌ها</div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              مشاهده آخرین لیدهای استخراج‌شده از پلتفرم‌ها به همراه امتیاز نیت و برچسب‌های اولویت.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-[#0c0c0c] border border-[#1f1f1f]">
            <div className="font-bold text-white text-sm mb-2">استدلال شفاف (Explainability)</div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              پاسخ به سوال «چرا رادار این پیام را یک فرصت می‌داند؟» با توضیح دقیق منطقی.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-[#0c0c0c] border border-[#1f1f1f]">
            <div className="font-bold text-white text-sm mb-2">پاسخ آماده با یک کلیک</div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              امکان کپی سریع متن مذاکره پیشنهادی برای ارتباط بدون فوت وقت با خریدار.
            </p>
          </div>
        </div>
      ),
    },

    // 07 - COST & QUALITY
    {
      id: 7,
      tag: "۰۷ — هزینه و کیفیت (COST & QUALITY)",
      title: "هزینه کشف یک فرصت فروش چقدر است؟ شفافیت کامل محاسبات.",
      subtitle: "بدون هزینه‌های پنهان یا برآوردهای اغراق‌آمیز",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="p-5 rounded-2xl bg-[#0d0d0d] border border-[#222222]">
              <div className="text-2xl font-black text-white font-mono mb-1">$0.00012</div>
              <div className="text-xs text-neutral-400">میانگین هزینه ارزیابی هر پیام (~۷ تومان)</div>
            </div>
            <div className="p-5 rounded-2xl bg-[#0d0d0d] border border-[#222222]">
              <div className="text-2xl font-black text-[#00e599] font-mono mb-1">کمتر از ۵۰۰ تومان</div>
              <div className="text-xs text-neutral-400">هزینه نهایی کشف ۱ سرنخ با نیت بالا</div>
            </div>
            <div className="p-5 rounded-2xl bg-[#0d0d0d] border border-[#222222]">
              <div className="text-2xl font-black text-sky-400 font-mono mb-1">۹۵٪ صرفه‌جویی</div>
              <div className="text-xs text-neutral-400">در مقایسه با هزینه ساعت کاری کارشناس فروش</div>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-[#121212] border border-[#262626] text-xs text-neutral-300">
            <strong>نکته مهم ارزیابی:</strong> تمامی اعداد از تست‌های واقعی MVP با نرخ توکن‌های فعلی به دست آمده و ادعای ساختگی در محاسبات وجود ندارد.
          </div>
        </div>
      ),
    },

    // 08 - WHY RADAR?
    {
      id: 8,
      tag: "۰۸ — چرا رادار؟ (WHY RADAR?)",
      title: "۴ مزیت رقابتی محوری رادار",
      subtitle: "بیشتر از یک چت‌بات؛ یک خط لوله اختصاصی برای بازارهای بومی",
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-[#0c0c0c] border border-[#1f1f1f]">
            <div className="font-bold text-[#00e599] text-sm mb-1.5">۱. زبان و بافت فارسی</div>
            <p className="text-xs text-neutral-300 leading-relaxed">
              درک ادبیات محاوره‌ای، اصطلاحات تجاری و جوامع محلی (بله، تلگرام و توییتر فارسی).
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-[#0c0c0c] border border-[#1f1f1f]">
            <div className="font-bold text-sky-400 text-sm mb-1.5">۲. هوشمندی نیت خرید</div>
            <p className="text-xs text-neutral-300 leading-relaxed">
              تشخیص قصد واقعی خرید به جای جست‌وجوی سطحی و پراشتباه کلمات کلیدی.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-[#0c0c0c] border border-[#1f1f1f]">
            <div className="font-bold text-purple-400 text-sm mb-1.5">۳. چرخه بسته اقدام (Closed-Loop)</div>
            <p className="text-xs text-neutral-300 leading-relaxed">
              از کشف پیام تا تحلیل، استدلال، انطباق محصول و پیشنهاد پاسخ در یک پلتفرم یکپارچه.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-[#0c0c0c] border border-[#1f1f1f]">
            <div className="font-bold text-amber-400 text-sm mb-1.5">۴. شفافیت و استقلال هزینه</div>
            <p className="text-xs text-neutral-300 leading-relaxed">
              نمایش هزینه پردازش برای هر پیام و امکان اتصال به موتورهای محلی آفلاین.
            </p>
          </div>
        </div>
      ),
    },

    // 09 - DEMO
    {
      id: 9,
      tag: "۰۹ — دموی زنده (THE DEMO)",
      title: "قلب ارائه: پیام خام → درک بافت → نیت → استدلال → اقدام فروش",
      subtitle: "مشاهده سناریوی زنده تبدیل یک پیام گروه به سرنخ تجاری",
      content: (
        <div className="space-y-6 text-center">
          <div className="p-6 rounded-2xl bg-[#0e0e0e] border border-[#242424] max-w-xl mx-auto text-right text-xs space-y-2">
            <div><strong>۱. پیام خام:</strong> «سلام، برای تیم فروشمون دنبال نرم‌افزار پیگیری لید با بودجه ۱۵ تومن هستیم...»</div>
            <div><strong>۲. تحلیل بافت:</strong> تشخیص نیاز عملیاتی و محدودیت زمانی</div>
            <div><strong>۳. نمره نیت:</strong> ۹۴٪ (High Intent)</div>
            <div><strong>۴. انطباق با محصول:</strong> سامانه استخراج هوشمند لید رادار</div>
            <div><strong>۵. پیش‌نویس پاسخ:</strong> آماده برای کپی و ارسال</div>
          </div>

          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 h-12 px-8 rounded-xl font-bold text-sm bg-white text-black hover:bg-neutral-200 transition-all shadow-[0_0_30px_rgba(255,255,255,0.3)] active:scale-95 cursor-pointer"
            >
              <PlayIcon className="w-4 h-4 text-black" />
              <span>مشاهده و تست دموی زنده در داشبورد رادار</span>
            </Link>
            <div className="text-xs text-neutral-500 mt-2">
              (کلیک کنید تا داشبورد عملیاتی به صورت زنده باز شود)
            </div>
          </div>
        </div>
      ),
    },

    // 10 - BUSINESS MODEL & FUTURE
    {
      id: 10,
      tag: "۱۰ — مدل تجاری و آینده (BUSINESS MODEL & ROADMAP)",
      title: "مدل B2B SaaS بر پایه مصرف + نقشه راه توسعه",
      subtitle: "تبدیل شدن به لایه هوشمندی فرصت برای تیم‌های فروش مدرن",
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="p-5 rounded-2xl bg-[#0c0c0c] border border-[#1f1f1f]">
            <div className="font-bold text-white text-sm mb-3">مدل درآمدی (B2B SaaS + Usage):</div>
            <ul className="space-y-2 text-xs text-neutral-300 leading-relaxed">
              <li>• آبونمان ماهانه بر اساس تعداد پلتفرم‌ها و کانال‌های پایش</li>
              <li>• مدل پلکانی بر مبنای حجم پیام‌های تحلیل‌شده ماهانه</li>
              <li>• پلن سازمانی سفارشی با استقرار On-Premise و مدل‌های اختصاصی</li>
            </ul>
          </div>
          <div className="p-5 rounded-2xl bg-[#0c0c0c] border border-[#1f1f1f]">
            <div className="font-bold text-sky-400 text-sm mb-3">نقشه راه توسعه (Roadmap):</div>
            <ul className="space-y-2 text-xs text-neutral-300 leading-relaxed">
              <li>• افزودن کراولرهای رسمی پلتفرم‌های بیشتر</li>
              <li>• اتصال دوطرفه به نرم‌افزارهای CRM (دیدار، هاب‌اسپات)</li>
              <li>• حافظه تاریخی رفتار کاربران و لیدها</li>
              <li>• مدل‌های اختصاصی نیت‌سنجی فارسی با هزینه کمتر</li>
            </ul>
          </div>
        </div>
      ),
    },

    // 11 - CLOSING
    {
      id: 11,
      tag: "۱۱ — جمع‌بندی (CLOSING)",
      title: "مردم از پیش نیازهایشان را در اینترنت می‌گویند؛ رادار آن‌ها را به فرصت تبدیل می‌کند.",
      subtitle: "رادار — از میان هیاهو تا فرصت فروش • PriCoders",
      content: (
        <div className="space-y-6 text-center max-w-xl mx-auto">
          <div className="p-8 rounded-3xl bg-[#0c0c0c] border border-[#242424]">
            <div className="w-16 h-16 rounded-2xl bg-white text-black flex items-center justify-center font-bold mx-auto mb-4 shadow-lg">
              <RadarLogo className="w-10 h-10 text-black" />
            </div>
            <h3 className="text-2xl font-black text-white mb-2">رادار (Radar)</h3>
            <div className="text-sm font-semibold text-neutral-400 mb-4">
              از میان هیاهو تا فرصت فروش
            </div>
            <div className="text-xs text-[#00e599] font-mono tracking-wider uppercase mb-6">
              DEVELOPED BY PRICODERS
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/"
                className="w-full sm:w-auto h-11 px-6 rounded-xl font-bold text-xs bg-white text-black hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>ورود به داشبورد رادار</span>
              </Link>
              <Link
                href="/landing"
                className="w-full sm:w-auto h-11 px-6 rounded-xl font-medium text-xs bg-[#161616] text-neutral-300 hover:text-white border border-[#282828] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>صفحه معرفی محصول</span>
              </Link>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const totalSlides = slides.length;

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev < totalSlides - 1 ? prev + 1 : prev));
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : prev));
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowDown" || e.key === " ") {
        nextSlide();
      } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
        prevSlide();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide]);

  const slide = slides[currentSlide];

  return (
    <div className="min-h-screen bg-[#000000] text-[#ededed] flex flex-col justify-between selection:bg-white selection:text-black">
      {/* Top Bar */}
      <header className="h-14 border-b border-[#181818] px-4 sm:px-6 flex items-center justify-between text-xs text-neutral-400 shrink-0 bg-[#060606]">
        <div className="flex items-center gap-3">
          <Link href="/landing" className="flex items-center gap-2 text-white hover:text-neutral-300 transition-colors">
            <div className="w-6 h-6 rounded bg-white text-black flex items-center justify-center font-bold">
              <RadarLogo className="w-3.5 h-3.5 text-black" />
            </div>
            <span className="font-bold text-sm">رادار</span>
          </Link>
          <span className="text-neutral-600">|</span>
          <span className="hidden sm:inline text-neutral-400 font-medium">ارائه رسمی محصول (Pitch Deck)</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-950/50 text-amber-300 border border-amber-800/50">
            PriCoders
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-mono text-neutral-400 text-xs">
            اسلاید {currentSlide + 1} از {totalSlides}
          </span>
          <Link
            href="/"
            className="h-8 px-3 rounded-lg bg-[#141414] hover:bg-[#1f1f1f] text-neutral-200 hover:text-white border border-[#2b2b2b] text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <PlayIcon className="w-3 h-3 text-[#00e599]" />
            <span>دموی داشبورد</span>
          </Link>
        </div>
      </header>

      {/* Main Slide Stage */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-10 max-w-5xl mx-auto w-full">
        <div className="w-full bg-[#070707] border border-[#1e1e1e] rounded-3xl p-6 sm:p-10 shadow-2xl animate-fade-in relative overflow-hidden">
          {/* Slide Tag */}
          <div className="text-xs font-semibold text-[#00e599] mb-3 tracking-wider">
            {slide.tag}
          </div>

          {/* Slide Title */}
          <h2 className="text-xl sm:text-3xl font-black text-white mb-3 leading-snug">
            {slide.title}
          </h2>

          {/* Slide Subtitle */}
          <p className="text-xs sm:text-sm text-neutral-400 mb-8 leading-relaxed">
            {slide.subtitle}
          </p>

          {/* Slide Content */}
          <div className="min-h-[220px] flex flex-col justify-center">
            {slide.content}
          </div>
        </div>
      </main>

      {/* Bottom Controls */}
      <footer className="h-16 border-t border-[#181818] px-4 sm:px-6 flex items-center justify-between shrink-0 bg-[#060606]">
        {/* Navigation buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className={`h-9 px-4 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
              currentSlide === 0
                ? "bg-[#0f0f0f] text-neutral-600 border-[#1c1c1c] cursor-not-allowed"
                : "bg-[#141414] hover:bg-[#202020] text-white border-[#2c2c2c]"
            }`}
          >
            → اسلاید قبلی
          </button>

          <button
            type="button"
            onClick={nextSlide}
            disabled={currentSlide === totalSlides - 1}
            className={`h-9 px-4 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
              currentSlide === totalSlides - 1
                ? "bg-[#0f0f0f] text-neutral-600 border-[#1c1c1c] cursor-not-allowed"
                : "bg-white text-black hover:bg-neutral-200 border-white shadow-sm"
            }`}
          >
            اسلاید بعدی ←
          </button>
        </div>

        {/* Slide Dots / Indicators */}
        <div className="hidden sm:flex items-center gap-1.5">
          {slides.map((s, index) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setCurrentSlide(index)}
              title={`اسلاید ${index + 1}: ${s.title}`}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                index === currentSlide
                  ? "w-6 bg-[#00e599]"
                  : "w-2 bg-neutral-700 hover:bg-neutral-500"
              }`}
            />
          ))}
        </div>

        {/* Keyboard Hint & Link */}
        <div className="flex items-center gap-3 text-xs text-neutral-500">
          <span className="hidden md:inline font-mono text-[11px]">
            راهنما: کلیدهای جهت‌نما کیبورد (← / →)
          </span>
          <Link href="/landing" className="text-neutral-400 hover:text-white transition-colors underline">
            صفحه فرود
          </Link>
        </div>
      </footer>
    </div>
  );
}
