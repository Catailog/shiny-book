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

async function seedTestConsumerAddresses(consumerId: string): Promise<void> {
  const serviceClient = createServiceRoleClient();
  const { count } = await serviceClient
    .from('addresses')
    .select('id', { count: 'exact', head: true })
    .eq('consumer_id', consumerId);

  if (count) {
    return;
  }

  await serviceClient.from('addresses').insert([
    {
      consumer_id: consumerId,
      label: '집',
      recipient_name: '테스트 사용자',
      phone: '010-1234-5678',
      postal_code: '06236',
      address_line1: '서울특별시 강남구 테헤란로 123',
      address_line2: '101동 1001호',
      is_default: true,
    },
    {
      consumer_id: consumerId,
      label: '회사',
      recipient_name: '테스트 사용자',
      phone: '010-9876-5432',
      postal_code: '04524',
      address_line1: '서울특별시 중구 세종대로 110',
      address_line2: '5층',
      is_default: false,
    },
  ]);
}

export interface ConsumerTestLoginResult {
  errorCode: 'unavailable' | 'unexpected_error';
}

export async function signInTestConsumer(
  redirectTo?: string,
): Promise<ConsumerTestLoginResult | undefined> {
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

  await seedTestConsumerAddresses(data.user.id);

  redirect(redirectTo && isSafeRedirectPath(redirectTo) ? redirectTo : CONSUMER_ROUTES.MYPAGE);
}
