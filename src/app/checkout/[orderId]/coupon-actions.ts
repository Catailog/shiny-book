'use server';

import { revalidatePath } from 'next/cache';

import { z } from 'zod';

import { COUPON_CODE_MAX_LENGTH } from '@/constants/coupon';
import { ORDER_STATUS } from '@/constants/order-status';
import { PRICING } from '@/constants/pricing';
import { getAddressById } from '@/lib/addresses/get-address-by-id';
import { redeemCoupon } from '@/lib/coupons/redeem-coupon';
import { calculateShippingFee } from '@/lib/orders/calculate-shipping-fee';
import { getOrderById } from '@/lib/orders/get-order-by-id';
import { getProductById } from '@/lib/products/get-product-by-id';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

const applyCouponSchema = z.object({
  code: z.string().min(1).max(COUPON_CODE_MAX_LENGTH),
});

export interface ApplyCouponResult {
  errorCode:
    | 'validation_failed'
    | 'not_found'
    | 'already_applied'
    | 'coupon_not_found'
    | 'coupon_inactive'
    | 'coupon_not_started'
    | 'coupon_expired'
    | 'coupon_usage_limit_reached'
    | 'coupon_conflict'
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

  const order = await getOrderById(orderId);
  if (!order || order.status !== ORDER_STATUS.AWAITING_PAYMENT) {
    return { errorCode: 'not_found' };
  }

  if (order.coupon_id) {
    return { errorCode: 'already_applied' };
  }

  if (!order.product_id || !order.address_id || order.page_count === null) {
    return { errorCode: 'unexpected_error' };
  }

  const [product, address] = await Promise.all([
    getProductById(order.product_id),
    getAddressById(order.address_id),
  ]);
  if (!product || !address) {
    return { errorCode: 'unexpected_error' };
  }

  const merchandiseAmount =
    (product.price + order.page_count * PRICING.PRICE_PER_PAGE_KRW) * order.quantity;

  const redemption = await redeemCoupon(parsed.data.code.trim().toUpperCase(), merchandiseAmount);
  switch (redemption.outcome) {
    case 'not_found':
      return { errorCode: 'coupon_not_found' };
    case 'inactive':
      return { errorCode: 'coupon_inactive' };
    case 'not_started':
      return { errorCode: 'coupon_not_started' };
    case 'expired':
      return { errorCode: 'coupon_expired' };
    case 'usage_limit_reached':
      return { errorCode: 'coupon_usage_limit_reached' };
    case 'conflict':
      return { errorCode: 'coupon_conflict' };
  }

  const shippingFee = calculateShippingFee(address.postal_code, merchandiseAmount);
  const amount = redemption.discountedAmount + shippingFee;

  const supabase = createServiceRoleClient();
  const { error } = await supabase
    .from('orders')
    .update({ coupon_id: redemption.coupon.id, amount })
    .eq('id', orderId)
    .is('coupon_id', null);

  if (error) {
    return { errorCode: 'unexpected_error' };
  }

  revalidatePath(`/checkout/${orderId}`);
  return undefined;
}
