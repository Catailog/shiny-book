import { Ratelimit } from '@upstash/ratelimit';
import 'server-only';

import { PHOTO_UPLOAD_ACTION_RATE_LIMIT } from '@/constants/rate-limit';
import type { RateLimitResult } from '@/lib/rate-limit/rate-limit-result';
import { createRedisClient } from '@/lib/redis/create-redis-client';

const ratelimit = new Ratelimit({
  redis: createRedisClient(),
  limiter: Ratelimit.slidingWindow(
    PHOTO_UPLOAD_ACTION_RATE_LIMIT.MAX_REQUESTS,
    PHOTO_UPLOAD_ACTION_RATE_LIMIT.WINDOW,
  ),
  prefix: 'book-print-photo-upload',
});

export async function checkPhotoUploadRateLimit(key: string): Promise<RateLimitResult> {
  const { success, limit, remaining, reset } = await ratelimit.limit(key);
  return { isAllowed: success, limit, remaining, resetAt: reset };
}

// Seconds until the caller may retry, based on the sliding-window reset. Clamped to at
// least 1 so the message never says "0 seconds".
export function retryAfterSeconds(resetAt: number): number {
  return Math.max(1, Math.ceil((resetAt - Date.now()) / 1000));
}
