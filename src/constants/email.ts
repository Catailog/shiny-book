import { ORDER_STATUS, type OrderStatus } from '@/constants/order-status';
import { CONSUMER_ROUTES } from '@/constants/routes';
import { TEST_ACCOUNT } from '@/constants/test-account';

export const EMAIL_FROM_ADDRESS = 'noreply@shinybook.catailog.dev';
export const EMAIL_FROM_NAME = 'Shiny Book';
export const EMAIL_SENDER = `${EMAIL_FROM_NAME} <${EMAIL_FROM_ADDRESS}>`;

// `to_status` values that trigger a consumer notification email. `binding` is an
// internal step and `awaiting_payment` has no email, so both are absent.
// `cancelled` is listed but only notifies when it did not come straight from
// `awaiting_payment` (see the sender's transition check).
export const ORDER_STATUS_NOTIFY_STATUSES = [
  ORDER_STATUS.PAID,
  ORDER_STATUS.PRINTING,
  ORDER_STATUS.SHIPPING,
  ORDER_STATUS.COMPLETED,
  ORDER_STATUS.REFUNDED,
  ORDER_STATUS.CANCELLED,
] as const satisfies readonly OrderStatus[];

export type OrderNotifyStatus = (typeof ORDER_STATUS_NOTIFY_STATUSES)[number];

export function isOrderNotifyStatus(status: OrderStatus): status is OrderNotifyStatus {
  return ORDER_STATUS_NOTIFY_STATUSES.some((notifyStatus) => notifyStatus === status);
}

// Recipients on these domains are skipped (internal and test-only addresses).
export const EMAIL_BLOCKED_RECIPIENT_DOMAINS: readonly string[] = [
  'catailog.com',
  TEST_ACCOUNT.EMAIL_DOMAIN,
];

export function buildOrderDetailUrl(baseUrl: string, orderId: string): string {
  return `${baseUrl.replace(/\/+$/, '')}${CONSUMER_ROUTES.ORDERS}/${orderId}`;
}
