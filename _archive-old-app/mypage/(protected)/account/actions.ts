'use server';

import { getCurrentConsumer } from '@/lib/auth/get-current-consumer';
import { createServerSupabaseClient } from '@/lib/supabase/server-client';

import { type ChangePasswordInput, changePasswordSchema } from './account-schema';

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

  try {
    const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
    if (error) {
      return { errorCode: 'unexpected_error' };
    }
  } catch {
    return { errorCode: 'unexpected_error' };
  }

  return undefined;
}
