export type RateLimitRule = {
  /** Maximum number of accepted attempts inside the window. */
  limit: number;
  windowMs: number;
};

export type RateLimitDecision =
  | {allowed: true}
  | {allowed: false; retryAfterSeconds: number};

export type RateLimiterOptions = {
  now?: () => number;
  rules?: readonly RateLimitRule[];
  /** 0 disables the periodic cleanup timer (useful in tests). */
  cleanupIntervalMs?: number;
  maxKeys?: number;
};

export type RateLimiter = (key: string) => RateLimitDecision;

/** 5 submissions / 10 minutes and 20 submissions / hour. */
export const DEFAULT_RATE_LIMIT_RULES: readonly RateLimitRule[] = [
  {limit: 5, windowMs: 10 * 60 * 1000},
  {limit: 20, windowMs: 60 * 60 * 1000}
];

const DEFAULT_CLEANUP_INTERVAL_MS = 10 * 60 * 1000;
const DEFAULT_MAX_KEYS = 10_000;

function prune(timestamps: number[], now: number, maxWindowMs: number): void {
  let expired = 0;
  while (
    expired < timestamps.length &&
    (timestamps[expired] ?? now) <= now - maxWindowMs
  ) {
    expired += 1;
  }
  if (expired > 0) {
    timestamps.splice(0, expired);
  }
}

/**
 * In-memory sliding-window rate limiter.
 *
 * This is intentionally best-effort: it lives in one Node process and is reset
 * on deploy/restart. It does not coordinate across serverless instances.
 * Production must also rely on Cloudflare/WAF rate limiting. Keys are kept in
 * an insertion-ordered Map with a hard cap so memory cannot grow forever.
 */
export function createRateLimiter(
  options: RateLimiterOptions = {}
): RateLimiter {
  const now = options.now ?? Date.now;
  const rules = options.rules ?? DEFAULT_RATE_LIMIT_RULES;
  const cleanupIntervalMs =
    options.cleanupIntervalMs ?? DEFAULT_CLEANUP_INTERVAL_MS;
  const maxKeys = options.maxKeys ?? DEFAULT_MAX_KEYS;
  const maxWindowMs = Math.max(...rules.map((rule) => rule.windowMs), 1);

  const entries = new Map<string, number[]>();
  let cleanupTimer: NodeJS.Timeout | null = null;

  function startCleanup(): void {
    if (cleanupTimer || cleanupIntervalMs <= 0) {
      return;
    }

    cleanupTimer = setInterval(() => {
      const current = now();
      for (const [key, timestamps] of entries) {
        prune(timestamps, current, maxWindowMs);
        if (timestamps.length === 0) {
          entries.delete(key);
        }
      }
    }, cleanupIntervalMs);

    // Never keep a build/CLI process alive because of the cleanup timer.
    cleanupTimer.unref?.();
  }

  return function check(key: string): RateLimitDecision {
    startCleanup();

    const current = now();
    let timestamps = entries.get(key);

    if (!timestamps) {
      if (entries.size >= maxKeys) {
        const oldestKey = entries.keys().next().value;
        if (oldestKey !== undefined) {
          entries.delete(oldestKey);
        }
      }
      timestamps = [];
      entries.set(key, timestamps);
    }

    prune(timestamps, current, maxWindowMs);

    let retryAfterMs = 0;

    for (const rule of rules) {
      const windowStart = current - rule.windowMs;
      let inWindow = 0;
      let oldestInWindow: number | undefined;

      for (const timestamp of timestamps) {
        if (timestamp > windowStart) {
          inWindow += 1;
          oldestInWindow ??= timestamp;
        }
      }

      if (inWindow >= rule.limit) {
        const waitMs = (oldestInWindow ?? current) + rule.windowMs - current;
        retryAfterMs = Math.max(retryAfterMs, waitMs);
      }
    }

    if (retryAfterMs > 0) {
      return {
        allowed: false,
        retryAfterSeconds: Math.max(1, Math.ceil(retryAfterMs / 1000))
      };
    }

    timestamps.push(current);
    return {allowed: true};
  };
}
