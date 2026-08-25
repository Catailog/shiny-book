'use server';

import { revalidatePath } from 'next/cache';

import { z } from 'zod';

import { INQUIRY_CONTENT_MAX_LENGTH, INQUIRY_MESSAGE_AUTHOR } from '@/constants/inquiry';
import { CONSUMER_ROUTES } from '@/constants/routes';
import { getCurrentConsumer } from '@/lib/auth/get-current-consumer';
import type { Tables } from '@/lib/db/database.types';
import {
  type InquiryMessagesPage,
  getInquiryMessagesPage,
} from '@/lib/inquiries/get-inquiry-messages-page';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

const replySchema = z.object({
  content: z.string().min(1).max(INQUIRY_CONTENT_MAX_LENGTH),
});

export type AddConsumerMessageResult =
  | { errorCode: 'unauthorized' | 'validation_failed' | 'not_found' | 'unexpected_error' }
  | { message: Tables<'inquiry_messages'> };

export async function addConsumerMessage(
  inquiryId: string,
  input: { content: string },
): Promise<AddConsumerMessageResult> {
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

  const { data: insertedMessage, error } = await supabase
    .from('inquiry_messages')
    .insert({
      inquiry_id: inquiryId,
      author_type: INQUIRY_MESSAGE_AUTHOR.CONSUMER,
      author_id: consumer.id,
      content: parsed.data.content,
    })
    .select()
    .single();

  if (error || !insertedMessage) {
    return { errorCode: 'unexpected_error' };
  }

  revalidatePath(`${CONSUMER_ROUTES.INQUIRIES}/${inquiryId}`);
  return { message: insertedMessage };
}

export async function loadOlderInquiryMessages(
  inquiryId: string,
  before: string,
): Promise<InquiryMessagesPage> {
  const emptyPage: InquiryMessagesPage = { messages: [], hasMore: false };
  const consumer = await getCurrentConsumer();
  if (!consumer) {
    return emptyPage;
  }

  const supabase = createServiceRoleClient();
  const { data: inquiry } = await supabase
    .from('inquiries')
    .select('consumer_id')
    .eq('id', inquiryId)
    .maybeSingle();

  if (!inquiry || inquiry.consumer_id !== consumer.id) {
    return emptyPage;
  }

  return getInquiryMessagesPage(inquiryId, { before });
}
