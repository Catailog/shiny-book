import { describe, expect, it } from 'vitest';

import { refundRequestInputSchema, refundReviewInputSchema } from '@/schemas/refund';

describe('refundRequestInputSchema', () => {
  it('accepts a reason with no amount (full refund)', () => {
    const result = refundRequestInputSchema.safeParse({ reason: '  파손된 상태로 도착  ' });
    expect(result.success && result.data).toEqual({ reason: '파손된 상태로 도착' });
  });

  it('accepts a positive integer partial amount', () => {
    const result = refundRequestInputSchema.safeParse({ reason: '일부만', amount: 5000 });
    expect(result.success && result.data.amount).toBe(5000);
  });

  it('rejects an empty reason', () => {
    expect(refundRequestInputSchema.safeParse({ reason: '   ' }).success).toBe(false);
  });

  it('rejects a non-positive or non-integer amount', () => {
    expect(refundRequestInputSchema.safeParse({ reason: 'x', amount: 0 }).success).toBe(false);
    expect(refundRequestInputSchema.safeParse({ reason: 'x', amount: -1 }).success).toBe(false);
    expect(refundRequestInputSchema.safeParse({ reason: 'x', amount: 1.5 }).success).toBe(false);
  });
});

describe('refundReviewInputSchema', () => {
  it('accepts an omitted note', () => {
    expect(refundReviewInputSchema.safeParse({}).success).toBe(true);
  });

  it('trims a provided note', () => {
    const result = refundReviewInputSchema.safeParse({ note: '  확인함  ' });
    expect(result.success && result.data.note).toBe('확인함');
  });
});
