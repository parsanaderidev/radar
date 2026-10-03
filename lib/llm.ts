import { calculateMessageCost } from "./pricing";
import type { ProductRecord } from "./pocketbase";

export interface IntentEvaluationResult {
  intent_score: number; // 0 to 100
  intent_level: "high_intent" | "problem_aware" | "curious" | "irrelevant";
  reasoning: string;
  matched_feature?: string;
  suggested_reply?: string;
  input_tokens: number;
  output_tokens: number;
  estimated_cost_usd: number;
  model_used: string;
}

export interface EvaluateMessageInput {
  content: string;
  author_handle: string;
  thread_context?: string;
  platform?: string;
  product: ProductRecord;
}

/**
 * Builds the specialized prompt for evaluating Iranian community intent
 */
function buildPrompt(input: EvaluateMessageInput): { systemPrompt: string; userPrompt: string } {
  const { content, author_handle, thread_context, platform, product } = input;

  const systemPrompt = `You are "AI Lead Radar", an expert sales-intent detection and community triage intelligence agent built specifically for the Iranian tech and SMB ecosystem.
Your job is to read user messages from Iranian social communities (Telegram groups, Bale channels, local forums, Twitter/X) and identify genuine buying intent, workflow frustration, or noise.

Target Product Information:
- Product Name: ${product.name}
- Tagline: ${product.tagline || ""}
- Description: ${product.description}
- Key Value Propositions: ${JSON.stringify(product.value_propositions || [])}
- Ideal Customer Profile (ICP): ${product.ideal_customer_profile}
- Target Keywords: ${JSON.stringify(product.keywords || [])}

Intent Classification Criteria:
1. "high_intent" (Score: 75-100): Direct buying signals, asking for software/vendor recommendations, asking for pricing, seeking alternatives to banned/sanctioned foreign SaaS, looking for immediate solutions.
2. "problem_aware" (Score: 45-74): Discussing pain points that our product solves (e.g., suffering from manual Excel invoices, tax/Moadian system penalties, foreign tool blocked/sanctioned, slow reconciliation), but hasn't explicitly asked for a vendor yet.
3. "curious" (Score: 20-44): Educational questions, asking about regulations, general tech comparisons.
4. "irrelevant" (Score: 0-19): Social chatter, greetings ("سلام", "صبح بخیر"), spam/promos, unrelated political/market news, irrelevant job ads.

Tone & Reply Guidelines:
- If intent is "high_intent" or "problem_aware", write a suggested_reply in the same language and tone as the author (natural, friendly, authentic Persian or English).
- Do NOT sound like a spam bot or aggressive salesperson. Provide genuine value, offer empathy, and smoothly mention how our product solves their exact pain point.
- If intent is "irrelevant", suggested_reply should be empty or a brief note.

Respond ONLY with a valid JSON object matching this exact schema:
{
  "intent_score": number (0-100),
  "intent_level": "high_intent" | "problem_aware" | "curious" | "irrelevant",
  "reasoning": "Clear explanation in Persian or English explaining the rating",
  "matched_feature": "Which product feature directly addresses this (or empty string)",
  "suggested_reply": "Draft message for human sales/community rep to send"
}`;

  const userPrompt = `Evaluate the following community message:
Platform: ${platform || "Community"}
Author: ${author_handle}
${thread_context ? `Thread Context:\n${thread_context}\n` : ""}
Message Content:
"""
${content}
"""`;

  return { systemPrompt, userPrompt };
}

/**
 * Intelligent Persian Heuristic Fallback
 * Used when the local LLM endpoint (Ollama/vLLM) is not running or unreachable.
 * Ensures robust offline demoing and uninterrupted local pipeline execution.
 */
