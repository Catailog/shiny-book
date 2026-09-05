import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
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
    // Transactional email (order status notifications). Optional: when the key is
    // missing the sender logs "would send" and returns without calling Resend.
    RESEND_API_KEY: z.string().min(1).optional(),
    // Absolute base URL for links in server-generated content (email CTAs).
    APP_URL: z.string().url().default('http://localhost:3000'),
  },
  client: {
    NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
    NEXT_PUBLIC_TOSS_CLIENT_KEY: z.string().min(1),
    NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string().min(1).default('1x00000000000000000000AA'),
    // Sentry DSNs are meant to be public (send-only, like a Stripe publishable
    // key) - the same value is reused server/edge-side too. Optional: Sentry.init
    // no-ops without a dsn, so the SDK is silently inert until this is set.
    NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),
  },
  // NODE_ENV은 서버/클라이언트 양쪽에서 접근해야 한다(예: instrumentation-client.ts).
  // server 블록에 두면 t3-env가 클라이언트 접근을 막아 런타임 에러를 던지므로
  // NEXT_PUBLIC_ 프리픽스 없이 양쪽에 공유되는 shared 블록에 둔다.
  shared: {
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  },
  experimental__runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_TOSS_CLIENT_KEY: process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY,
    NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
  },
});
