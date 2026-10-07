import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const SYSTEM_PROMPT = `You are "Radar Assistant" (دستیار هوشمند رادار), the official, built-in intelligent guide for the Radar platform.

Radar Context & Core Knowledge:
- Product: Radar (رادار - سامانه هوشمند کشف سیگنال خرید و جذب سرنخ فروش از جوامع کاربری).
- Purpose: Radar monitors messages from Iranian online communities (Telegram groups, Bale messenger channels, Twitter/X, and specialized forums), evaluates them using AI against the user's Product specs and Ideal Customer Profile (ICP), and scores buying intent from 1 to 10.
- Intent Score (امتیاز نیت خرید):
  * 8-10 (High Intent / سبز): Direct purchase signals, requests for quotes, immediate budget/software needs.
  * 5-7 (Problem Aware / آبی-زرد): Suffering from a pain point, comparing tools, seeking alternatives.
  * 1-4 (Low / Irrelevant): General chat, questions, or noise.
- Lead Statuses (وضعیت سرنخ‌ها):
  * جدید (New): Newly identified lead awaiting sales triage.
  * تماس گرفته شد (Contacted): Suggested outreach sent or conversation opened.
  * تبدیل شد (Converted): Converted to customer or sales meeting.
  * نادیده گرفته شد (Ignored): Marked irrelevant or archived.
- Sources: Telegram, Bale (پیام‌رسان بله), Twitter/X, and Forums.
- Settings & ICP: Product commercial profile, key value propositions, and monitor keywords used by AI to triage incoming leads.
- Hosting: 100% self-hosted on domestic infrastructure using local PocketBase (SQLite).

CRITICAL CONSTRAINTS:
1. You are a knowledgeable GUIDE, not an autonomous agent.
2. You only know about Radar and the visible workspace data.
3. NEVER claim to browse the external internet or access external databases.
4. NEVER claim you modified or deleted a lead, or contacted a customer autonomously.
5. If user asks in Persian, reply in fluent, natural Persian. If asked in English, reply in English.
6. FORMATTING: Do NOT use markdown asterisks (such as ** or ***) anywhere in your response. Write plain, clean, elegant text with simple bullet points (•) where needed.`;

function cleanOutput(text: string): string {
  if (!text) return "";
  let clean = text.replace(/\*{1,3}(.*?)\*{1,3}/g, "$1");
  clean = clean.replace(/^\s*\*\s+/gm, "• ");
  clean = clean.replace(/\*/g, "");
  return clean.trim();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, context } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "پیام معتبر ارسال نشده است." }, { status: 400 });
    }

    const apiKey =
      process.env.OPENROUTER_API_KEY ||
      process.env.LLM_API_KEY ||
      "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";

    const baseUrl = process.env.LLM_BASE_URL || "https://openrouter.ai/api/v1";
    const model = process.env.LLM_MODEL || "meta-llama/llama-3.1-8b-instruct";

    // Prepare workspace context string if provided
    let contextStr = "";
    if (context) {
      contextStr = `\n\nCurrent Workspace Context:\n- Visible Leads Count: ${
        context.totalLeadsCount ?? (Array.isArray(context.leads) ? context.leads.length : "N/A")
      }\n- Active Page: ${context.currentPage || "/"}\n- Monitored Sources: Telegram, Bale, Twitter/X, Forums\n`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    const res = await fetch(`${baseUrl.replace(/\/+$/, "")}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": "https://leadradar.local",
        "X-Title": "Radar AI Lead Assistant",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: SYSTEM_PROMPT + contextStr },
          { role: "user", content: message },
        ],
        temperature: 0.3,
        max_tokens: 800,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const replyContent = data.choices?.[0]?.message?.content;
      if (replyContent && typeof replyContent === "string") {
        return NextResponse.json({
          id: `assistant-msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          role: "assistant",
          content: cleanOutput(replyContent),
          timestamp: Date.now(),
        });
      }
    }

    // Fallback if AI gateway returned non-ok
    return NextResponse.json(
      { error: "پاسخی از مدل دریافت نشد، از موتور پیش‌فرض استفاده می‌شود." },
      { status: 502 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "خطا در ارتباط با سرور هوش مصنوعی" },
      { status: 500 }
    );
  }
}
