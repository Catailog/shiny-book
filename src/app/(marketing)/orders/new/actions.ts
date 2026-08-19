'use server';

import { redirect } from 'next/navigation';

import { FILE_UPLOAD_KIND } from '@/constants/file-upload';
import { ORDER_STATUS } from '@/constants/order-status';
import { PRICING } from '@/constants/pricing';
import { getAddressById } from '@/lib/addresses/get-address-by-id';
import { getCurrentConsumer } from '@/lib/auth/get-current-consumer';
import { redeemCoupon } from '@/lib/coupons/redeem-coupon';
import { calculateShippingFee } from '@/lib/orders/calculate-shipping-fee';
import { getProductById } from '@/lib/products/get-product-by-id';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

import { type CreateConsumerOrderInput, createConsumerOrderSchema } from './order-schema';

export interface CreateConsumerOrderResult {
  errorCode:
    | 'unauthorized'
    | 'validation_failed'
    | 'product_not_found'
    | 'address_not_found'
    | 'coupon_not_found'
    | 'coupon_inactive'
    | 'coupon_not_started'
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

  const areOwnPhotos = parsed.data.photoPaths.every((path) =>
    path.startsWith(`${consumer.id}/${FILE_UPLOAD_KIND.PHOTO}/`),
  );
  if (!areOwnPhotos) {
    return { errorCode: 'validation_failed' };
  }

  const product = await getProductById(parsed.data.productId);
  if (!product) {
    return { errorCode: 'product_not_found' };
  }

  const address = await getAddressById(parsed.data.addressId);
  if (!address || address.consumer_id !== consumer.id) {
    return { errorCode: 'address_not_found' };
  }

  const merchandiseAmount =
    (product.price + parsed.data.pageCount * PRICING.PRICE_PER_PAGE_KRW) * parsed.data.quantity;
  const couponCode = parsed.data.couponCode?.trim().toUpperCase();

  let discountedMerchandiseAmount = merchandiseAmount;
  let couponId: string | null = null;

  if (couponCode) {
    const redemption = await redeemCoupon(couponCode, merchandiseAmount);
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
      case 'redeemed':
        discountedMerchandiseAmount = redemption.discountedAmount;
        couponId = redemption.coupon.id;
        break;
    }
  }

  const shippingFee = calculateShippingFee(address.postal_code, merchandiseAmount);
  const amount = discountedMerchandiseAmount + shippingFee;

  const supabase = createServiceRoleClient();
  const { data: order, error } = await supabase
    .from('orders')
    .insert({
      consumer_id: consumer.id,
      coupon_id: couponId,
      address_id: address.id,
      product_id: product.id,
      status: ORDER_STATUS.AWAITING_PAYMENT,
      title: parsed.data.title,
      manuscript_file_url: null,
      cover_file_url: null,
      page_count: parsed.data.pageCount,
      quantity: parsed.data.quantity,
      amount,
    })
    .select('id')
    .single();

  if (error || !order) {
    return { errorCode: 'unexpected_error' };
  }

  const { error: photosError } = await supabase.from('order_photos').insert(
    parsed.data.photoPaths.map((path, index) => ({
      order_id: order.id,
      storage_path: path,
      display_order: index,
    })),
  );

  if (photosError) {
    return { errorCode: 'unexpected_error' };
  }

  redirect(`/checkout/${order.id}`);
}
