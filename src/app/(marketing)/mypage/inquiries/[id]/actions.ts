'use server';

import { revalidatePath } from 'next/cache';

import { z } from 'zod';

import { INQUIRY_CONTENT_MAX_LENGTH, INQUIRY_MESSAGE_AUTHOR } from '@/constants/inquiry';
import { CONSUMER_ROUTES } from '@/constants/routes';
import { getCurrentConsumer } from '@/lib/auth/get-current-consumer';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

const replySchema = z.object({
  content: z.string().min(1).max(INQUIRY_CONTENT_MAX_LENGTH),
});

export interface AddConsumerMessageResult {
  errorCode: 'unauthorized' | 'validation_failed' | 'not_found' | 'unexpected_error';
}

export async function addConsumerMessage(
  inquiryId: string,
  input: { content: string },
): Promise<AddConsumerMessageResult | undefined> {
  const consumer = await getCurrentConsumer();
  if (!consumer) {
    return { errorCode: 'unauthorized' };
  }

  const parsed = replySchema.safeParse(input);
  if (!parsed.success) {
    return { errorCode: 'validation_failed' };
  }

  const supabase = createServiceRoleClient();
  const { data: inquiry } = await supabase
    .from('inquiries')
    .select('consumer_id')
    .eq('id', inquiryId)
    .maybeSingle();

  if (!inquiry || inquiry.consumer_id !== consumer.id) {
    return { errorCode: 'not_found' };
  }

  const { error } = await supabase.from('inquiry_messages').insert({
    inquiry_id: inquiryId,
    author_type: INQUIRY_MESSAGE_AUTHOR.CONSUMER,
    author_id: consumer.id,
    content: parsed.data.content,
  });

  if (error) {
    return { errorCode: 'unexpected_error' };
  }

  revalidatePath(`${CONSUMER_ROUTES.INQUIRIES}/${inquiryId}`);
  return undefined;
}
