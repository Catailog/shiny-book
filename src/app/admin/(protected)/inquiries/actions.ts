'use server';

import { revalidatePath } from 'next/cache';

import { ADMIN_ROUTES } from '@/constants/routes';
import { getCurrentAdmin } from '@/lib/auth/get-current-admin';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

import { type AnswerFormInput, answerFormSchema } from './answer-schema';

export interface AnswerInquiryResult {
  errorCode: 'unauthorized' | 'validation_failed' | 'unexpected_error';
}

export async function answerInquiry(
  id: string,
  input: AnswerFormInput,
): Promise<AnswerInquiryResult | undefined> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return { errorCode: 'unauthorized' };
  }

  const parsed = answerFormSchema.safeParse(input);
  if (!parsed.success) {
    return { errorCode: 'validation_failed' };
  }

  const supabase = createServiceRoleClient();
  const { error } = await supabase
    .from('inquiries')
    .update({
      answer: parsed.data.answer,
      answered_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) {
    return { errorCode: 'unexpected_error' };
  }

  revalidatePath(ADMIN_ROUTES.INQUIRIES);
  revalidatePath(`${ADMIN_ROUTES.INQUIRIES}/${id}`);
  return undefined;
}
