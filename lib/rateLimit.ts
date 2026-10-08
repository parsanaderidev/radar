/**
 * In-Memory Sliding-Window Rate Limiter & Concurrency Limiter
 * Zero External Dependencies
 */

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

class InMemoryRateLimiter {
  private hits = new Map<string, RateLimitRecord>();
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Periodically clean expired records every 60 seconds
    if (typeof setInterval !== "undefined") {
      this.cleanupInterval = setInterval(() => this.cleanup(), 60000);
      if (this.cleanupInterval.unref) {
        this.cleanupInterval.unref();
      }
    }
  }

  /**
   * Checks if an identifier exceeds maxRequests within windowMs.
   * Returns { allowed: boolean, remaining: number, resetInMs: number }
   */
  public check(
    key: string,
    maxRequests: number,
    windowMs: number
  ): { allowed: boolean; remaining: number; resetInMs: number } {
    const now = Date.now();
    const existing = this.hits.get(key);

    if (!existing || now > existing.resetAt) {
      this.hits.set(key, {
        count: 1,
        resetAt: now + windowMs,
      });
      return {
        allowed: true,
        remaining: maxRequests - 1,
        resetInMs: windowMs,
      };
    }

    if (existing.count >= maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetInMs: Math.max(0, existing.resetAt - now),
      };
    }

    existing.count += 1;
    return {
      allowed: true,
      remaining: maxRequests - existing.count,
      resetInMs: Math.max(0, existing.resetAt - now),
    };
  }

  public reset(key: string): void {
    this.hits.delete(key);
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, record] of this.hits.entries()) {
      if (now > record.resetAt) {
        this.hits.delete(key);
      }
    }
  }
}

export const rateLimiter = new InMemoryRateLimiter();

/**
 * Extracts a client identifier from Request headers (Cloudflare IP, X-Forwarded-For, or fallback)
 */
export function getClientIp(req: Request): string {
  const cfIp = req.headers.get("cf-connecting-ip");
  if (cfIp) return cfIp.trim();

  const xff = req.headers.get("x-forwarded-for");
  if (xff) {
    const ips = xff.split(",");
    if (ips[0]) return ips[0].trim();
  }

  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  return "127.0.0.1";
}

/**
 * Concurrency guard for heavy LLM operations
 */
class ConcurrencyLimiter {
  private activeCount = 0;
  private readonly maxConcurrent: number;

  constructor(maxConcurrent = 4) {
    this.maxConcurrent = maxConcurrent;
  }

  public acquire(): boolean {
    if (this.activeCount >= this.maxConcurrent) {
      return false;
    }
    this.activeCount++;
    return true;
  }

  public release(): void {
    this.activeCount = Math.max(0, this.activeCount - 1);
  }

  public get active(): number {
    return this.activeCount;
  }
}

export const llmConcurrencyLimiter = new ConcurrencyLimiter(3);

/**
 * Plan-based Quotas and Rate Limits for Multi-tenant SaaS
 */
export interface PlanRateLimitConfig {
  planId: string;
  nameFa: string;
  minuteRateLimit: number; // Max requests per minute
  dailyQuota: number;       // Max message evaluations per day
  simulationsPerDay: number;// Max simulations / test injections per day
}

export type PlanKey = "free" | "starter" | "growth" | "enterprise";

export const PLAN_LIMITS: Record<PlanKey, PlanRateLimitConfig> = {
  free: {
    planId: "free",
    nameFa: "آزمایشی رایگان",
    minuteRateLimit: 10,
    dailyQuota: 30,
    simulationsPerDay: 15,
  },
  starter: {
    planId: "starter",
    nameFa: "استارتر",
    minuteRateLimit: 30,
    dailyQuota: 500,
    simulationsPerDay: 100,
  },
  growth: {
    planId: "growth",
    nameFa: "رشد",
    minuteRateLimit: 90,
    dailyQuota: 2000,
    simulationsPerDay: 500,
  },
  enterprise: {
    planId: "enterprise",
    nameFa: "سازمانی",
    minuteRateLimit: 300,
    dailyQuota: 10000,
    simulationsPerDay: 2000,
  },
};

/**
 * Evaluates whether an authenticated user is within their plan's rate limit and daily quota.
 * System administrators (userId === "admin") bypass all quotas.
 */
export function checkUserPlanLimit(
  userId: string,
  planKey: string = "free",
  action: "analyze" | "simulate" | "initial_fetch" = "analyze"
): {
  allowed: boolean;
  remainingMinute: number;
  remainingDaily: number;
  planNameFa: string;
  errorFa?: string;
  resetInMs?: number;
} {
  // Master administrator bypass
  if (userId === "admin") {
    return {
      allowed: true,
      remainingMinute: 9999,
      remainingDaily: 9999,
      planNameFa: "مدیر کل سیستم",
    };
  }

  const normalizedPlan = (planKey || "free").toLowerCase() as PlanKey;
  const config = PLAN_LIMITS[normalizedPlan] || PLAN_LIMITS["free"];

  // 1. Sliding window minute-rate check
  const minuteKey = `user:${userId}:min`;
  const minuteCheck = rateLimiter.check(minuteKey, config.minuteRateLimit, 60 * 1000);
  if (!minuteCheck.allowed) {
    return {
      allowed: false,
      remainingMinute: 0,
      remainingDaily: 0,
      planNameFa: config.nameFa,
      resetInMs: minuteCheck.resetInMs,
      errorFa: `سقف مجاز درخواست در دقیقه برای پلن «${config.nameFa}» (${config.minuteRateLimit} درخواست در دقیقه) پر شده است. لطفاً ${Math.ceil(minuteCheck.resetInMs / 1000)} ثانیه دیگر مجدداً تلاش کنید.`,
    };
  }

  // 2. Sliding window 24h daily-quota check
  const dailyLimit = action === "analyze" ? config.dailyQuota : config.simulationsPerDay;
  const dailyKey = `user:${userId}:day:${action === "analyze" ? "analyze" : "sim"}`;
  const dailyCheck = rateLimiter.check(dailyKey, dailyLimit, 24 * 60 * 60 * 1000);
  if (!dailyCheck.allowed) {
    return {
      allowed: false,
      remainingMinute: minuteCheck.remaining,
      remainingDaily: 0,
      planNameFa: config.nameFa,
      resetInMs: dailyCheck.resetInMs,
      errorFa: `سقف مصرف روزانه پلن «${config.nameFa}» (${dailyLimit} ${action === "analyze" ? "پیام" : "تزریق/اسکن"} در شبانه‌روز) تکمیل شده است. برای افزایش ظرفیت پردازش، می‌توانید پلن خود را به استارتر یا رشد ارتقا دهید.`,
    };
  }

  return {
    allowed: true,
    remainingMinute: minuteCheck.remaining,
    remainingDaily: dailyCheck.remaining,
    planNameFa: config.nameFa,
  };
}
