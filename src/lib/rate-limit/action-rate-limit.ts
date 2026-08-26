import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

import { GENERAL_ACTION_RATE_LIMIT } from '@/constants/rate-limit';
import { env } from '@/env';
import type { RateLimitResult } from '@/lib/rate-limit/rate-limit-result';

// This checker runs inside proxy.ts (middleware), which Next.js bundles separately
// from Server Components/Actions without the "react-server" resolve condition - so
// it can't go through create-redis-client.ts, which is marked 'server-only' and
// would throw when pulled into the middleware bundle. The Redis client is built
// inline here instead.
const redis = new Redis({ url: env.KV_REST_API_URL, token: env.KV_REST_API_TOKEN });

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(
    GENERAL_ACTION_RATE_LIMIT.MAX_REQUESTS,
    GENERAL_ACTION_RATE_LIMIT.WINDOW,
  ),
  prefix: 'book-print-action',
});

export async function checkActionRateLimit(key: string): Promise<RateLimitResult> {
  const { success, limit, remaining, reset } = await ratelimit.limit(key);
  return { isAllowed: success, limit, remaining, resetAt: reset };
}
