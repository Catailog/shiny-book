'use server';

import { redirect } from 'next/navigation';

import { CONSUMER_ROUTES } from '@/constants/routes';
import { TEST_ACCOUNT_ROLE_PREFIX } from '@/constants/test-account';
import { env } from '@/env';
import { isAdminRole } from '@/lib/auth/is-admin-role';
import { isSafeRedirectPath } from '@/lib/auth/is-safe-redirect-path';
import { createTestAccountPair } from '@/lib/auth/test-account-pair';
import {
  buildTestAccountEmail,
  persistTestAccountPairToken,
  readTestAccountPairToken,
  signInWithExistingTestAccount,
} from '@/lib/auth/test-account-session';
import { checkAuthActionRateLimit } from '@/lib/rate-limit/auth-action-rate-limit';
import { getClientIp } from '@/lib/request/get-client-ip';
import { createServerSupabaseClient } from '@/lib/supabase/server-client';
import { verifyTurnstileToken } from '@/lib/turnstile/verify-turnstile-token';

import { type ConsumerLoginInput, consumerLoginSchema } from './login-schema';

export interface ConsumerLoginActionResult {
  errorCode: 'invalid_credentials' | 'rate_limited' | 'unexpected_error';
}

export async function signInConsumer(
  input: ConsumerLoginInput,
  redirectTo?: string,
): Promise<ConsumerLoginActionResult | undefined> {
  const parsed = consumerLoginSchema.safeParse(input);
  if (!parsed.success) {
    return { errorCode: 'invalid_credentials' };
  }

  const clientIp = await getClientIp();
  const rateLimit = await checkAuthActionRateLimit(
    `login-consumer:ip:${clientIp}`,
    `login-consumer:email:${parsed.data.email.toLowerCase()}`,
  );
  if (!rateLimit.isAllowed) {
    return { errorCode: 'rate_limited' };
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error || !data.user) {
    return { errorCode: 'invalid_credentials' };
  }

  if (isAdminRole(data.user.app_metadata.role)) {
    await supabase.auth.signOut();
    return { errorCode: 'invalid_credentials' };
  }

  redirect(redirectTo && isSafeRedirectPath(redirectTo) ? redirectTo : CONSUMER_ROUTES.MYPAGE);
}

export interface ConsumerTestLoginResult {
  errorCode: 'unavailable' | 'bot_verification_failed' | 'unexpected_error';
}

function isConsumerRole(role: unknown): boolean {
  return !isAdminRole(role);
}

export async function signInTestConsumer(
  redirectTo: string | undefined,
  turnstileToken: string,
): Promise<ConsumerTestLoginResult | undefined> {
  if (!env.ALLOW_TEST_LOGIN) {
    return { errorCode: 'unavailable' };
  }

  const isHuman = await verifyTurnstileToken(turnstileToken);
  if (!isHuman) {
    return { errorCode: 'bot_verification_failed' };
  }

  const existingToken = await readTestAccountPairToken();

  if (existingToken) {
    const consumerEmail = buildTestAccountEmail(TEST_ACCOUNT_ROLE_PREFIX.CONSUMER, existingToken);

    if (await signInWithExistingTestAccount(consumerEmail, isConsumerRole)) {
      await persistTestAccountPairToken(existingToken);
      redirect(redirectTo && isSafeRedirectPath(redirectTo) ? redirectTo : CONSUMER_ROUTES.MYPAGE);
    }
  }

  const pair = await createTestAccountPair();
  if (!pair) {
    return { errorCode: 'unexpected_error' };
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: pair.consumerEmail,
    password: pair.consumerPassword,
  });

  if (error || !data.user || isAdminRole(data.user.app_metadata.role)) {
    return { errorCode: 'unexpected_error' };
  }

  redirect(redirectTo && isSafeRedirectPath(redirectTo) ? redirectTo : CONSUMER_ROUTES.MYPAGE);
}
