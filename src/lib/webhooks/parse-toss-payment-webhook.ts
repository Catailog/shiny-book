export interface TossPaymentStatusChangedEvent {
  eventType: string;
  data: {
    paymentKey: string;
    orderId: string;
    status: string;
  };
}

export function parseTossPaymentWebhook(body: unknown): TossPaymentStatusChangedEvent | null {
  if (typeof body !== 'object' || body === null) {
    return null;
  }

  const record = body as Record<string, unknown>;
  if (
    typeof record.eventType !== 'string' ||
    typeof record.data !== 'object' ||
    record.data === null
  ) {
    return null;
  }

  const data = record.data as Record<string, unknown>;
  if (
    typeof data.paymentKey !== 'string' ||
    typeof data.orderId !== 'string' ||
    typeof data.status !== 'string'
  ) {
    return null;
  }

  return {
    eventType: record.eventType,
    data: {
      paymentKey: data.paymentKey,
      orderId: data.orderId,
      status: data.status,
    },
  };
}
