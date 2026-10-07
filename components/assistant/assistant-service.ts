import { AssistantMessage, RadarAssistantContext } from "./types";

/**
 * Radar Assistant Service
 *
 * Isolated service layer for communicating with the Radar Assistant.
 * Tries the server-side API endpoint (/api/assistant) powered by LLM,
 * and seamlessly falls back to the resilient domestic domain engine
 * if the network or gateway is unavailable.
 */
export async function askRadarAssistant(
  message: string,
  context?: RadarAssistantContext
): Promise<AssistantMessage> {
  try {
    const res = await fetch("/api/assistant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, context }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.content) {
        return {
          id: data.id || `assistant-msg-${Date.now()}`,
          role: "assistant",
          content: data.content,
          timestamp: data.timestamp || Date.now(),
        };
      }
    }
  } catch {
    // Graceful fallback to domestic heuristic/domain engine
  }

  // Domain fallback engine
  return fallbackDomainAssistant(message, context);
}

/**
 * Domestic Domain Knowledge Fallback Engine
 */
async function fallbackDomainAssistant(
  message: string,
  context?: RadarAssistantContext
): Promise<AssistantMessage> {
  await new Promise((resolve) => setTimeout(resolve, 400));

  const trimmed = message.trim().toLowerCase();
  let responseText = "";

  // 1. What is Radar / رادار چیست
  if (
    trimmed.includes("رادار چیست") ||
    trimmed.includes("معرفی رادار") ||
    trimmed.includes("کار رادار") ||
    trimmed.includes("what is radar") ||
    trimmed.includes("about radar")
  ) {
    responseText = `**رادار (Radar)** یک پلتفرم هوشمند جهت تشخیص تمایل خرید (Buying Intent) و استخراج سرنخ‌های آماده فروش (Qualified Leads) از جوامع آنلاین ایرانی است.

این سامانه به صورت خودکار پیام‌های کاربران در پیام‌رسان‌ها (نظیر تلگرام، بله، توییتر/X و فروم‌های تخصصی) را رصد کرده و پیام‌هایی که نشانه نیاز جدی به خرید یا خدمات هستند را با هوش مصنوعی تریاژ و اولویت‌بندی می‌کند.`;
  }

  // 2. Intent Score / امتیاز نیت خرید
  else if (
    trimmed.includes("امتیاز نیت") ||
    trimmed.includes("نیت خرید") ||
    trimmed.includes("intent score") ||
    trimmed.includes("نحوه محاسبه") ||
    trimmed.includes("امتیازدهی") ||
    trimmed.includes("score")
  ) {
    responseText = `**امتیاز نیت خرید (Intent Score)** یک شاخص عددی بین ۱ تا ۱۰ است که توسط مدل زبانی هوش مصنوعی تعیین می‌شود:

• **۸ تا ۱۰ (سبز - نیت بالا):** کاربر نیازی مبرم دارد، به دنبال قیمت یا پیش‌فاکتور فوری است، یا تصمیمی قطعی برای خرید دارد.
• **۵ تا ۷ (آبی/زرد - نیت متوسط):** کاربر در حال مقایسه راه‌حل‌ها یا تحقیق اولیه درباره گزینه‌هاست.
• **زیر ۵ (خاکستری - نیت پایین یا نامرتبط):** صرفاً سوال عمومی، نظر شخصی یا پیام اسپم است و در اولویت فروش قرار نمی‌گیرد.`;
  }

  // 3. Sources / منابع
  else if (
    trimmed.includes("منبع") ||
    trimmed.includes("منابع") ||
    trimmed.includes("تلگرام") ||
    trimmed.includes("بله") ||
    trimmed.includes("توییتر") ||
    trimmed.includes("فروم") ||
    trimmed.includes("sources") ||
    trimmed.includes("where")
  ) {
    responseText = `سرنخ‌های رادار از پلتفرم‌های تعاملی و پرمخاطب فارسی استخراج می‌شوند:

• **تلگرام (Telegram):** گروه‌های صنفی، کانال‌های تخصصی کسب‌وکار و تبادل نظرهای تجاری
• **پیام‌رسان بله (Bale):** جوامع و کانال‌های رسمی و شبکه‌های مرتبط با امور مالی/کسب‌وکار
• **شبکه اجتماعی توییتر/ایکس (Twitter/X):** توییت‌ها و گفتگوهای حاوی درخواست راهنمایی یا معرفی ابزار
• **فروم‌ها و انجمن‌ها (Forums):** پرسش‌وپاسخ‌های تخصصی در انجمن‌های وب فارسی`;
  }

  // 4. Statuses / وضعیت‌های سرنخ
  else if (
    trimmed.includes("وضعیت") ||
    trimmed.includes("جدید") ||
    trimmed.includes("تماس") ||
    trimmed.includes("تبدیل") ||
    trimmed.includes("نادیده") ||
    trimmed.includes("status") ||
    trimmed.includes("lead status")
  ) {
    responseText = `در رادار هر سرنخ دارای یک چرخه وضعیت ۴ مرحله‌ای است:

۱. **جدید (New):** پیامی که تازه توسط هوش مصنوعی کشف و تریاژ شده و نیازمند بررسی تیم فروش است.
۲. **تماس گرفته شد (Contacted):** پاسخی به مشتری ارسال شده یا مکالمه در بستر اصلی آغاز شده است.
۳. **تبدیل شد (Converted):** مشتری به خریدار، جلسه دمو یا ثبت سفارش موفق تبدیل شده است.
۴. **نادیده گرفته شد (Ignored):** پیام خارج از جامعه هدف تشخیص داده شده یا به بایگانی منتقل شده است.`;
  }

  // 5. ICP / پرسونای مشتری و تنظیمات
  else if (
    trimmed.includes("icp") ||
    trimmed.includes("پرسونا") ||
    trimmed.includes("تنظیمات") ||
    trimmed.includes("کلیدواژه") ||
    trimmed.includes("settings")
  ) {
    responseText = `بخش **«تنظیمات محصول و پرسونای مشتری (ICP)»** مغز جهت‌دهنده هوش مصنوعی رادار است:

با ثبت نام محصول، مزیت‌های کلیدی رقابتی، شرح ویژگی‌ها و کلیدواژه‌های رصد در آن صفحه، هوش مصنوعی رادار پیام‌های ورودی را با این اطلاعات مقایسه می‌کند تا تشخیص دهد آیا کاربر دقیقاً مناسب محصول شما هست یا خیر و بر همان اساس پاسخ شخصی‌سازی‌شده پیشنهاد دهد.`;
  }

  // 6. Visible Leads / Workspace Data / داده‌های فضای کاری
  else if (
    trimmed.includes("چند سرنخ") ||
    trimmed.includes("داده") ||
    trimmed.includes("فضای کاری") ||
    trimmed.includes("workspace") ||
    trimmed.includes("how many") ||
    trimmed.includes("count")
  ) {
    const count = context?.totalLeadsCount ?? (Array.isArray(context?.leads) ? context.leads.length : 12);
    responseText = `در حال حاضر در فضای کاری شما **${count} سرنخ** فعال ثبت و تحلیل شده است.

این اطلاعات شامل متن اصلی پیام، آیدی فرستنده در شبکه مربوطه، برآورد هزینه استنتاج هوش مصنوعی (توکن)، امتیاز تفکیک‌شده نیت خرید، و پیش‌نویس پاسخ آماده برای تیم فروش می‌باشد.`;
  }

  // 7. General / Friendly Domain Fallback
  else {
    responseText = `من دستیار هوشمند اختصاصی رادار هستم. اطلاعات من منحصراً متمرکز بر داده‌ها، عملکردها و سرنخ‌های فضای کاری شما در رادار است:

• توضیح درباره **نحوه محاسبه امتیاز نیت خرید (Intent Score)**
• تحلیل **چرخه وضعیت سرنخ‌ها (جدید، تماس‌گرفته، تبدیل‌شده)**
• آشنایی با **منابع ورودی پیام‌ها (تلگرام، بله، توییتر، فروم‌ها)**
• راهنمای **تنظیمات پرسونای مشتری (ICP) و کلمات کلیدی**

می‌توانید هر یک از این موضوعات را بپرسید تا جزئیات آن را برایتان شرح دهم.`;
  }

  return {
    id: `assistant-msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    role: "assistant",
    content: responseText,
    timestamp: Date.now(),
  };
}
