import { NextResponse } from "next/server";
import {
  getPocketBaseClient,
  authenticateSuperuser,
  type ProductRecord,
} from "@/lib/pocketbase";
import { ingestExternalMessage } from "@/lib/ingest";
import { triagePendingMessage } from "@/lib/pipeline";
import { isAuthenticatedRequest, timingSafeEqual } from "@/lib/auth";
import { rateLimiter, getClientIp } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

interface TelegramUser {
  id?: number;
  username?: string;
  first_name?: string;
  is_bot?: boolean;
}

interface TelegramChat {
  id?: number | string;
  title?: string;
  username?: string;
  type?: string;
}

interface TelegramMessage {
  message_id?: number;
  date?: number;
  text?: string;
  caption?: string;
  from?: TelegramUser;
  chat?: TelegramChat;
}

function checkSecret(req: Request): boolean {
  const expected = process.env.TELEGRAM_WEBHOOK_SECRET || "";
  const provided =
    req.headers.get("x-telegram-bot-api-secret-token") ||
    req.headers.get("x-webhook-secret") ||
    "";
  return !!expected && !!provided && timingSafeEqual(provided, expected);
}

export async function POST(req: Request) {
  // 1. Authentication: platform secret header, or Bearer API key (manual push / testing)
  if (!checkSecret(req) && !(await isAuthenticatedRequest(req))) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  // 2. Rate limiting (120/min per IP — Telegram fans out across many egress IPs)
  const clientIp = getClientIp(req);
  const rl = rateLimiter.check(`ingest:telegram:${clientIp}`, 120, 60 * 1000);
  if (!rl.allowed) {
    return NextResponse.json({ error: "Rate limit exceeded." }, { status: 429 });
  }

  let update: any;
  try {
    update = await req.json();
  } catch {
    return NextResponse.json({ error: "Malformed JSON payload." }, { status: 400 });
  }

  // 3. Extract the message (new, edited, or channel post)
  const msg = (update?.message || update?.edited_message || update?.channel_post || {}) as TelegramMessage;
  const text = (typeof msg.text === "string" && msg.text.trim())
    || (typeof msg.caption === "string" && msg.caption.trim())
    || "";
  if (!text || msg.message_id === undefined || msg.chat?.id === undefined) {
    // Non-text updates (stickers, joins, polls…): acknowledge, nothing to triage.
    return NextResponse.json({ success: true, ignored: true });
  }
  if (msg.from?.is_bot) {
    return NextResponse.json({ success: true, ignored: true });
  }

  try {
    const pb = getPocketBaseClient();
    await authenticateSuperuser(pb);

    const products = await pb.collection("products").getList<ProductRecord>(1, 1);
    if (products.totalItems === 0) {
      return NextResponse.json({ error: "No product configured in database." }, { status: 400 });
    }

    const chat = msg.chat || {};
    const author =
      (msg.from?.username ? `@${msg.from.username}` : msg.from?.first_name) || "@telegram_user";
    const chatId = String(chat.id);

    const { rawMessage, deduped } = await ingestExternalMessage(
      pb,
      {
        platform: "telegram",
        externalId: `tg:${chatId}:${msg.message_id}`,
        authorHandle: author,
        content: text.slice(0, 3000),
        chatTitle: chat.title || chat.username,
        postedAt: msg.date ? new Date(msg.date * 1000).toISOString() : undefined,
      },
      chatId
    );

    if (deduped) {
      return NextResponse.json({ success: true, deduped: true, raw_message_id: rawMessage.id });
    }

    const { lead, evalResult, layer } = await triagePendingMessage(pb, rawMessage, products.items[0]);
    const fullLead = await pb.collection("leads").getOne(lead.id, {
      expand: "raw_message_id.source_id,product_id",
    });

    return NextResponse.json({ success: true, layer, lead: fullLead, evalResult });
  } catch (err: any) {
    console.error("[API /ingest/telegram] Error:", err);
    return NextResponse.json({ error: "Failed to ingest Telegram message." }, { status: 500 });
  }
}
