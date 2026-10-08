/**
 * Autonomous Background Harvester & Message Ingestion Bot
 * Periodically discovers, simulates, and triages community messages for active users
 * Respects user plan limits and auto-saves all leads into PocketBase SQLite.
 */

import { getPocketBaseClient, authenticateSuperuser, type UserRecord, type ProductRecord, type SourceRecord } from "./pocketbase";
import { triagePendingMessage } from "./pipeline";
import { checkUserPlanLimit, PLAN_LIMITS, type PlanKey } from "./rateLimit";

export interface BotRunResult {
  userId: string;
  userEmail: string;
  plan: PlanKey;
  messagesProcessed: number;
  leadsCreated: number;
  status: "success" | "rate_limited" | "no_product" | "skipped";
}

// Plan-based hourly ingestion limits
export const BOT_HOURLY_LIMITS: Record<PlanKey, number> = {
  free: 2,         // 2 messages per hour
  starter: 6,      // 6 messages per hour
  growth: 20,      // 20 messages per hour
  enterprise: 50,  // 50 messages per hour
};

// Realistic community pool messages covering Iranian tech/business ecosystem
const BOT_COMMUNITY_MESSAGE_POOL = [
  {
    content: "سلام دوستان، ما برای ردیابی سرنخ‌های فروش در گروه‌های تلگرام دنبال یک ابزار خودکار هستیم که هزینه‌ش فضایی نباشه و لوکال باشه. کسی تجربه موفقی داشته؟",
    author: "@reza_growth_lead",
    platform: "telegram",
    thread: "گروه استارتاپ‌های تکنولوژی ایران",
  },
  {
    content: "پشتیبانی این سیستم‌های مدیریت لید خارجی خیلی ضعیفه. از دیروز پیام‌های مشتریان ما در کانال بله جا مونده و هیچ پاسخی نگرفتیم. دنبال جایگزین پایدار ایرانی هستیم.",
    author: "@samaneh_crm",
    platform: "bale",
    thread: "کانال پشتیبانی نرم‌افزارهای ارتباط با مشتری",
  },
  {
    content: "واقعاً تحلیل متن فارسی با مدل‌های هوش مصنوعی سبک مثل gemma خیلی سریع‌تر شده. کسی تست کرده ببینه چقدر هزینه‌ها رو نسبت به api خارجی کاهش میده؟",
    author: "@tech_enthusiast_ir",
    platform: "twitter_x",
    thread: "توییت در مورد فناوری‌های محلی هوش مصنوعی",
  },
  {
    content: "ما بودجه حدود ۵ تا ۱۰ میلیون در ماه برای خودکارسازی نظارت بر بازخورد مشتریان و مکالمات انجمن‌ها در نظر گرفتیم. کدوم تیم محصول آماده دمو داره؟",
    author: "@mehdi_cto_teh",
    platform: "forum",
    thread: "انجمن توسعه‌دهندگان و مدیران محصول",
  },
  {
    content: "سلام، کسی کانال یا ربات معتبری برای دریافت لحظه‌ای نیازهای بازار و مشتریان هدف در تلگرام می‌شناسه؟ ترجیحاً با فیلتر تریاژ هوشمند کلمات کلیدی.",
    author: "@shayan_b2b_sales",
    platform: "telegram",
    thread: "گروه بازاریابی و فروش سازمانی",
  },
  {
    content: "سیستم فعلی ما کلی نویز و پیام نامربوط می‌فرسته، تیم فروش خسته شدن از بررسی دستی روزانه ۵۰۰ پیام اسپم. نیاز به غربالگری اولیه با regex و لایه دوم هوش مصنوعی داریم.",
    author: "@maryam_product_ops",
    platform: "twitter_x",
    thread: "بحث درباره ابزارهای بهره‌وری تیم‌های B2B",
  },
  {
    content: "ما برای پیام‌رسان بله و کانال‌های اطلاع‌رسانی نیاز داریم پیام‌های دردمندانه کاربران رو استخراج کنیم و فوراً به واحد پشتیبانی اختصاص بدیم.",
    author: "@omid_community_mgr",
    platform: "bale",
    thread: "گروه مدیران جامعه کاربری",
  },
  {
    content: "آیا رادار از دیتابیس لوکال SQLite یا پاکت‌بیس پشتیبانی می‌کنه که اطلاعات مشتریان روی سرورهای داخلی بمونه؟ امنیت داده‌ها برای ما حیاتیه.",
    author: "@security_first_ir",
    platform: "forum",
    thread: "تالار گفتگوی امنیت سایبری و داده‌های محلی",
  },
];

/**
 * Executes a single scheduled harvester run for all active users
 */
