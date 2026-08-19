import type { NextConfig } from 'next';

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

export default nextConfig;
