'use server';

import { redirect } from 'next/navigation';

import { ORDER_STATUS } from '@/constants/order-status';
import { getAddressById } from '@/lib/addresses/get-address-by-id';
import { getCurrentConsumer } from '@/lib/auth/get-current-consumer';
import { validateCoupon } from '@/lib/coupons/redeem-coupon';
import { calculateOrderAmount } from '@/lib/orders/calculate-order-amount';
import { getProductById } from '@/lib/products/get-product-by-id';
import { createServiceRoleClient } from '@/lib/supabase/service-role';
import { isValidOrderPhotoPath } from '@/lib/uploads/is-valid-order-photo-path';

import { type CreateConsumerOrderInput, createConsumerOrderSchema } from './order-schema';

export interface CreateConsumerOrderResult {
  errorCode:
    | 'unauthorized'
    | 'validation_failed'
    | 'product_not_found'
    | 'address_not_found'
    | 'coupon_invalid'
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

  const areValidPhotoPaths = parsed.data.photoPaths.every((path) =>
    isValidOrderPhotoPath(path, consumer.id),
  );
  if (!areValidPhotoPaths) {
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

  const { merchandiseAmount } = calculateOrderAmount({
    product,
    address,
    pageCount: parsed.data.pageCount,
    quantity: parsed.data.quantity,
  });
  const couponCode = parsed.data.couponCode?.trim().toUpperCase();

  let discountedMerchandiseAmount = merchandiseAmount;
  let couponId: string | null = null;

  if (couponCode) {
    const validation = await validateCoupon(couponCode, merchandiseAmount);
    if (validation.outcome !== 'valid') {
      return { errorCode: 'coupon_invalid' };
    }
    discountedMerchandiseAmount = validation.discountedAmount;
    couponId = validation.coupon.id;
  }

  const { amount } = calculateOrderAmount({
    product,
    address,
    pageCount: parsed.data.pageCount,
    quantity: parsed.data.quantity,
    discountedMerchandiseAmount,
  });

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
