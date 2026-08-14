'use server';

import { revalidatePath } from 'next/cache';

import { ADMIN_ROUTES } from '@/constants/routes';
import { getCurrentAdmin } from '@/lib/auth/get-current-admin';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

import { type FaqFormInput, faqFormSchema } from './faq-schema';

export interface FaqActionResult {
  errorCode: 'unauthorized' | 'validation_failed' | 'unexpected_error';
}

export async function createFaq(input: FaqFormInput): Promise<FaqActionResult | undefined> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return { errorCode: 'unauthorized' };
  }

  const parsed = faqFormSchema.safeParse(input);
  if (!parsed.success) {
    return { errorCode: 'validation_failed' };
  }

  const supabase = createServiceRoleClient();
  const { error } = await supabase.from('faqs').insert({
    question: parsed.data.question,
    answer: parsed.data.answer,
  });

  if (error) {
    return { errorCode: 'unexpected_error' };
  }

  revalidatePath(ADMIN_ROUTES.FAQS);
  return undefined;
}

export async function updateFaq(
  id: string,
  input: FaqFormInput,
): Promise<FaqActionResult | undefined> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return { errorCode: 'unauthorized' };
  }

  const parsed = faqFormSchema.safeParse(input);
  if (!parsed.success) {
    return { errorCode: 'validation_failed' };
  }

  const supabase = createServiceRoleClient();
  const { error } = await supabase
    .from('faqs')
    .update({
      question: parsed.data.question,
      answer: parsed.data.answer,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) {
    return { errorCode: 'unexpected_error' };
  }

  revalidatePath(ADMIN_ROUTES.FAQS);
  return undefined;
}
