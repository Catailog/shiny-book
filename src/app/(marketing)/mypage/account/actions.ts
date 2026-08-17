'use server';

import { redirect } from 'next/navigation';

import { getCurrentConsumer } from '@/lib/auth/get-current-consumer';
import { createServerSupabaseClient } from '@/lib/supabase/server-client';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

import {
  type NotificationPreferencesInput,
  notificationPreferencesSchema,
} from './notification-schema';
import { type ChangePasswordInput, changePasswordSchema } from './password-schema';

export interface ChangePasswordResult {
  errorCode: 'unauthorized' | 'validation_failed' | 'unexpected_error';
}

export async function changeConsumerPassword(
  input: ChangePasswordInput,
): Promise<ChangePasswordResult | undefined> {
  const consumer = await getCurrentConsumer();
  if (!consumer) {
    return { errorCode: 'unauthorized' };
  }

  const parsed = changePasswordSchema.safeParse(input);
  if (!parsed.success) {
    return { errorCode: 'validation_failed' };
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) {
    return { errorCode: 'unexpected_error' };
  }

  return undefined;
}

export interface UpdateNotificationPreferencesResult {
  errorCode: 'unauthorized' | 'validation_failed' | 'unexpected_error';
}

export async function updateNotificationPreferences(
  input: NotificationPreferencesInput,
): Promise<UpdateNotificationPreferencesResult | undefined> {
  const consumer = await getCurrentConsumer();
  if (!consumer) {
    return { errorCode: 'unauthorized' };
  }

  const parsed = notificationPreferencesSchema.safeParse(input);
  if (!parsed.success) {
    return { errorCode: 'validation_failed' };
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.updateUser({
    data: {
      marketingEmailConsent: parsed.data.marketingEmailConsent,
      marketingSmsConsent: parsed.data.marketingSmsConsent,
    },
  });
  if (error) {
    return { errorCode: 'unexpected_error' };
  }

  return undefined;
}

export interface DeleteAccountResult {
  errorCode: 'unauthorized' | 'unexpected_error';
}

export async function deleteConsumerAccount(): Promise<DeleteAccountResult | undefined> {
  const consumer = await getCurrentConsumer();
  if (!consumer) {
    return { errorCode: 'unauthorized' };
  }

  const serviceRoleClient = createServiceRoleClient();
  const { error } = await serviceRoleClient.auth.admin.deleteUser(consumer.id);
  if (error) {
    return { errorCode: 'unexpected_error' };
  }

  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  redirect('/');
}
