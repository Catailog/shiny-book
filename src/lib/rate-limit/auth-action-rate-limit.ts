import { Ratelimit } from '@upstash/ratelimit';
import 'server-only';

import { AUTH_ACTION_RATE_LIMIT } from '@/constants/rate-limit';
import type { RateLimitResult } from '@/lib/rate-limit/rate-limit-result';
import { createRedisClient } from '@/lib/redis/create-redis-client';

const ratelimit = new Ratelimit({
  redis: createRedisClient(),
  limiter: Ratelimit.slidingWindow(
    AUTH_ACTION_RATE_LIMIT.MAX_REQUESTS,
    AUTH_ACTION_RATE_LIMIT.WINDOW,
  ),
  prefix: 'book-print-auth-action',
});

export async function checkAuthActionRateLimit(
  primaryKey: string,
  secondaryKey: string,
): Promise<RateLimitResult> {
  const [primaryResult, secondaryResult] = await Promise.all([
    ratelimit.limit(primaryKey),
    ratelimit.limit(secondaryKey),
  ]);
  const blockedResult = !primaryResult.success
    ? primaryResult
    : !secondaryResult.success
      ? secondaryResult
      : null;
  const result = blockedResult ?? primaryResult;

  return {
    isAllowed: blockedResult === null,
    limit: result.limit,
    remaining: result.remaining,
    resetAt: result.reset,
  };
}
