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
