import { Resend } from 'resend';
import 'server-only';

import { env } from '@/env';

let cachedClient: Resend | null = null;

// Returns null when `RESEND_API_KEY` is not configured (local, preview) so callers
// can fall back to logging instead of sending.
export function getResendClient(): Resend | null {
  if (!env.RESEND_API_KEY) {
    return null;
  }

  if (!cachedClient) {
    cachedClient = new Resend(env.RESEND_API_KEY);
  }

  return cachedClient;
}
