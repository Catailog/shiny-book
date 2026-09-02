import 'server-only';

import { type OrderEventSource, type OrderEventType } from '@/constants/order-event';
import type { OrderStatus } from '@/constants/order-status';
import { logger } from '@/lib/log/logger';
import { createServiceRoleClient } from '@/lib/supabase/service-role';
import { parseOrderEventMetadata } from '@/schemas/order-event';

interface RecordOrderEventInput {
  orderId: string;
  eventType: OrderEventType;
  source: OrderEventSource;
  actor?: string;
  fromStatus?: OrderStatus | null;
  toStatus?: OrderStatus | null;
  reason?: string;
  metadata?: unknown;
}

// Append one row to the order_events audit trail. Best-effort: a failed audit
// write is logged, never thrown - it must not roll back the business operation
// that triggered it. `orders.status` remains the source of truth for current
// state; this table is history.
export async function recordOrderEvent(input: RecordOrderEventInput): Promise<void> {
  const metadata = parseOrderEventMetadata(input.eventType, input.metadata);
  if (metadata === null) {
    logger.warn(
      {
        event: 'order_event.metadata_invalid',
        orderId: input.orderId,
        eventType: input.eventType,
      },
      'order event metadata did not match its schema; storing empty metadata',
    );
  }

  const supabase = createServiceRoleClient();
  const { error } = await supabase.from('order_events').insert({
    order_id: input.orderId,
    event_type: input.eventType,
    source: input.source,
    ...(input.actor === undefined ? {} : { actor: input.actor }),
    from_status: input.fromStatus ?? null,
    to_status: input.toStatus ?? null,
    reason: input.reason ?? null,
    metadata: metadata ?? {},
  });

  if (error) {
    logger.error(
      {
        event: 'order_event.insert_failed',
        orderId: input.orderId,
        eventType: input.eventType,
        err: { message: error.message, code: error.code },
      },
      'failed to append order event',
    );
  }
}
