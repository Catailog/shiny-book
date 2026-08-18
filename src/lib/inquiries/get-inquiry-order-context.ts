import 'server-only';

import { createServiceRoleClient } from '@/lib/supabase/service-role';

export interface InquiryOrderContext {
  id: string;
  title: string;
  productName: string | null;
  quantity: number;
  amount: number;
  status: string;
  createdAt: string;
}

export async function getInquiryOrderContext(orderId: string): Promise<InquiryOrderContext | null> {
  const supabase = createServiceRoleClient();
  const { data } = await supabase
    .from('orders')
    .select('id, title, quantity, amount, status, created_at, products(name)')
    .eq('id', orderId)
    .maybeSingle();

  if (!data) {
    return null;
  }

  const { products, ...order } = data;

  return {
    id: order.id,
    title: order.title,
    productName: products?.name ?? null,
    quantity: order.quantity,
    amount: order.amount,
    status: order.status,
    createdAt: order.created_at,
  } satisfies InquiryOrderContext;
}
