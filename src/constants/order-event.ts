export const ORDER_EVENT_TYPE = {
  ORDER_CREATED: 'order.created',
  ORDER_STATUS_CHANGED: 'order.status_changed',
  WEBHOOK_RECEIVED: 'webhook.received',
  NOTIFICATION_SENT: 'notification.sent',
  ADMIN_NOTE: 'admin.note',
  REFUND_COMPLETED: 'refund.completed',
} as const;

export type OrderEventType = (typeof ORDER_EVENT_TYPE)[keyof typeof ORDER_EVENT_TYPE];

const ORDER_EVENT_TYPE_VALUES: readonly OrderEventType[] = Object.values(ORDER_EVENT_TYPE);

export function isOrderEventType(value: string): value is OrderEventType {
  return ORDER_EVENT_TYPE_VALUES.some((type) => type === value);
}

export const ORDER_EVENT_SOURCE = {
  CONSUMER: 'consumer',
  ADMIN: 'admin',
  SYSTEM: 'system',
  WEBHOOK: 'webhook',
} as const;

export type OrderEventSource = (typeof ORDER_EVENT_SOURCE)[keyof typeof ORDER_EVENT_SOURCE];

const ORDER_EVENT_SOURCE_VALUES: readonly OrderEventSource[] = Object.values(ORDER_EVENT_SOURCE);

export function isOrderEventSource(value: string): value is OrderEventSource {
  return ORDER_EVENT_SOURCE_VALUES.some((source) => source === value);
}
