import { Ratelimit } from '@upstash/ratelimit';
import 'server-only';

import { AI_CHAT_RATE_LIMIT } from '@/constants/rate-limit';
import type { RateLimitResult } from '@/lib/rate-limit/rate-limit-result';
import { createRedisClient } from '@/lib/redis/create-redis-client';

const ratelimit = new Ratelimit({
  redis: createRedisClient(),
  limiter: Ratelimit.slidingWindow(AI_CHAT_RATE_LIMIT.MAX_REQUESTS, AI_CHAT_RATE_LIMIT.WINDOW),
  prefix: 'book-print-ai-chat',
});

export async function checkAiChatRateLimit(key: string): Promise<RateLimitResult> {
  const { success, limit, remaining, reset } = await ratelimit.limit(key);
  return { isAllowed: success, limit, remaining, resetAt: reset };
}
