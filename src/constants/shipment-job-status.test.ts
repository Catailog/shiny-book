import { describe, expect, it } from 'vitest';

import { isShipmentJobStatus } from '@/constants/shipment-job-status';

describe('isShipmentJobStatus', () => {
  it('accepts known shipment job statuses', () => {
    expect(isShipmentJobStatus('received')).toBe(true);
    expect(isShipmentJobStatus('in_transit')).toBe(true);
    expect(isShipmentJobStatus('delivered')).toBe(true);
  });

  it('rejects unknown values', () => {
    expect(isShipmentJobStatus('lost')).toBe(false);
    expect(isShipmentJobStatus('')).toBe(false);
  });
});
