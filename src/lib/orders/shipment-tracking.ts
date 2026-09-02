import {
  SHIPMENT_JOB_STATUS,
  type ShipmentJobStatus,
  isShipmentJobStatus,
} from '@/constants/shipment-job-status';
import type { Tables } from '@/lib/db/database.types';

export interface ShipmentTrackingStep {
  status: ShipmentJobStatus;
  state: 'done' | 'current' | 'upcoming';
}

export interface ShipmentTrackingView {
  trackingNumber: string;
  status: ShipmentJobStatus;
  steps: ShipmentTrackingStep[];
}

type ShipmentColumns = Pick<Tables<'shipment_jobs'>, 'status' | 'tracking_number'>;

// Courier sub-status progression, in order. The consumer stepper walks these.
const SHIPMENT_STEP_ORDER: readonly ShipmentJobStatus[] = [
  SHIPMENT_JOB_STATUS.RECEIVED,
  SHIPMENT_JOB_STATUS.IN_TRANSIT,
  SHIPMENT_JOB_STATUS.DELIVERED,
];

// Turn a shipment_jobs row into a stepper model for the consumer. Returns null
// when the stored status is not a value we recognize (defensive against a
// widened DB CHECK constraint).
export function toShipmentTrackingView(job: ShipmentColumns): ShipmentTrackingView | null {
  if (!isShipmentJobStatus(job.status)) {
    return null;
  }

  const currentIndex = SHIPMENT_STEP_ORDER.indexOf(job.status);
  const steps: ShipmentTrackingStep[] = SHIPMENT_STEP_ORDER.map((status, index) => ({
    status,
    state: resolveStepState(index, currentIndex),
  }));

  return {
    trackingNumber: job.tracking_number,
    status: job.status,
    steps,
  };
}

function resolveStepState(index: number, currentIndex: number): ShipmentTrackingStep['state'] {
  if (index < currentIndex) {
    return 'done';
  }
  if (index === currentIndex) {
    return 'current';
  }
  return 'upcoming';
}
