import rateLimit from 'express-rate-limit';
import { AppError } from '../utils/errors';

interface Bucket {
  count: number;
  resetAt: number;
}

/**
 * In-memory per-key limiter for the blueprint.
 * Swap the Map for Redis (or similar) before multi-instance production.
 */
export function createKeyedLimiter(max: number, windowMs: number) {
  const buckets = new Map<string, Bucket>();

  return (key: string): void => {
    const now = Date.now();
    let bucket = buckets.get(key);

    if (!bucket || now >= bucket.resetAt) {
      bucket = { count: 0, resetAt: now + windowMs };
      buckets.set(key, bucket);
    }

    bucket.count += 1;

    if (bucket.count > max) {
      throw new AppError(
        'RATE_LIMITED',
        'Too many attempts. Please wait and try again.',
        429,
        Math.max(0, bucket.resetAt - now),
      );
    }
  };
}

export function ipRateLimiter() {
  const windowMs = 15 * 60 * 1000;

  return rateLimit({
    windowMs,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req, res) => {
      res.status(429).json({
        ok: false,
        status: null,
        to: null,
        error: {
          code: 'RATE_LIMITED',
          message: 'Too many requests from this IP.',
          retryAfterMs: windowMs,
        },
      });
    },
  });
}