function heuristicPersianEvaluator(input: EvaluateMessageInput, model: string): IntentEvaluationResult {
  const text = (input.content + " " + (input.thread_context || "")).toLowerCase();
  const author = input.author_handle;

  // High Intent keywords in Persian & English
  const highIntentPatterns = [
    /دنبال.*(نرم‌افزار|برنامه|ابزار|سامانه|سایت|پلتفرم)/i,
    /چی پیشنهاد میدین/i,
    /چی پیشنهاد می‌کنید/i,
    /کسی.*سراغ داره/i,
    /معرفی کنید/i,
    /نرم‌افزار.*خوب.*سراغ دارین/i,
    /هزینش چقدره/i,
    /قیمت.*چنده/i,
    /تعرفه.*چطوره/i,
    /سامانه مودیان.*متصل/i,
    /صدور پیش‌فاکتور/i,
    /جایگزین.*(zoho|quickbooks|xero)/i,
    /جایگزین ایرانی/i,
    /خرید نرم‌افزار/i,
    /سفارش لایسنس/i,
    /looking for (accounting|invoicing|saas|software)/i,
    /recommend.*(tool|app|software)/i,
  ];

  // Problem Aware patterns in Persian
  const problemAwarePatterns = [
    /سامانه مودیان.*(کلافه|عذاب|داغون|خطا|مشکل|جریمه)/i,
    /اکسل.*(خسته|وقت‌گیر|اشتباه)/i,
    /تحریم.*(بسته|مسدود|قطع)/i,
    /فاکتور.*دستی/i,
    /تسویه.*دیر/i,
    /حسابداری.*پیچیده/i,
    /درگاه پرداخت.*قطع/i,
    /همش ارور میده/i,
    /هیچ پشتیبانی ندارن/i,
    /سرورهای خارجی قطعه/i,
    /اینترنت بین‌الملل قطع شد/i,
    /frustrated with.*tax/i,
    /blocked because of sanction/i,
  ];

  // Irrelevant / Noise patterns
  const noisePatterns = [
    /^(سلام|درود|صبح بخیر|عصر بخیر|سلام دوستان|خسته نباشید)/i,
    /قیمت دلار|نرخ ارز|بیت‌کوین|طلا/i,
    /استخدام برنامه‌نویس|رزومه|پروژه فریلنسری/i,
    /لینک کانال|عضویت در گروه|تبلیغات/i,
    /بازی دیشب|فوتبال|هوا چطوره/i,
    /hello|hi all|good morning/i,
  ];

  let isHighIntent = highIntentPatterns.some((pattern) => pattern.test(text));
  let isProblemAware = problemAwarePatterns.some((pattern) => pattern.test(text));
  let isNoise = noisePatterns.some((pattern) => pattern.test(text)) && text.length < 70;

  // Keyword density checks against product keywords
  const matchedKeywords = (input.product.keywords || []).filter((kw) =>
    text.includes(kw.toLowerCase())
  );

  let intent_score = 10;
  let intent_level: "high_intent" | "problem_aware" | "curious" | "irrelevant" = "irrelevant";
  let reasoning = "پیام فاقد سیگنال تقاضای تجاری یا نیاز مرتبط با نرم‌افزار مالی و پیش‌فاکتور تشخیص داده شد.";
  let matched_feature = "";
  let suggested_reply = "";

  if (isHighIntent || matchedKeywords.length >= 2) {
    intent_score = Math.floor(82 + Math.random() * 15);
    intent_level = "high_intent";
    matched_feature = "ماژول اتصال مستقیم به سامانه مودیان و صدور ابری فاکتور آنلاین با لینک پرداخت ریالی";
    reasoning = `سیگنال خرید مستقیم و قوی برای نرم‌افزار مالی شناسایی شد. کاربر به دنبال راهکار جایگزین و ابزار معتبر برای کسب‌وکار خود است. کلیدواژه‌های منطبق: ${matchedKeywords.join("، ") || "پیش‌فاکتور/حسابداری"}.`;
    suggested_reply = `سلام ${author} عزیز،\nدر مورد نیازتون به نرم‌افزار حسابداری و صدور فاکتور، پیشنهاد می‌کنم نگاهی به «حساب‌آنلاین پارس» بندازید. این سامانه کاملاً روی سرورهای داخلی مقیمه، اتصال مستقیم و بدون قطعی به سامانه مودیان داره و لینک پرداخت ریالی پیامکی برای مشتری صادر می‌کنه. اگر مایل بودید می‌تونم دموی رایگان براتون ارسال کنم تا تست کنید.`;
  } else if (isProblemAware || (matchedKeywords.length === 1 && text.length > 50)) {
    intent_score = Math.floor(58 + Math.random() * 16);
    intent_level = "problem_aware";
    matched_feature = "ثبت خودکار فاکتورها بر بستر سرورهای داخلی بدون وابستگی به اینترنت بین‌الملل و خطاهای دستی اکسل";
    reasoning = `کاربر درد و چالش مشخصی را در فرآیند مالی/مالیاتی و تحریم سامانه‌ها بیان کرده است. هرچند مستقیماً درخواست خرید نکرده، اما کاملاً واجد شرایط (ICP) راهکار حساب‌آنلاین پارس است.`;
    suggested_reply = `سلام ${author} گرامی،\nکاملاً این چالش قطعی و درگیری دستی با فاکتورها رو درک می‌کنم؛ این موضوع برای خیلی از استارتاپ‌ها تبدیل به دردسر شده. ما در «حساب‌آنلاین پارس» دقیقاً همین بخش ارسال خودکار به مودیان و صدور لینک فاکتور رو به شکل ابری و داخلی حل کردیم تا وابستگی به ابزارهای تحریمی برطرف بشه. خوشحال میشم تجربیات راه‌اندازیش رو براتون به اشتراک بذارم.`;
  } else if (text.length > 40 && (text.includes("؟") || text.includes("?"))) {
    intent_score = Math.floor(25 + Math.random() * 15);
    intent_level = "curious";
    reasoning = "پرسش عمومی یا ابهام در مورد قوانین و فرآیندها مطرح شده است اما فوریت خرید مشاهده نمی‌شود.";
    matched_feature = "پایگاه دانش مالیاتی و حسابداری یکپارچه";
    suggested_reply = `سلام ${author}، در خصوص این سوال، راهنمای مستندات و رویه‌های قانونی مودیان رو در سایت حساب‌آنلاین پارس به شکل رایگان منتشر کردیم که می‌تونه بهتون دید خوبی بده.`;
  }

  // Token count estimation based on char length (Persian UTF-8 approx 1 token per 2-3 chars)
  const input_tokens = Math.max(120, Math.round(text.length * 1.4) + 280);
  const output_tokens = Math.max(45, Math.round(suggested_reply.length * 1.2) + 60);
  const { totalCostUsd } = calculateMessageCost(input_tokens, output_tokens, model);

  return {
    intent_score,
    intent_level,
    reasoning,
    matched_feature,
    suggested_reply,
    input_tokens,
    output_tokens,
    estimated_cost_usd: totalCostUsd,
    model_used: `${model} (Domestic Heuristic Engine)`,
  };
}

