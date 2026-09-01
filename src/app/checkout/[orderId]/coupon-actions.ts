'use server';

import { revalidatePath } from 'next/cache';

import { z } from 'zod';

import { COUPON_CODE_MAX_LENGTH } from '@/constants/coupon';
import { ORDER_STATUS } from '@/constants/order-status';
import { PRICING } from '@/constants/pricing';
import { getCurrentConsumer } from '@/lib/auth/get-current-consumer';
import { validateCoupon } from '@/lib/coupons/redeem-coupon';
import { calculateShippingFee } from '@/lib/orders/calculate-shipping-fee';
import { getOrderById } from '@/lib/orders/get-order-by-id';
import { getProductById } from '@/lib/products/get-product-by-id';
import { checkAuthActionRateLimit } from '@/lib/rate-limit/auth-action-rate-limit';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

const applyCouponSchema = z.object({
  code: z.string().min(1).max(COUPON_CODE_MAX_LENGTH),
});

export interface ApplyCouponResult {
  errorCode:
    | 'validation_failed'
    | 'not_found'
    | 'already_applied'
    | 'coupon_invalid'
    | 'rate_limited'
    | 'unexpected_error';
}

export async function applyCouponToOrder(
  orderId: string,
  input: { code: string },
): Promise<ApplyCouponResult | undefined> {
  const parsed = applyCouponSchema.safeParse(input);
  if (!parsed.success) {
    return { errorCode: 'validation_failed' };
  }

  const consumer = await getCurrentConsumer();
  if (!consumer) {
    return { errorCode: 'not_found' };
  }

  const order = await getOrderById(orderId);
  if (
    !order ||
    order.consumer_id !== consumer.id ||
    order.status !== ORDER_STATUS.AWAITING_PAYMENT
  ) {
    return { errorCode: 'not_found' };
  }

  if (order.coupon_id) {
    return { errorCode: 'already_applied' };
  }

  const rateLimit = await checkAuthActionRateLimit(
    `coupon-apply:consumer:${consumer.id}`,
    `coupon-apply:code:${parsed.data.code.trim().toUpperCase()}`,
  );
  if (!rateLimit.isAllowed) {
    return { errorCode: 'rate_limited' };
  }

  if (!order.product_id || order.ship_postal_code === null || order.page_count === null) {
    return { errorCode: 'unexpected_error' };
  }

  const product = await getProductById(order.product_id);
  if (!product) {
    return { errorCode: 'unexpected_error' };
  }

  const merchandiseAmount =
    (product.price + order.page_count * PRICING.PRICE_PER_PAGE_KRW) * order.quantity;

  const validation = await validateCoupon(parsed.data.code.trim().toUpperCase(), merchandiseAmount);
  if (validation.outcome !== 'valid') {
    return { errorCode: 'coupon_invalid' };
  }

  const shippingFee = calculateShippingFee(order.ship_postal_code, merchandiseAmount);
  const amount = validation.discountedAmount + shippingFee;

  const supabase = createServiceRoleClient();
  const { error } = await supabase
    .from('orders')
    .update({ coupon_id: validation.coupon.id, amount })
    .eq('id', orderId)
    .is('coupon_id', null);

  if (error) {
    return { errorCode: 'unexpected_error' };
  }

  revalidatePath(`/checkout/${orderId}`);
  return undefined;
}
