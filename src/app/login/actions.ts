'use server';

import { redirect } from 'next/navigation';

import { CONSUMER_ROUTES } from '@/constants/routes';
import { env } from '@/env';
import { isAdminRole } from '@/lib/auth/is-admin-role';
import { isSafeRedirectPath } from '@/lib/auth/is-safe-redirect-path';
import { createServerSupabaseClient } from '@/lib/supabase/server-client';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

import { type ConsumerLoginInput, consumerLoginSchema } from './login-schema';

export interface ConsumerLoginActionResult {
  errorCode: 'invalid_credentials' | 'unexpected_error';
}

export async function signInConsumer(
  input: ConsumerLoginInput,
  redirectTo?: string,
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

  redirect(redirectTo && isSafeRedirectPath(redirectTo) ? redirectTo : CONSUMER_ROUTES.MYPAGE);
}

export interface ConsumerTestLoginResult {
  errorCode: 'unavailable' | 'unexpected_error';
}

export async function signInTestConsumer(
  redirectTo?: string,
): Promise<ConsumerTestLoginResult | undefined> {
  if (env.NODE_ENV === 'production') {
    return { errorCode: 'unavailable' };
  }

  const serviceClient = createServiceRoleClient();
  const { data: existingUsers, error: listError } = await serviceClient.auth.admin.listUsers();
  if (listError) {
    return { errorCode: 'unexpected_error' };
  }

  const existingTestConsumer = existingUsers.users.find(
    (user) => user.email === env.CONSUMER_SEED_EMAIL,
  );

  if (!existingTestConsumer) {
    const { error: createError } = await serviceClient.auth.admin.createUser({
      email: env.CONSUMER_SEED_EMAIL,
      password: env.CONSUMER_SEED_PASSWORD,
      email_confirm: true,
    });

    if (createError) {
      return { errorCode: 'unexpected_error' };
    }
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: env.CONSUMER_SEED_EMAIL,
    password: env.CONSUMER_SEED_PASSWORD,
  });

  if (error || !data.user || isAdminRole(data.user.app_metadata.role)) {
    return { errorCode: 'unexpected_error' };
  }

  redirect(redirectTo && isSafeRedirectPath(redirectTo) ? redirectTo : CONSUMER_ROUTES.MYPAGE);
}
