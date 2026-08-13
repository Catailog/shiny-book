import { describe, expect, it } from 'vitest';

import { ORDER_STATUS } from '@/constants/order-status';
import { canTransition, getNextStatuses } from '@/lib/orders/order-state-machine';

describe('canTransition', () => {
  it('allows each forward transition in the happy path', () => {
    expect(canTransition(ORDER_STATUS.AWAITING_PAYMENT, ORDER_STATUS.PAID)).toBe(true);
    expect(canTransition(ORDER_STATUS.PAID, ORDER_STATUS.PRINTING)).toBe(true);
    expect(canTransition(ORDER_STATUS.PRINTING, ORDER_STATUS.BINDING)).toBe(true);
    expect(canTransition(ORDER_STATUS.BINDING, ORDER_STATUS.SHIPPING)).toBe(true);
    expect(canTransition(ORDER_STATUS.SHIPPING, ORDER_STATUS.COMPLETED)).toBe(true);
  });

  it('rejects skipping a step', () => {
    expect(canTransition(ORDER_STATUS.AWAITING_PAYMENT, ORDER_STATUS.PRINTING)).toBe(false);
    expect(canTransition(ORDER_STATUS.PAID, ORDER_STATUS.SHIPPING)).toBe(false);
  });

  it('rejects moving backwards', () => {
    expect(canTransition(ORDER_STATUS.PAID, ORDER_STATUS.AWAITING_PAYMENT)).toBe(false);
  });

  it('rejects transitioning to the same status', () => {
    expect(canTransition(ORDER_STATUS.PAID, ORDER_STATUS.PAID)).toBe(false);
  });

  it('has no transitions out of the terminal status', () => {
    expect(getNextStatuses(ORDER_STATUS.COMPLETED)).toEqual([]);
  });
});
