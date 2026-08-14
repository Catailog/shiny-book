'use server';

import { redirect } from 'next/navigation';

import { FILE_UPLOAD_KIND } from '@/constants/file-upload';
import { ORDER_STATUS } from '@/constants/order-status';
import { PRICING } from '@/constants/pricing';
import { getCurrentConsumer } from '@/lib/auth/get-current-consumer';
import { redeemCoupon } from '@/lib/coupons/redeem-coupon';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

import { type CreateConsumerOrderInput, createConsumerOrderSchema } from './order-schema';

export interface CreateConsumerOrderResult {
  errorCode:
    | 'unauthorized'
    | 'validation_failed'
    | 'coupon_not_found'
    | 'coupon_inactive'
    | 'coupon_expired'
    | 'coupon_usage_limit_reached'
    | 'coupon_conflict'
    | 'unexpected_error';
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

  const baseAmount = parsed.data.quantity * PRICING.BOOK_UNIT_PRICE_KRW;
  const couponCode = parsed.data.couponCode?.trim().toUpperCase();

  let amount = baseAmount;
  let couponId: string | null = null;

  if (couponCode) {
    const redemption = await redeemCoupon(couponCode, baseAmount);
    switch (redemption.outcome) {
      case 'not_found':
        return { errorCode: 'coupon_not_found' };
      case 'inactive':
        return { errorCode: 'coupon_inactive' };
      case 'expired':
        return { errorCode: 'coupon_expired' };
      case 'usage_limit_reached':
        return { errorCode: 'coupon_usage_limit_reached' };
      case 'conflict':
        return { errorCode: 'coupon_conflict' };
      case 'redeemed':
        amount = redemption.discountedAmount;
        couponId = redemption.coupon.id;
        break;
    }
  }

  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from('orders')
    .insert({
      consumer_id: consumer.id,
      coupon_id: couponId,
      status: ORDER_STATUS.AWAITING_PAYMENT,
      title: parsed.data.title,
      manuscript_file_url: parsed.data.manuscriptPath,
      cover_file_url: parsed.data.coverPath,
      quantity: parsed.data.quantity,
      amount,
    })
    .select('id')
    .single();

  if (error || !data) {
    return { errorCode: 'unexpected_error' };
  }

  redirect(`/checkout/${data.id}`);
}
