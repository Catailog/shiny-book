'use server';

import { redirect } from 'next/navigation';

import { ORDER_STATUS } from '@/constants/order-status';
import { getAddressById } from '@/lib/addresses/get-address-by-id';
import { getCurrentConsumer } from '@/lib/auth/get-current-consumer';
import { getCouponById } from '@/lib/coupons/get-coupon-by-id';
import { calculateDiscountedAmount, validateCoupon } from '@/lib/coupons/redeem-coupon';
import { calculateOrderAmount } from '@/lib/orders/calculate-order-amount';
import { getOrderById } from '@/lib/orders/get-order-by-id';
import { toShippingAddressSnapshot } from '@/lib/orders/shipping-address-snapshot';
import { getProductById } from '@/lib/products/get-product-by-id';
import { createServiceRoleClient } from '@/lib/supabase/service-role';
import { isValidOrderPhotoPath } from '@/lib/uploads/is-valid-order-photo-path';

import { type CreateConsumerOrderInput, createConsumerOrderSchema } from './order-schema';

export interface UpdateConsumerOrderResult {
  errorCode:
    | 'unauthorized'
    | 'validation_failed'
    | 'order_not_editable'
    | 'product_not_found'
    | 'address_not_found'
    | 'coupon_invalid'
    | 'unexpected_error';
}

export async function updateConsumerOrder(
  orderId: string,
  input: CreateConsumerOrderInput,
): Promise<UpdateConsumerOrderResult | undefined> {
  const consumer = await getCurrentConsumer();
  if (!consumer) {
    return { errorCode: 'unauthorized' };
  }

  const existingOrder = await getOrderById(orderId);
  if (
    !existingOrder ||
    existingOrder.consumer_id !== consumer.id ||
    existingOrder.status !== ORDER_STATUS.AWAITING_PAYMENT
  ) {
    return { errorCode: 'order_not_editable' };
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

  let discountedMerchandiseAmount = merchandiseAmount;
  let couponId = existingOrder.coupon_id;

  if (existingOrder.coupon_id) {
    const existingCoupon = await getCouponById(existingOrder.coupon_id);
    discountedMerchandiseAmount = existingCoupon
      ? calculateDiscountedAmount(merchandiseAmount, existingCoupon)
      : merchandiseAmount;
  } else {
    const couponCode = parsed.data.couponCode?.trim().toUpperCase();
    if (couponCode) {
      const validation = await validateCoupon(couponCode, merchandiseAmount);
      if (validation.outcome !== 'valid') {
        return { errorCode: 'coupon_invalid' };
      }
      discountedMerchandiseAmount = validation.discountedAmount;
      couponId = validation.coupon.id;
    }
  }

  const { amount } = calculateOrderAmount({
    product,
    address,
    pageCount: parsed.data.pageCount,
    quantity: parsed.data.quantity,
    discountedMerchandiseAmount,
  });

  const supabase = createServiceRoleClient();
  const { data: updatedOrder, error } = await supabase
    .from('orders')
    .update({
      address_id: address.id,
      ...toShippingAddressSnapshot(address),
      product_id: product.id,
      coupon_id: couponId,
      title: parsed.data.title,
      page_count: parsed.data.pageCount,
      quantity: parsed.data.quantity,
      amount,
    })
    .eq('id', orderId)
    .eq('consumer_id', consumer.id)
    .eq('status', ORDER_STATUS.AWAITING_PAYMENT)
    .select('id')
    .single();

  if (error || !updatedOrder) {
    return { errorCode: 'order_not_editable' };
  }

  const { error: deletePhotosError } = await supabase
    .from('order_photos')
    .delete()
    .eq('order_id', orderId);
  if (deletePhotosError) {
    return { errorCode: 'unexpected_error' };
  }

  const { error: photosError } = await supabase.from('order_photos').insert(
    parsed.data.photoPaths.map((path, index) => ({
      order_id: orderId,
      storage_path: path,
      display_order: index,
    })),
  );
  if (photosError) {
    return { errorCode: 'unexpected_error' };
  }

  redirect(`/checkout/${orderId}`);
}
