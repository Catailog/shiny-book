'use server';

import { redirect } from 'next/navigation';

import { INQUIRY_CATEGORY } from '@/constants/inquiry-category';
import { getCurrentConsumer } from '@/lib/auth/get-current-consumer';
import { getOrderById } from '@/lib/orders/get-order-by-id';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

import { type InquiryFormInput, inquiryFormSchema } from './inquiry-schema';

export interface CreateInquiryResult {
  errorCode: 'unauthorized' | 'validation_failed' | 'unexpected_error';
}

export async function createInquiry(
  input: InquiryFormInput,
): Promise<CreateInquiryResult | undefined> {
  const consumer = await getCurrentConsumer();
  if (!consumer) {
    return { errorCode: 'unauthorized' };
  }

  const parsed = inquiryFormSchema.safeParse(input);
  if (!parsed.success) {
    return { errorCode: 'validation_failed' };
  }

  let orderId: string | null = null;
  if (parsed.data.category === INQUIRY_CATEGORY.ORDER && parsed.data.orderId) {
    const order = await getOrderById(parsed.data.orderId);
    if (!order || order.consumer_id !== consumer.id) {
      return { errorCode: 'validation_failed' };
    }
    orderId = order.id;
  }

  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from('inquiries')
    .insert({
      consumer_id: consumer.id,
      category: parsed.data.category,
      order_id: orderId,
      title: parsed.data.title,
      content: parsed.data.content,
    })
    .select('id')
    .single();

  if (error || !data) {
    return { errorCode: 'unexpected_error' };
  }

  redirect(`/mypage/inquiries/${data.id}`);
}
