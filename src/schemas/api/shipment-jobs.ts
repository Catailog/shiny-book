import { z } from 'zod';

import { SHIPMENT_JOB_STATUS } from '@/constants/shipment-job-status';
import { createSuccessEnvelopeSchema } from '@/schemas/api/envelope';

export const createShipmentJobRequestSchema = z.object({
  orderId: z.string(),
});

export type CreateShipmentJobRequest = z.infer<typeof createShipmentJobRequestSchema>;

export const shipmentJobResponseSchema = z.object({
  id: z.string(),
  orderId: z.string(),
  status: z.enum([
    SHIPMENT_JOB_STATUS.RECEIVED,
    SHIPMENT_JOB_STATUS.IN_TRANSIT,
    SHIPMENT_JOB_STATUS.DELIVERED,
  ]),
  trackingNumber: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type ShipmentJobResponse = z.infer<typeof shipmentJobResponseSchema>;

export const shipmentJobSuccessEnvelopeSchema =
  createSuccessEnvelopeSchema(shipmentJobResponseSchema);
