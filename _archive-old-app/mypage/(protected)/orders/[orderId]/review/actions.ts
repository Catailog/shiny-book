'use server';

import { revalidatePath } from 'next/cache';

import { ORDER_STATUS } from '@/constants/order-status';
import { getCurrentConsumer } from '@/lib/auth/get-current-consumer';
import { getOrderById } from '@/lib/orders/get-order-by-id';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

import { type ReviewFormInput, reviewFormSchema } from './review-schema';

const UNIQUE_VIOLATION_CODE = '23505';

export interface CreateReviewResult {
  errorCode:
    | 'unauthorized'
    | 'not_completed'
    | 'already_reviewed'
    | 'validation_failed'
    | 'unexpected_error';
}

export async function createReview(
  orderId: string,
  input: ReviewFormInput,
): Promise<CreateReviewResult | undefined> {
  const consumer = await getCurrentConsumer();
  if (!consumer) {
    return { errorCode: 'unauthorized' };
  }

  const order = await getOrderById(orderId);
  if (!order || order.consumer_id !== consumer.id) {
    return { errorCode: 'unauthorized' };
  }

  if (order.status !== ORDER_STATUS.COMPLETED) {
    return { errorCode: 'not_completed' };
  }

  const parsed = reviewFormSchema.safeParse(input);
  if (!parsed.success) {
    return { errorCode: 'validation_failed' };
  }

  const supabase = createServiceRoleClient();
  const { error } = await supabase.from('reviews').insert({
    order_id: orderId,
    consumer_id: consumer.id,
    rating: parsed.data.rating,
    content: parsed.data.content,
  });

  if (error) {
    return {
      errorCode: error.code === UNIQUE_VIOLATION_CODE ? 'already_reviewed' : 'unexpected_error',
    };
  }

  revalidatePath(`/mypage/orders/${orderId}/review`);
  return undefined;
}
