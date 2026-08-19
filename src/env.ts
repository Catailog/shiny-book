import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    SUPABASE_SECRET_KEY: z.string().min(1),
    KV_REST_API_URL: z.string().url(),
    KV_REST_API_TOKEN: z.string().min(1),
    TOSS_SECRET_KEY: z.string().min(1),
    ADMIN_SEED_EMAIL: z.string().min(1).default('admin@shinybook.local'),
    ADMIN_SEED_PASSWORD: z.string().min(1).default('LocalAdmin1234!'),
    CONSUMER_SEED_EMAIL: z.string().min(1).default('consumer@shinybook.local'),
    CONSUMER_SEED_PASSWORD: z.string().min(1).default('LocalConsumer1234!'),
    CONSUMER_SEED_EMAIL_2: z.string().min(1).default('consumer2@shinybook.local'),
    CONSUMER_SEED_PASSWORD_2: z.string().min(1).default('LocalConsumer2_1234!'),
  },
  client: {
    NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
    NEXT_PUBLIC_TOSS_CLIENT_KEY: z.string().min(1),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_TOSS_CLIENT_KEY: process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY,
  },
});
