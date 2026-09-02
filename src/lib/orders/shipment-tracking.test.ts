import { describe, expect, it } from 'vitest';

import { SHIPMENT_JOB_STATUS } from '@/constants/shipment-job-status';
import { toShipmentTrackingView } from '@/lib/orders/shipment-tracking';

describe('toShipmentTrackingView', () => {
  it('keeps the first step current right after courier receipt', () => {
    const view = toShipmentTrackingView({
      status: SHIPMENT_JOB_STATUS.RECEIVED,
      tracking_number: 'SHNY-1234',
    });

    expect(view?.trackingNumber).toBe('SHNY-1234');
    expect(view?.steps.map((step) => step.state)).toEqual(['current', 'upcoming', 'upcoming']);
  });

  it('marks the earlier step done and the current status active while in transit', () => {
    const view = toShipmentTrackingView({
      status: SHIPMENT_JOB_STATUS.IN_TRANSIT,
      tracking_number: 'SHNY-1234',
    });

    expect(view?.steps.map((step) => step.state)).toEqual(['done', 'current', 'upcoming']);
  });

  it('marks every earlier step done when delivered', () => {
    const view = toShipmentTrackingView({
      status: SHIPMENT_JOB_STATUS.DELIVERED,
      tracking_number: 'SHNY-1234',
    });

    expect(view?.steps.map((step) => step.state)).toEqual(['done', 'done', 'current']);
  });

  it('returns null for an unrecognized status', () => {
    expect(
      toShipmentTrackingView({ status: 'lost_in_space', tracking_number: 'SHNY-1234' }),
    ).toBeNull();
  });
});
