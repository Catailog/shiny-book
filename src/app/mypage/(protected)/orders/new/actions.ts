'use server';

import { redirect } from 'next/navigation';

import { FILE_UPLOAD_KIND } from '@/constants/file-upload';
import { ORDER_STATUS } from '@/constants/order-status';
import { PRICING } from '@/constants/pricing';
import { getCurrentConsumer } from '@/lib/auth/get-current-consumer';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

import { type CreateConsumerOrderInput, createConsumerOrderSchema } from './order-schema';

export interface CreateConsumerOrderResult {
  errorCode: 'unauthorized' | 'validation_failed' | 'unexpected_error';
}

export async function createConsumerOrder(
  input: CreateConsumerOrderInput,
): Promise<CreateConsumerOrderResult | undefined> {
  const consumer = await getCurrentConsumer();
  if (!consumer) {
    return { errorCode: 'unauthorized' };
  }

  const parsed = createConsumerOrderSchema.safeParse(input);
  if (!parsed.success) {
    return { errorCode: 'validation_failed' };
  }

  const isOwnManuscript = parsed.data.manuscriptPath.startsWith(
    `${consumer.id}/${FILE_UPLOAD_KIND.MANUSCRIPT}/`,
  );
  const isOwnCover = parsed.data.coverPath.startsWith(`${consumer.id}/${FILE_UPLOAD_KIND.COVER}/`);
  if (!isOwnManuscript || !isOwnCover) {
    return { errorCode: 'validation_failed' };
  }

  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from('orders')
    .insert({
      consumer_id: consumer.id,
      status: ORDER_STATUS.AWAITING_PAYMENT,
      title: parsed.data.title,
      manuscript_file_url: parsed.data.manuscriptPath,
      cover_file_url: parsed.data.coverPath,
      quantity: parsed.data.quantity,
      amount: parsed.data.quantity * PRICING.BOOK_UNIT_PRICE_KRW,
    })
    .select('id')
    .single();

  if (error || !data) {
    return { errorCode: 'unexpected_error' };
  }

  redirect(`/checkout/${data.id}`);
}
