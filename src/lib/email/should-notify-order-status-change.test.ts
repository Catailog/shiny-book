import { describe, expect, it } from 'vitest';

import { ORDER_STATUS } from '@/constants/order-status';

import { shouldNotifyOrderStatusChange } from './should-notify-order-status-change';

describe('shouldNotifyOrderStatusChange', () => {
  it('notifies for each customer-facing target status', () => {
    for (const toStatus of [
      ORDER_STATUS.PAID,
      ORDER_STATUS.PRINTING,
      ORDER_STATUS.SHIPPING,
      ORDER_STATUS.COMPLETED,
      ORDER_STATUS.REFUNDED,
    ] as const) {
      expect(shouldNotifyOrderStatusChange({ fromStatus: ORDER_STATUS.PAID, toStatus })).toBe(true);
    }
  });

  it('does not notify for internal-only target statuses', () => {
    expect(
      shouldNotifyOrderStatusChange({
        fromStatus: ORDER_STATUS.PRINTING,
        toStatus: ORDER_STATUS.BINDING,
      }),
    ).toBe(false);
    expect(
      shouldNotifyOrderStatusChange({
        fromStatus: ORDER_STATUS.AWAITING_PAYMENT,
        toStatus: ORDER_STATUS.AWAITING_PAYMENT,
      }),
    ).toBe(false);
  });

  it('stays silent when an unpaid order is cancelled from awaiting_payment', () => {
    expect(
      shouldNotifyOrderStatusChange({
        fromStatus: ORDER_STATUS.AWAITING_PAYMENT,
        toStatus: ORDER_STATUS.CANCELLED,
      }),
    ).toBe(false);
  });

  it('notifies when a paid order is cancelled', () => {
    expect(
      shouldNotifyOrderStatusChange({
        fromStatus: ORDER_STATUS.PAID,
        toStatus: ORDER_STATUS.CANCELLED,
      }),
    ).toBe(true);
  });

  it('notifies on an admin revert even from awaiting_payment', () => {
    expect(
      shouldNotifyOrderStatusChange({
        fromStatus: ORDER_STATUS.AWAITING_PAYMENT,
        toStatus: ORDER_STATUS.CANCELLED,
        isRevert: true,
      }),
    ).toBe(true);
  });
});
