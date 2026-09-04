'use server';

import { redirect } from 'next/navigation';

import { DEFAULT_ORDER_STATUS_EMAIL_CONSENT } from '@/constants/consumer';
import { CONSUMER_ROUTES } from '@/constants/routes';
import { isSafeRedirectPath } from '@/lib/auth/is-safe-redirect-path';
import { getLocale } from '@/lib/i18n/get-locale';
import { createServerSupabaseClient } from '@/lib/supabase/server-client';
import { verifyTurnstileToken } from '@/lib/turnstile/verify-turnstile-token';

import { type ConsumerSignupInput, consumerSignupSchema } from './signup-schema';

export interface ConsumerSignupActionResult {
  errorCode: 'email_taken' | 'bot_verification_failed' | 'unexpected_error';
}

export async function signUpConsumer(
  input: ConsumerSignupInput,
  redirectTo: string | undefined,
  turnstileToken: string,
): Promise<ConsumerSignupActionResult | undefined> {
  const isHuman = await verifyTurnstileToken(turnstileToken);
  if (!isHuman) {
    return { errorCode: 'bot_verification_failed' };
  }

  const parsed = consumerSignupSchema.safeParse(input);
  if (!parsed.success) {
    return { errorCode: 'unexpected_error' };
  }

  const locale = await getLocale();
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        name: parsed.data.name,
        phone: parsed.data.phone || null,
        locale,
        orderStatusEmailConsent: DEFAULT_ORDER_STATUS_EMAIL_CONSENT,
        marketingEmailConsent: parsed.data.marketingEmailConsent,
        marketingSmsConsent: parsed.data.marketingSmsConsent,
      },
    },
  });

  if (error) {
    if (error.code === 'user_already_exists') {
      return { errorCode: 'email_taken' };
    }
    return { errorCode: 'unexpected_error' };
  }

  if (!data.session) {
    return { errorCode: 'unexpected_error' };
  }

  redirect(redirectTo && isSafeRedirectPath(redirectTo) ? redirectTo : CONSUMER_ROUTES.MYPAGE);
}
