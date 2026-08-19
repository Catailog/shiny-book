import { describe, expect, it } from 'vitest';

import { isOrderStatus } from '@/constants/order-status';

describe('isOrderStatus', () => {
  it('accepts known order statuses', () => {
    expect(isOrderStatus('awaiting_payment')).toBe(true);
    expect(isOrderStatus('completed')).toBe(true);
  });

  it('rejects unknown values', () => {
    expect(isOrderStatus('cancelled')).toBe(false);
    expect(isOrderStatus('')).toBe(false);
  });
});
