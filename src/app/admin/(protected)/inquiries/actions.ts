'use server';

import { revalidatePath } from 'next/cache';

import { z } from 'zod';

import { INQUIRY_ANSWER_MAX_LENGTH, INQUIRY_MESSAGE_AUTHOR } from '@/constants/inquiry';
import { ADMIN_ROUTES } from '@/constants/routes';
import { getCurrentAdmin } from '@/lib/auth/get-current-admin';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

const messageSchema = z.object({
  content: z.string().min(1).max(INQUIRY_ANSWER_MAX_LENGTH),
});

export interface InquiryMessageActionResult {
  errorCode: 'unauthorized' | 'validation_failed' | 'not_found' | 'unexpected_error';
}

export async function addAdminMessage(
  inquiryId: string,
  input: { content: string },
): Promise<InquiryMessageActionResult | undefined> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return { errorCode: 'unauthorized' };
  }

  const parsed = messageSchema.safeParse(input);
  if (!parsed.success) {
    return { errorCode: 'validation_failed' };
  }

  const supabase = createServiceRoleClient();
  const { error } = await supabase.from('inquiry_messages').insert({
    inquiry_id: inquiryId,
    author_type: INQUIRY_MESSAGE_AUTHOR.ADMIN,
    author_id: admin.id,
    content: parsed.data.content,
  });

  if (error) {
    return { errorCode: 'unexpected_error' };
  }

  await supabase
    .from('inquiries')
    .update({ answered_at: new Date().toISOString(), updated_at: new Date().toISOString() })
    .eq('id', inquiryId)
    .is('answered_at', null);

  revalidatePath(ADMIN_ROUTES.INQUIRIES);
  revalidatePath(`${ADMIN_ROUTES.INQUIRIES}/${inquiryId}`);
  return undefined;
}

export async function updateAdminMessage(
  messageId: string,
  inquiryId: string,
  input: { content: string },
): Promise<InquiryMessageActionResult | undefined> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return { errorCode: 'unauthorized' };
  }

  const parsed = messageSchema.safeParse(input);
  if (!parsed.success) {
    return { errorCode: 'validation_failed' };
  }

  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from('inquiry_messages')
    .update({ content: parsed.data.content, updated_at: new Date().toISOString() })
    .eq('id', messageId)
    .eq('author_type', INQUIRY_MESSAGE_AUTHOR.ADMIN)
    .eq('author_id', admin.id)
    .select('id')
    .maybeSingle();

  if (error || !data) {
    return { errorCode: 'not_found' };
  }

  revalidatePath(`${ADMIN_ROUTES.INQUIRIES}/${inquiryId}`);
  return undefined;
}

export async function deleteAdminMessage(
  messageId: string,
  inquiryId: string,
): Promise<InquiryMessageActionResult | undefined> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return { errorCode: 'unauthorized' };
  }

  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from('inquiry_messages')
    .delete()
    .eq('id', messageId)
    .eq('author_type', INQUIRY_MESSAGE_AUTHOR.ADMIN)
    .eq('author_id', admin.id)
    .select('id')
    .maybeSingle();

  if (error || !data) {
    return { errorCode: 'not_found' };
  }

  revalidatePath(`${ADMIN_ROUTES.INQUIRIES}/${inquiryId}`);
  return undefined;
}
