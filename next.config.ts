import type { NextConfig } from 'next';

import { withSentryConfig } from '@sentry/nextjs/config';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseUrlParts = supabaseUrl ? new URL(supabaseUrl) : null;

const isDev = process.env.NODE_ENV === 'development';

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowLocalIP: isDev,
    remotePatterns: supabaseUrlParts
      ? [
          {
            protocol: supabaseUrlParts.protocol.replace(':', '') as 'http' | 'https',
            hostname: supabaseUrlParts.hostname,
            port: supabaseUrlParts.port,
            pathname: '/storage/v1/object/**',
          },
        ]
      : [],
  },
};

export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  // Only chatter about the upload in CI, where the log is worth reading.
  silent: !process.env.CI,
  widenClientFileUpload: true,
  sourcemaps: {
    disable: !process.env.SENTRY_AUTH_TOKEN,
  },
});
