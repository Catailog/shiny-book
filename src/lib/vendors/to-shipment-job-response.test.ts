import { describe, expect, it } from 'vitest';

import type { Tables } from '@/lib/db/database.types';
import { toShipmentJobResponse } from '@/lib/vendors/to-shipment-job-response';

function buildShipmentJobRow(
  overrides: Partial<Tables<'shipment_jobs'>> = {},
): Tables<'shipment_jobs'> {
  return {
    id: 'shipment-job-1',
    order_id: 'order-1',
    status: 'received',
    tracking_number: 'CJ123456789012',
    created_at: '2026-08-13T00:00:00.000Z',
    updated_at: '2026-08-13T00:00:00.000Z',
    ...overrides,
  };
}

describe('toShipmentJobResponse', () => {
  it('maps a valid shipment job row to the camelCase response shape', () => {
    const result = toShipmentJobResponse(buildShipmentJobRow());

    expect(result).toEqual({
      id: 'shipment-job-1',
      orderId: 'order-1',
      status: 'received',
      trackingNumber: 'CJ123456789012',
      createdAt: '2026-08-13T00:00:00.000Z',
      updatedAt: '2026-08-13T00:00:00.000Z',
    });
  });

  it('returns null when the stored status is not a recognized shipment job status', () => {
    const result = toShipmentJobResponse(buildShipmentJobRow({ status: 'lost' }));
    expect(result).toBeNull();
  });
});
