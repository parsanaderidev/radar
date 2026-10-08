/**
 * Layer 0 (deterministic pre-filter) + Layer 1 (fast intent screen).
 *
 * Runs on pure CPU before any LLM call:
 *   Layer 0 — static rules, <1ms, zero tokens. Rejects greetings, ads,
 *             link-only spam, prompt-injection attempts.
 *   Layer 1 — cheap boolean screen: does this message carry any buying or
 *             pain signal worth a deep evaluation? No LLM involved, so the
 *             offline heuristic path stays fully functional.
 *
 * Zero external dependencies. Vanilla TypeScript.
 */

export type PrefilterVerdict = "pass" | "reject";

export interface PrefilterResult {
  verdict: PrefilterVerdict;
  /** Machine-readable reason code. */
  reason:
    | "ok"
    | "empty"
    | "too_short"
    | "advertisement"
    | "link_only"
    | "injection";
  /** Persian explanation, suitable for lead reasoning. */
  reasonFa: string;
}

export type ScreenCategory =
  | "buying_signal"
  | "pain_signal"
  | "keyword_match"
  | "general_question"
  | "none";

export interface ScreenResult {
  qualifies: boolean;
  category: Exclude<ScreenCategory, "none"> | "none";
  keywordHits: string[];
}

/** Minimum content length (chars) to survive Layer 0. Matches the documented spec. */
export const LAYER0_MIN_LENGTH = 12;

const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior)\s+instructions/i,
  /disregard\s+(the\s+)?system\s+prompt/i,
  /jailbreak/i,
  /prompt\s+injection/i,
  /reveal\s+(your\s+)?(system\s+prompt|instructions)/i,
  /print\s+(your\s+)?system\s+prompt/i,
  /output\s+high_intent/i,
  /بایپس|دور\s*زدن\s*سیستم/i,
];

const AD_PATTERNS = [
  /t\.me\//i,
  /instagram\.com/i,
  /عضویت\s*در\s*(گروه|کانال)/i,
  /کلیک\s*کن(ید|ید)?/i,
  /فروش\s*ویژه|تخفیف\s*ویژه|پیشنهاد\s*شگفت/i,
  /airdrop|ایردراپ/i,
  /سیگنال\s*(خرید|فروش|ارز)/i,
  /املاک|آپارتمان\s*.*\s*متری/i,
];

const PRICE_NOISE_PATTERNS = [
  /قیمت\s*(دلار|طلا|سکه|بیت‌کوین|تتر)/i,
  /نرخ\s*ارز/i,
];

const LINK_ONLY_PATTERN = /^(?:https?:\/\/\S+\s*)+$/i;

/**
 * Layer 0: deterministic reject/pass over raw text.
 * Never touches the network, never spends a token.
 */
export function prefilterMessage(content: string | null | undefined): PrefilterResult {
  const text = (content || "").trim();

  if (!text) {
    return { verdict: "reject", reason: "empty", reasonFa: "متن پیام خالی است." };
  }

  if (INJECTION_PATTERNS.some((re) => re.test(text))) {
    return {
      verdict: "reject",
      reason: "injection",
      reasonFa: "تلاش برای تزریق دستورات غیراستاندارد به سیستم شناسایی شد.",
    };
  }

  if (text.length < LAYER0_MIN_LENGTH) {
    return {
      verdict: "reject",
      reason: "too_short",
      reasonFa: "پیام بسیار کوتاه و فاقد محتوای تجاری قابل ارزیابی است.",
    };
  }

  if (LINK_ONLY_PATTERN.test(text)) {
    return {
      verdict: "reject",
      reason: "link_only",
      reasonFa: "پیام فقط شامل لینک و فاقد متن قابل ارزیابی است.",
    };
  }

  const isAd = AD_PATTERNS.some((re) => re.test(text));
  const isPriceNoise = PRICE_NOISE_PATTERNS.some((re) => re.test(text));
  if ((isAd || isPriceNoise) && text.length < 120) {
    return {
      verdict: "reject",
      reason: "advertisement",
      reasonFa: "پیام تبلیغاتی یا نامرتبط با حوزه کسب‌وکار تشخیص داده شد.",
    };
  }

  return { verdict: "pass", reason: "ok", reasonFa: "" };
}

// Lightweight buying / pain markers for Layer 1 (subset of the deep patterns,
// keyword-driven so they cost nothing to evaluate).
const BUYING_MARKERS = [
  /دنبال.*(نرم‌افزار|برنامه|ابزار|سامانه|سرویس|راهکار)/i,
  /(پیشنهاد|معرفی)\s*(کنید|کند|میدین|میدید|می‌دید|میدی|بدین|بدید|بده)/i,
  /(قیمت|هزینه|تعرفه|بودجه)/i,
  /(خرید|سفارش|لایسنس|اشتراک)/i,
  /جایگزین/i,
  /looking\s+for|recommend|pricing|how\s+much/i,
];

const PAIN_MARKERS = [
  /مودیان.*(مشکل|خطا|جریمه|کلافه|عذاب|دردسر)/i,
  /تحریم|مسدود|قطع\s*(شده|شد)/i,
  /اکسل.*(خسته|اشتباه|وقت‌گیر|دستی)/i,
  /(ارور|خطا)\s*میده/i,
  /پشتیبانی\s*ندار/i,
  /frustrat|blocked|sanction/i,
];

/**
 * Layer 1: fast boolean screen against the product's keywords plus generic
 * buying/pain markers. Returns whether Layer 2 (LLM/heuristic) is warranted.
 */
export function screenIntent(
  content: string,
  threadContext: string | undefined,
  keywords: string[] | undefined
): ScreenResult {
  const text = `${content || ""} ${threadContext || ""}`.toLowerCase();
  const keywordHits = (keywords || []).filter(
    (kw) => kw && text.includes(kw.toLowerCase())
  );

  if (BUYING_MARKERS.some((re) => re.test(text))) {
    return { qualifies: true, category: "buying_signal", keywordHits };
  }
  if (PAIN_MARKERS.some((re) => re.test(text))) {
    return { qualifies: true, category: "pain_signal", keywordHits };
  }
  if (keywordHits.length >= 2) {
    return { qualifies: true, category: "keyword_match", keywordHits };
  }
  if (keywordHits.length === 1 && text.length > 50) {
    return { qualifies: true, category: "keyword_match", keywordHits };
  }
  if (text.length > 40 && (text.includes("؟") || text.includes("?"))) {
    return { qualifies: true, category: "general_question", keywordHits };
  }
  return { qualifies: false, category: "none", keywordHits };
}

/**
 * Normalizes text for content-hash deduplication (Layer 0, 24h window).
 */
export function normalizeForHash(content: string): string {
  return (content || "")
    .toLowerCase()
    .replace(/[\u200c\u200d]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * SHA-256 hex of normalized content. Uses Web Crypto (Edge/Next compatible).
 */
export async function hashContent(content: string): Promise<string> {
  const bytes = new TextEncoder().encode(normalizeForHash(content));
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
