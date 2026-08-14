'use server';

import { redirect } from 'next/navigation';

import { CONSUMER_ROUTES } from '@/constants/routes';
import { createServerSupabaseClient } from '@/lib/supabase/server-client';

import { type ConsumerSignupInput, consumerSignupSchema } from './signup-schema';

export interface ConsumerSignupResult {
  errorCode: 'email_taken' | 'unexpected_error';
}

const EMAIL_TAKEN_CODES = new Set(['user_already_exists', 'email_exists']);

export async function signUpConsumer(
  input: ConsumerSignupInput,
): Promise<ConsumerSignupResult | undefined> {
  const parsed = consumerSignupSchema.safeParse(input);
  if (!parsed.success) {
    return { errorCode: 'unexpected_error' };
  }

  const supabase = await createServerSupabaseClient();

  try {
    const { data, error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
    });

    if (error) {
      return {
        errorCode: EMAIL_TAKEN_CODES.has(error.code ?? '') ? 'email_taken' : 'unexpected_error',
      };
    }

    if (!data.session) {
      return { errorCode: 'email_taken' };
    }
  } catch {
    return { errorCode: 'unexpected_error' };
  }

  redirect(CONSUMER_ROUTES.MYPAGE);
}
