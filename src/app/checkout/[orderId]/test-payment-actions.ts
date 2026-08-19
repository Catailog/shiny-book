'use server';

import { redirect } from 'next/navigation';

import { ORDER_STATUS, isOrderStatus } from '@/constants/order-status';
import { transitionOrderStatus } from '@/lib/orders/transition-order-status';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

const TEST_PAYMENT_KEY = 'test-payment';

export async function confirmTestPayment(orderId: string): Promise<{ success: false } | undefined> {
  const supabase = createServiceRoleClient();
  const { data: order } = await supabase.from('orders').select().eq('id', orderId).maybeSingle();

  if (!order || !isOrderStatus(order.status)) {
    return { success: false };
  }

  await transitionOrderStatus(orderId, order.status, ORDER_STATUS.PAID);

  redirect(`/checkout/${orderId}/success?paymentKey=${TEST_PAYMENT_KEY}&amount=${order.amount}`);
}
