'use server';

import { redirect } from 'next/navigation';

import { CONSUMER_ROUTES } from '@/constants/routes';
import { isAdminRole } from '@/lib/auth/is-admin-role';
import { createServerSupabaseClient } from '@/lib/supabase/server-client';

import { type ConsumerLoginInput, consumerLoginSchema } from './login-schema';

export interface ConsumerLoginActionResult {
  errorCode: 'invalid_credentials' | 'unexpected_error';
}

export async function signInConsumer(
  input: ConsumerLoginInput,
): Promise<ConsumerLoginActionResult | undefined> {
  const parsed = consumerLoginSchema.safeParse(input);
  if (!parsed.success) {
    return { errorCode: 'invalid_credentials' };
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

  redirect(CONSUMER_ROUTES.MYPAGE);
}
