import { describe, expect, it } from 'vitest';

import { ORDER_STATUS } from '@/constants/order-status';
import {
  REFUND_STATUS,
  isOpenRefundStatus,
  isRefundStatus,
  isRefundableOrderStatus,
} from '@/constants/refund';

describe('isRefundStatus', () => {
  it('accepts known statuses', () => {
    expect(isRefundStatus(REFUND_STATUS.APPROVED)).toBe(true);
    expect(isRefundStatus('completed')).toBe(true);
  });

  it('rejects unknown values', () => {
    expect(isRefundStatus('pending')).toBe(false);
  });
});

describe('isRefundableOrderStatus', () => {
  it('is true from paid through completed', () => {
    expect(isRefundableOrderStatus(ORDER_STATUS.PAID)).toBe(true);
    expect(isRefundableOrderStatus(ORDER_STATUS.SHIPPING)).toBe(true);
    expect(isRefundableOrderStatus(ORDER_STATUS.COMPLETED)).toBe(true);
  });

  it('is false before payment and for terminal non-fulfilled states', () => {
    expect(isRefundableOrderStatus(ORDER_STATUS.AWAITING_PAYMENT)).toBe(false);
    expect(isRefundableOrderStatus(ORDER_STATUS.CANCELLED)).toBe(false);
    expect(isRefundableOrderStatus(ORDER_STATUS.REFUNDED)).toBe(false);
  });
});

describe('isOpenRefundStatus', () => {
  it('treats requested and approved as open', () => {
    expect(isOpenRefundStatus(REFUND_STATUS.REQUESTED)).toBe(true);
    expect(isOpenRefundStatus(REFUND_STATUS.APPROVED)).toBe(true);
  });

  it('treats rejected/completed/failed as closed', () => {
    expect(isOpenRefundStatus(REFUND_STATUS.REJECTED)).toBe(false);
    expect(isOpenRefundStatus(REFUND_STATUS.COMPLETED)).toBe(false);
    expect(isOpenRefundStatus(REFUND_STATUS.FAILED)).toBe(false);
  });
});
