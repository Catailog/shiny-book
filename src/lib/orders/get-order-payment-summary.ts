import 'server-only';

import { PRICING } from '@/constants/pricing';
import { calculateShippingFee } from '@/lib/orders/calculate-shipping-fee';
import { getOrderById } from '@/lib/orders/get-order-by-id';
import { getProductById } from '@/lib/products/get-product-by-id';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

export interface OrderPaymentSummary {
  merchandiseAmount: number;
  shippingFee: number;
  discountAmount: number;
  couponCode: string | null;
  finalAmount: number;
}

export async function getOrderPaymentSummary(orderId: string): Promise<OrderPaymentSummary | null> {
  const order = await getOrderById(orderId);
  if (!order || !order.product_id || order.ship_postal_code === null || order.page_count === null) {
    return null;
  }

  const product = await getProductById(order.product_id);
  if (!product) {
    return null;
  }

  const merchandiseAmount =
    (product.price + order.page_count * PRICING.PRICE_PER_PAGE_KRW) * order.quantity;
  const shippingFee = calculateShippingFee(order.ship_postal_code, merchandiseAmount);

  let couponCode: string | null = null;
  if (order.coupon_id) {
    const supabase = createServiceRoleClient();
    const { data: coupon } = await supabase
      .from('coupons')
      .select('code')
      .eq('id', order.coupon_id)
      .maybeSingle();
    couponCode = coupon?.code ?? null;
  }

  const discountAmount = Math.max(merchandiseAmount + shippingFee - order.amount, 0);

  return {
    merchandiseAmount,
    shippingFee,
    discountAmount,
    couponCode,
    finalAmount: order.amount,
  };
}
