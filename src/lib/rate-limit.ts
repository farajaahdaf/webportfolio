import "server-only";

type Entry = {
  count: number;
  resetAt: number;
};

type RateLimitOptions = {
  limit: number;
  windowMs: number;
};

const buckets = new Map<string, Entry>();

export function clientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || req.headers.get("x-real-ip") || "unknown";
}

export function checkRateLimit(
  key: string,
  { limit, windowMs }: RateLimitOptions
): { limited: boolean; retryAfter: number } {
  const now = Date.now();
  const current = buckets.get(key);

  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { limited: false, retryAfter: 0 };
  }

  current.count += 1;
  if (current.count > limit) {
    return {
      limited: true,
      retryAfter: Math.ceil((current.resetAt - now) / 1000),
    };
  }

  return { limited: false, retryAfter: 0 };
}
