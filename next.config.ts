import type { NextConfig } from 'next';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseUrlParts = supabaseUrl ? new URL(supabaseUrl) : null;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: supabaseUrlParts
      ? [
          {
            protocol: supabaseUrlParts.protocol.replace(':', '') as 'http' | 'https',
            hostname: supabaseUrlParts.hostname,
            port: supabaseUrlParts.port,
            pathname: '/storage/v1/object/public/**',
          },
        ]
      : [],
  },
};

export default nextConfig;
