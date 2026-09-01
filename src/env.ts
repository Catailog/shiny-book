import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    SUPABASE_SECRET_KEY: z.string().min(1),
    KV_REST_API_URL: z.string().url(),
    KV_REST_API_TOKEN: z.string().min(1),
    TOSS_SECRET_KEY: z.string().min(1),
    TURNSTILE_SECRET_KEY: z.string().min(1).default('1x0000000000000000000000000000000AA'),
    CRON_SECRET: z.string().min(1),
    // z.coerce.boolean()은 'false' 문자열도 true로 취급하는 함정이 있어 문자열 비교로 직접 변환한다
    ALLOW_TEST_PAYMENT: z
      .string()
      .default('true')
      .transform((value) => value === 'true'),
    ALLOW_TEST_LOGIN: z
      .string()
      .default('true')
      .transform((value) => value === 'true'),
    // AI chat providers. Optional: the fallback chain skips any provider whose
    // key is missing, so the assistant works with 1, 2, or all 3 configured.
    GEMINI_API_KEY: z.string().min(1).optional(),
    GROQ_API_KEY: z.string().min(1).optional(),
    CLOUDFLARE_ACCOUNT_ID: z.string().min(1).optional(),
    CLOUDFLARE_API_TOKEN: z.string().min(1).optional(),
  },
  client: {
    NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
    NEXT_PUBLIC_TOSS_CLIENT_KEY: z.string().min(1),
    NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string().min(1).default('1x00000000000000000000AA'),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_TOSS_CLIENT_KEY: process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY,
    NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
  },
});
