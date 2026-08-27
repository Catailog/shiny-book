'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { FILE_UPLOAD_KIND, STORAGE_BUCKETS } from '@/constants/file-upload';
import { CONSUMER_ROUTES } from '@/constants/routes';
import { TEST_ACCOUNT } from '@/constants/test-account';
import { getCurrentConsumer } from '@/lib/auth/get-current-consumer';
import { deletePairedTestAdmin } from '@/lib/auth/test-account-pair';
import { verifyUserPassword } from '@/lib/auth/verify-user-password';
import { deleteConsumerAndData } from '@/lib/consumers/delete-consumer-and-data';
import { createServerSupabaseClient } from '@/lib/supabase/server-client';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

import { type DisplayNameInput, displayNameSchema } from './display-name-schema';
import {
  type NotificationPreferencesInput,
  notificationPreferencesSchema,
} from './notification-schema';
import { type ChangePasswordInput, changePasswordSchema } from './password-schema';
import { type PhoneFormInput, phoneFormSchema } from './phone-schema';

export interface ChangePasswordResult {
  errorCode:
    'unauthorized' | 'validation_failed' | 'incorrect_current_password' | 'unexpected_error';
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

  if (!consumer.email) {
    return { errorCode: 'unexpected_error' };
  }

  const isCurrentPasswordValid = await verifyUserPassword(
    consumer.email,
    parsed.data.currentPassword,
  );
  if (!isCurrentPasswordValid) {
    return { errorCode: 'incorrect_current_password' };
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

export interface UpdateDisplayNameResult {
  errorCode: 'unauthorized' | 'validation_failed' | 'unexpected_error';
}

export async function updateDisplayName(
  input: DisplayNameInput,
): Promise<UpdateDisplayNameResult | undefined> {
  const consumer = await getCurrentConsumer();
  if (!consumer) {
    return { errorCode: 'unauthorized' };
  }

  const parsed = displayNameSchema.safeParse(input);
  if (!parsed.success) {
    return { errorCode: 'validation_failed' };
  }

  const { error } = await createServiceRoleClient()
    .from('profiles')
    .update({ display_name: parsed.data.displayName })
    .eq('id', consumer.id);
  if (error) {
    return { errorCode: 'unexpected_error' };
  }

  revalidatePath(CONSUMER_ROUTES.ACCOUNT);
  return undefined;
}

export interface UpdatePhoneResult {
  errorCode: 'unauthorized' | 'validation_failed' | 'unexpected_error';
}

export async function updateConsumerPhone(
  input: PhoneFormInput,
): Promise<UpdatePhoneResult | undefined> {
  const consumer = await getCurrentConsumer();
  if (!consumer) {
    return { errorCode: 'unauthorized' };
  }

  const parsed = phoneFormSchema.safeParse(input);
  if (!parsed.success) {
    return { errorCode: 'validation_failed' };
  }

  const { error } = await createServiceRoleClient().auth.admin.updateUserById(consumer.id, {
    user_metadata: { ...consumer.user_metadata, phone: parsed.data.phone ?? null },
  });
  if (error) {
    return { errorCode: 'unexpected_error' };
  }

  revalidatePath(CONSUMER_ROUTES.ACCOUNT);
  return undefined;
}

export interface UpdateProfileImageResult {
  errorCode: 'unauthorized' | 'validation_failed' | 'unexpected_error';
}

export async function updateProfileImage(
  path: string,
): Promise<UpdateProfileImageResult | undefined> {
  const consumer = await getCurrentConsumer();
  if (!consumer) {
    return { errorCode: 'unauthorized' };
  }

  if (!path.startsWith(`${consumer.id}/${FILE_UPLOAD_KIND.AVATAR}/`)) {
    return { errorCode: 'validation_failed' };
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.updateUser({ data: { avatarPath: path } });
  if (error) {
    return { errorCode: 'unexpected_error' };
  }

  revalidatePath(CONSUMER_ROUTES.ACCOUNT);
  return undefined;
}

export async function deleteProfileImage(): Promise<UpdateProfileImageResult | undefined> {
  const consumer = await getCurrentConsumer();
  if (!consumer) {
    return { errorCode: 'unauthorized' };
  }

  const avatarPath =
    typeof consumer.user_metadata.avatarPath === 'string'
      ? consumer.user_metadata.avatarPath
      : null;

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.updateUser({ data: { avatarPath: null } });
  if (error) {
    return { errorCode: 'unexpected_error' };
  }

  if (avatarPath) {
    await createServiceRoleClient()
      .storage.from(STORAGE_BUCKETS.ORDER_UPLOADS)
      .remove([avatarPath]);
  }

  revalidatePath(CONSUMER_ROUTES.ACCOUNT);
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

  const isDeleted = await deleteConsumerAndData(consumer.id);
  if (!isDeleted) {
    return { errorCode: 'unexpected_error' };
  }

  const pairToken = consumer.app_metadata[TEST_ACCOUNT.PAIR_TOKEN_METADATA_KEY];
  if (
    consumer.app_metadata[TEST_ACCOUNT.IS_TEST_ACCOUNT_METADATA_KEY] === true &&
    typeof pairToken === 'string'
  ) {
    await deletePairedTestAdmin(pairToken);
  }

  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  redirect('/');
}
