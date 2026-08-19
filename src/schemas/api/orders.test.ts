import { describe, expect, it } from 'vitest';

import { createOrderRequestSchema } from '@/schemas/api/orders';

describe('createOrderRequestSchema', () => {
  const validPayload = {
    title: '나의 첫 동화책',
    manuscriptFileUrl: 'https://storage.example.com/manuscript.pdf',
    coverFileUrl: 'https://storage.example.com/cover.png',
    quantity: 1,
  };

  it('accepts a valid payload', () => {
    expect(createOrderRequestSchema.safeParse(validPayload).success).toBe(true);
  });

  it('rejects an empty title', () => {
    const result = createOrderRequestSchema.safeParse({ ...validPayload, title: '' });
    expect(result.success).toBe(false);
  });

  it('rejects a manuscript file url that is not a url', () => {
    const result = createOrderRequestSchema.safeParse({
      ...validPayload,
      manuscriptFileUrl: 'not-a-url',
    });
    expect(result.success).toBe(false);
  });

  it('rejects a quantity of zero', () => {
    const result = createOrderRequestSchema.safeParse({ ...validPayload, quantity: 0 });
    expect(result.success).toBe(false);
  });

  it('rejects a non-integer quantity', () => {
    const result = createOrderRequestSchema.safeParse({ ...validPayload, quantity: 1.5 });
    expect(result.success).toBe(false);
  });
});
