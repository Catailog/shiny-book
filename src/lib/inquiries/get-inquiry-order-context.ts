import 'server-only';

import { createServiceRoleClient } from '@/lib/supabase/service-role';

export interface InquiryOrderCoupon {
  code: string;
  discountType: string;
  discountValue: number;
}

export interface InquiryOrderContext {
  id: string;
  title: string;
  productName: string | null;
  quantity: number;
  amount: number;
  status: string;
  createdAt: string;
  coupon: InquiryOrderCoupon | null;
}

export async function getInquiryOrderContext(orderId: string): Promise<InquiryOrderContext | null> {
  const supabase = createServiceRoleClient();
  const { data } = await supabase
    .from('orders')
    .select(
      'id, title, quantity, amount, status, created_at, products(name), coupons(code, discount_type, discount_value)',
    )
    .eq('id', orderId)
    .maybeSingle();

  if (!data) {
    return null;
  }

  const { products, coupons, ...order } = data;

  return {
    id: order.id,
    title: order.title,
    productName: products?.name ?? null,
    quantity: order.quantity,
    amount: order.amount,
    status: order.status,
    createdAt: order.created_at,
    coupon: coupons
      ? {
          code: coupons.code,
          discountType: coupons.discount_type,
          discountValue: coupons.discount_value,
        }
      : null,
  } satisfies InquiryOrderContext;
}
