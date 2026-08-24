import 'server-only';

import { ORDER_STATUS } from '@/constants/order-status';
import { getOrderPhotosByOrder } from '@/lib/order-photos/get-order-photos-by-order';
import { getOrderById } from '@/lib/orders/get-order-by-id';
import { getSignedOrderPhotoUrl } from '@/lib/uploads/get-signed-order-photo-url';

export interface OrderEditPrefillPhoto {
  path: string;
  previewUrl: string | null;
}

export interface OrderEditPrefill {
  orderId: string;
  productId: string;
  title: string;
  quantity: number;
  pageCount: number;
  addressId: string;
  couponApplied: boolean;
  photos: OrderEditPrefillPhoto[];
}

export async function getOrderEditPrefill(
  orderId: string,
  consumerId: string,
): Promise<OrderEditPrefill | null> {
  const order = await getOrderById(orderId);

  if (
    !order ||
    order.consumer_id !== consumerId ||
    order.status !== ORDER_STATUS.AWAITING_PAYMENT ||
    !order.product_id ||
    !order.address_id ||
    !order.page_count
  ) {
    return null;
  }

  const orderPhotos = await getOrderPhotosByOrder(order.id);
  const photos = await Promise.all(
    orderPhotos.map(async (photo) => ({
      path: photo.storage_path,
      previewUrl: await getSignedOrderPhotoUrl(photo.storage_path),
    })),
  );

  return {
    orderId: order.id,
    productId: order.product_id,
    title: order.title,
    quantity: order.quantity,
    pageCount: order.page_count,
    addressId: order.address_id,
    couponApplied: order.coupon_id !== null,
    photos,
  };
}
