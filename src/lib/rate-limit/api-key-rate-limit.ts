import { Ratelimit } from '@upstash/ratelimit';
import 'server-only';

import { API_RATE_LIMIT } from '@/constants/rate-limit';
import { createRedisClient } from '@/lib/redis/create-redis-client';

const ratelimit = new Ratelimit({
  redis: createRedisClient(),
  limiter: Ratelimit.slidingWindow(API_RATE_LIMIT.MAX_REQUESTS, API_RATE_LIMIT.WINDOW),
  prefix: 'book-print-api',
});

export interface RateLimitResult {
  isAllowed: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
}

export async function checkApiRateLimit(clientId: string): Promise<RateLimitResult> {
  const { success, limit, remaining, reset } = await ratelimit.limit(clientId);
  return { isAllowed: success, limit, remaining, resetAt: reset };
}
