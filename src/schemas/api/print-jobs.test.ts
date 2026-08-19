import { describe, expect, it } from 'vitest';

import { createPrintJobRequestSchema } from '@/schemas/api/print-jobs';

describe('createPrintJobRequestSchema', () => {
  const validPayload = {
    orderId: 'order-1',
    manuscriptFileUrl: 'https://storage.example.com/manuscript.pdf',
    coverFileUrl: 'https://storage.example.com/cover.png',
    quantity: 1,
  };

  it('accepts a valid payload', () => {
    expect(createPrintJobRequestSchema.safeParse(validPayload).success).toBe(true);
  });

  it('rejects a manuscript file url that is not a url', () => {
    const result = createPrintJobRequestSchema.safeParse({
      ...validPayload,
      manuscriptFileUrl: 'not-a-url',
    });
    expect(result.success).toBe(false);
  });

  it('rejects a quantity of zero', () => {
    const result = createPrintJobRequestSchema.safeParse({ ...validPayload, quantity: 0 });
    expect(result.success).toBe(false);
  });
});