export async function runHarvesterBot(): Promise<{
  timestamp: string;
  totalUsersChecked: number;
  results: BotRunResult[];
}> {
  const timestamp = new Date().toISOString();
  const pb = getPocketBaseClient();
  await authenticateSuperuser(pb);

  // 1. Fetch active users who completed onboarding and have bot active
  let users: UserRecord[] = [];
  try {
    const records = await pb.collection("users").getFullList<UserRecord>({
      filter: "onboarding_completed = true",
    });
    // Filter users who haven't explicitly disabled the bot
    users = records.filter((u) => u.bot_active !== false);
  } catch (err) {
    console.warn("[BotScheduler] Error listing active users:", err);
    return { timestamp, totalUsersChecked: 0, results: [] };
  }

  // 2. Fetch default sources
  let sources: SourceRecord[] = [];
  try {
    sources = await pb.collection("sources").getFullList<SourceRecord>();
  } catch {
    // fallback
  }

  const results: BotRunResult[] = [];

  for (const user of users) {
    const planKey: PlanKey = (user.plan as PlanKey) || "free";
    const hourlyLimit = BOT_HOURLY_LIMITS[planKey] || BOT_HOURLY_LIMITS.free;

    // Check overall daily plan rate limits
    const rlCheck = checkUserPlanLimit(user.id, planKey, "simulate");
    if (!rlCheck.allowed) {
      results.push({
        userId: user.id,
        userEmail: user.email,
        plan: planKey,
        messagesProcessed: 0,
        leadsCreated: 0,
        status: "rate_limited",
      });
      continue;
    }

    // Locate user's active product
    let product: ProductRecord | null = null;
    try {
      if (user.product_id) {
        product = await pb.collection("products").getOne<ProductRecord>(user.product_id);
      } else {
        const prods = await pb.collection("products").getList<ProductRecord>(1, 1, {
          filter: `user_id = "${user.id}"`,
        });
        if (prods.items.length > 0) {
          product = prods.items[0];
        }
      }

      if (!product) {
        const defaultProd = await pb.collection("products").getList<ProductRecord>(1, 1);
        if (defaultProd.items.length > 0) {
          product = defaultProd.items[0];
          try {
            await pb.collection("users").update(user.id, { product_id: product.id });
          } catch {}
        }
      }
    } catch {
      product = null;
    }

    if (!product) {
      results.push({
        userId: user.id,
        userEmail: user.email,
        plan: planKey,
        messagesProcessed: 0,
        leadsCreated: 0,
        status: "no_product",
      });
      continue;
    }

    // Process a limited batch of messages for this user based on hourly quota
    const batchCount = Math.min(hourlyLimit, 3); // Max 3 per single cron tick to keep latency low
    let processedCount = 0;
    let leadsCreatedCount = 0;

    // Pick random message variants from pool
    const poolCopy = [...BOT_COMMUNITY_MESSAGE_POOL].sort(() => 0.5 - Math.random());
    const selectedMessages = poolCopy.slice(0, batchCount);

    for (const msg of selectedMessages) {
      try {
        const source = sources.find((s) => s.platform === msg.platform) || sources[0];

        // Create raw_message record in PocketBase with user_id
        const rawMsg = await pb.collection("raw_messages").create({
          source_id: source ? source.id : null,
          external_id: `bot_auto_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          author_handle: msg.author,
          content: msg.content,
          thread_context: msg.thread,
          status: "pending",
          user_id: user.id,
        });

        // Run through autonomous 3-stage triage pipeline
        const triageResult = await triagePendingMessage(
          pb,
          rawMsg as any,
          product,
          user.id
        );

        processedCount++;
        if (triageResult.lead) {
          leadsCreatedCount++;
        }
      } catch (procErr) {
        console.error(`[BotScheduler] Error triaging bot message for user ${user.id}:`, procErr);
      }
    }

    // Update user's last_bot_run timestamp in PocketBase
    try {
      await pb.collection("users").update(user.id, {
        last_bot_run: new Date().toISOString(),
      });
    } catch {
      // non-fatal
    }

    results.push({
      userId: user.id,
      userEmail: user.email,
      plan: planKey,
      messagesProcessed: processedCount,
      leadsCreated: leadsCreatedCount,
      status: "success",
    });
  }

  return {
    timestamp,
    totalUsersChecked: users.length,
    results,
  };
}

// Global in-memory timer tracking to avoid duplicate intervals in dev HMR
declare global {
  var __radar_bot_interval__: NodeJS.Timeout | undefined;
  var __radar_bot_last_run__: string | undefined;
}

/**
 * Initializes the background bot interval if not already running.
 * Default runs every 60 minutes (or configurable).
 */
export function initBackgroundBot(intervalMinutes = 60) {
  if (global.__radar_bot_interval__) {
    return; // Already initialized
  }

  const intervalMs = intervalMinutes * 60 * 1000;
  console.log(`[BotScheduler] Starting periodic Harvester Bot (every ${intervalMinutes} minutes)...`);

  global.__radar_bot_interval__ = setInterval(async () => {
    try {
      console.log("[BotScheduler] Running periodic hourly message harvest...");
      const summary = await runHarvesterBot();
      global.__radar_bot_last_run__ = summary.timestamp;
      console.log(`[BotScheduler] Harvest finished: ${summary.results.length} users processed.`);
    } catch (err) {
      console.error("[BotScheduler] Periodic harvest error:", err);
    }
  }, intervalMs);
}

export function getLastBotRunTime(): string | null {
  return global.__radar_bot_last_run__ || null;
}
