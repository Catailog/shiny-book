import { isShipmentJobStatus } from '@/constants/shipment-job-status';
import type { Tables } from '@/lib/db/database.types';
import type { ShipmentJobResponse } from '@/schemas/api/shipment-jobs';

export function toShipmentJobResponse(
  shipmentJob: Tables<'shipment_jobs'>,
): ShipmentJobResponse | null {
  if (!isShipmentJobStatus(shipmentJob.status)) {
    return null;
  }

  return {
    id: shipmentJob.id,
    orderId: shipmentJob.order_id,
    status: shipmentJob.status,
    trackingNumber: shipmentJob.tracking_number,
    createdAt: shipmentJob.created_at,
    updatedAt: shipmentJob.updated_at,
  };
}
