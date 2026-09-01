import { describe, expect, it } from 'vitest';

import { adminRefundInputSchema } from '@/schemas/refund';

describe('adminRefundInputSchema', () => {
  it('accepts an empty input (full refund, no note)', () => {
    expect(adminRefundInputSchema.safeParse({}).success).toBe(true);
  });

  it('accepts a positive integer amount and a trimmed note', () => {
    const result = adminRefundInputSchema.safeParse({ amount: 5000, note: '  파손 보상  ' });
    expect(result.success && result.data).toEqual({ amount: 5000, note: '파손 보상' });
  });

  it('rejects a non-positive or non-integer amount', () => {
    expect(adminRefundInputSchema.safeParse({ amount: 0 }).success).toBe(false);
    expect(adminRefundInputSchema.safeParse({ amount: -1 }).success).toBe(false);
    expect(adminRefundInputSchema.safeParse({ amount: 1.5 }).success).toBe(false);
  });
});
