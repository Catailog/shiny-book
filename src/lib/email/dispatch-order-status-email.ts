import { waitUntil } from '@vercel/functions';
import 'server-only';

import type { OrderStatus } from '@/constants/order-status';
import type { Tables } from '@/lib/db/database.types';
import { sendOrderStatusEmail } from '@/lib/email/send-order-status-email';

interface DispatchOrderStatusEmailInput {
  order: Pick<Tables<'orders'>, 'id' | 'consumer_id'>;
  fromStatus: OrderStatus;
  toStatus: OrderStatus;
  isRevert?: boolean;
}

// Fire-and-forget so a slow or failing email provider never delays or fails the
// order transition. `sendOrderStatusEmail` is internally best-effort and decides
// whether this particular transition warrants a message.
export function dispatchOrderStatusEmail(input: DispatchOrderStatusEmailInput): void {
  waitUntil(sendOrderStatusEmail(input));
}
