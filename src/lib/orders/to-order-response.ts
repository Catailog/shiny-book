import { isOrderStatus } from '@/constants/order-status';
import type { Tables } from '@/lib/db/database.types';
import type { OrderResponse } from '@/schemas/api/orders';

export function toOrderResponse(order: Tables<'orders'>): OrderResponse | null {
  if (!isOrderStatus(order.status)) {
    return null;
  }

  return {
    id: order.id,
    status: order.status,
    title: order.title,
    manuscriptFileUrl: order.manuscript_file_url,
    coverFileUrl: order.cover_file_url,
    quantity: order.quantity,
    createdAt: order.created_at,
    updatedAt: order.updated_at,
  };
}
