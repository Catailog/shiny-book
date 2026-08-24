import 'server-only';

import { env } from '@/env';

const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

interface TurnstileVerifyBody {
  success: boolean;
}

function isTurnstileVerifyBody(value: unknown): value is TurnstileVerifyBody {
  return (
    typeof value === 'object' &&
    value !== null &&
    'success' in value &&
    typeof (value as Record<string, unknown>).success === 'boolean'
  );
}

export async function verifyTurnstileToken(token: string): Promise<boolean> {
  if (!token) {
    return false;
  }

  const response = await fetch(TURNSTILE_VERIFY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ secret: env.TURNSTILE_SECRET_KEY, response: token }),
  });

  const body: unknown = await response.json().catch(() => null);

  return isTurnstileVerifyBody(body) && body.success;
}
