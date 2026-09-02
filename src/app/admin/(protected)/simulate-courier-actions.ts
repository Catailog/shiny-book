'use server';

import { revalidatePath } from 'next/cache';

import { ORDER_EVENT_SOURCE, ORDER_EVENT_TYPE } from '@/constants/order-event';
import { ORDER_STATUS } from '@/constants/order-status';
import { ADMIN_ROUTES } from '@/constants/routes';
import {
  SHIPMENT_JOB_STATUS,
  type ShipmentJobStatus,
  isShipmentJobStatus,
} from '@/constants/shipment-job-status';
import { env } from '@/env';
import { getCurrentAdmin } from '@/lib/auth/get-current-admin';
import { getOrderById } from '@/lib/orders/get-order-by-id';
import { recordOrderEvent } from '@/lib/orders/record-order-event';
import { transitionOrderStatus } from '@/lib/orders/transition-order-status';
import { createServiceRoleClient } from '@/lib/supabase/service-role';
import { generateTrackingNumber } from '@/lib/vendors/generate-tracking-number';

const SIM_ACTOR = 'dev:courier-sim';

export type SimulateShipmentErrorCode =
  'disabled' | 'unauthorized' | 'not_found' | 'not_shippable' | 'already_delivered' | 'failed';

export interface SimulateShipmentResult {
  errorCode?: SimulateShipmentErrorCode;
  status?: ShipmentJobStatus;
}

// Dev-only helper: play one step of the courier's job. First call creates the
// shipment (received); later calls advance received -> in_transit -> delivered.
// It only runs while the order is actually at the shipping stage - binding (a
// courier can pick up) or shipping (already handed over) - so it cannot fabricate
// a shipment for an order that is still in production or already closed. The
// production gate and the stage gate both live here on the server, not in the
// button's visibility.
export async function advanceCourierSimulation(orderId: string): Promise<SimulateShipmentResult> {
  if (env.NODE_ENV === 'production') {
    return { errorCode: 'disabled' };
  }

  const admin = await getCurrentAdmin();
  if (!admin) {
    return { errorCode: 'unauthorized' };
  }

  const order = await getOrderById(orderId);
  if (!order) {
    return { errorCode: 'not_found' };
  }

  const supabase = createServiceRoleClient();
  const { data: existing } = await supabase
    .from('shipment_jobs')
    .select()
    .eq('order_id', orderId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!existing) {
    if (order.status !== ORDER_STATUS.BINDING && order.status !== ORDER_STATUS.SHIPPING) {
      return { errorCode: 'not_shippable' };
    }

    const trackingNumber = generateTrackingNumber();
    const { error } = await supabase.from('shipment_jobs').insert({
      order_id: orderId,
      status: SHIPMENT_JOB_STATUS.RECEIVED,
      tracking_number: trackingNumber,
    });

    if (error) {
      return { errorCode: 'failed' };
    }

    if (order.status === ORDER_STATUS.BINDING) {
      await transitionOrderStatus(orderId, ORDER_STATUS.BINDING, ORDER_STATUS.SHIPPING, {
        source: ORDER_EVENT_SOURCE.WEBHOOK,
        actor: SIM_ACTOR,
        metadata: { trackingNumber },
      });
    }
    await recordSimEvent(orderId, SHIPMENT_JOB_STATUS.RECEIVED);
    revalidatePath(ADMIN_ROUTES.DASHBOARD);
    return { status: SHIPMENT_JOB_STATUS.RECEIVED };
  }

  if (!isShipmentJobStatus(existing.status) || existing.status === SHIPMENT_JOB_STATUS.DELIVERED) {
    return { errorCode: 'already_delivered' };
  }

  if (order.status !== ORDER_STATUS.SHIPPING) {
    return { errorCode: 'not_shippable' };
  }

  const nextStatus =
    existing.status === SHIPMENT_JOB_STATUS.RECEIVED
      ? SHIPMENT_JOB_STATUS.IN_TRANSIT
      : SHIPMENT_JOB_STATUS.DELIVERED;

  const { error } = await supabase
    .from('shipment_jobs')
    .update({ status: nextStatus, updated_at: new Date().toISOString() })
    .eq('id', existing.id);

  if (error) {
    return { errorCode: 'failed' };
  }

  await recordSimEvent(orderId, nextStatus);

  if (nextStatus === SHIPMENT_JOB_STATUS.DELIVERED) {
    await transitionOrderStatus(orderId, ORDER_STATUS.SHIPPING, ORDER_STATUS.COMPLETED, {
      source: ORDER_EVENT_SOURCE.WEBHOOK,
      actor: SIM_ACTOR,
    });
  }

  revalidatePath(ADMIN_ROUTES.DASHBOARD);
  return { status: nextStatus };
}

function recordSimEvent(orderId: string, shipmentStatus: ShipmentJobStatus) {
  return recordOrderEvent({
    orderId,
    eventType: ORDER_EVENT_TYPE.WEBHOOK_RECEIVED,
    source: ORDER_EVENT_SOURCE.WEBHOOK,
    actor: SIM_ACTOR,
    metadata: { provider: 'vendor', shipmentStatus },
  });
}