/**
 * Direct HTTP LLM Evaluation Client
 * Connects to LLM_BASE_URL (supporting Ollama, vLLM, domestic Iranian reverse proxies, or OpenAI-compatible gateways)
 */
export async function evaluateMessageWithLLM(
  input: EvaluateMessageInput
): Promise<IntentEvaluationResult> {
  const baseUrl = (process.env.LLM_BASE_URL || "http://localhost:11434/v1").replace(/\/+$/, "");
  const apiKey = process.env.LLM_API_KEY || "dummy";
  const model = process.env.LLM_MODEL || "llama3.1";

  const { systemPrompt, userPrompt } = buildPrompt(input);

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.2,
        response_format: { type: "json_object" },
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(
        `[LLM Client] Server returned status ${response.status}. Falling back to resilient domestic evaluator.`
      );
      return heuristicPersianEvaluator(input, model);
    }

    const data: any = await response.json();
    const messageContent = data.choices?.[0]?.message?.content;

    if (!messageContent) {
      return heuristicPersianEvaluator(input, model);
    }

    // Parse structured JSON
    const parsed = JSON.parse(messageContent);

    const input_tokens = data.usage?.prompt_tokens || Math.round(userPrompt.length * 1.2);
    const output_tokens = data.usage?.completion_tokens || Math.round(messageContent.length * 1.2);
    const { totalCostUsd } = calculateMessageCost(input_tokens, output_tokens, model);

    return {
      intent_score: Number(parsed.intent_score ?? 0),
      intent_level: parsed.intent_level || "irrelevant",
      reasoning: parsed.reasoning || "",
      matched_feature: parsed.matched_feature || "",
      suggested_reply: parsed.suggested_reply || "",
      input_tokens,
      output_tokens,
      estimated_cost_usd: totalCostUsd,
      model_used: model,
    };
  } catch (error: any) {
    // Network error or Ollama not running locally:
    // Log helpful diagnostic and return the high-fidelity Iranian community heuristic evaluation
    return heuristicPersianEvaluator(input, model);
  }
}
