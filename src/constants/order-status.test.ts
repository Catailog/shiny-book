import { describe, expect, it } from 'vitest';

import { isOrderStatus } from '@/constants/order-status';

describe('isOrderStatus', () => {
  it('accepts known order statuses', () => {
    expect(isOrderStatus('awaiting_payment')).toBe(true);
    expect(isOrderStatus('completed')).toBe(true);
    expect(isOrderStatus('cancelled')).toBe(true);
  });

  it('rejects unknown values', () => {
    expect(isOrderStatus('refunded')).toBe(false);
    expect(isOrderStatus('')).toBe(false);
  });
});
