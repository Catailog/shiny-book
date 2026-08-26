import { describe, expect, it } from 'vitest';

import { createConsumerOrderSchema, orderDetailsSchema } from './order-schema';

const validDetails = {
  productId: '22222222-2222-2222-2222-222222222222',
  title: '나의 첫 포토북',
  quantity: 1,
  pageCount: 8,
  addressId: '11111111-1111-1111-1111-111111111111',
};

describe('orderDetailsSchema', () => {
  it('accepts a valid page count from the allowed options', () => {
    expect(orderDetailsSchema.safeParse(validDetails).success).toBe(true);
  });

  it('rejects a page count outside the allowed options', () => {
    const result = orderDetailsSchema.safeParse({ ...validDetails, pageCount: 9 });
    expect(result.success).toBe(false);
  });

  it('rejects an empty title', () => {
    const result = orderDetailsSchema.safeParse({ ...validDetails, title: '' });
    expect(result.success).toBe(false);
  });

  it('rejects a title with characters outside the allowed set', () => {
    const result = orderDetailsSchema.safeParse({ ...validDetails, title: '나의 포토북 😀' });
    expect(result.success).toBe(false);
  });

  it('rejects a quantity above the max', () => {
    const result = orderDetailsSchema.safeParse({ ...validDetails, quantity: 101 });
    expect(result.success).toBe(false);
  });

  it('rejects a non-uuid productId', () => {
    const result = orderDetailsSchema.safeParse({ ...validDetails, productId: 'product-1' });
    expect(result.success).toBe(false);
  });
});

describe('createConsumerOrderSchema', () => {
  it('accepts photoPaths matching pageCount times photos-per-page', () => {
    const result = createConsumerOrderSchema.safeParse({
      ...validDetails,
      photoPaths: Array.from({ length: 16 }, (_, index) => `consumer-1/photo/${index}.webp`),
    });
    expect(result.success).toBe(true);
  });

  it('rejects photoPaths with fewer photos than required', () => {
    const result = createConsumerOrderSchema.safeParse({
      ...validDetails,
      photoPaths: ['consumer-1/photo/0.webp'],
    });
    expect(result.success).toBe(false);
  });

  it('rejects photoPaths with more photos than required', () => {
    const result = createConsumerOrderSchema.safeParse({
      ...validDetails,
      photoPaths: Array.from({ length: 17 }, (_, index) => `consumer-1/photo/${index}.webp`),
    });
    expect(result.success).toBe(false);
  });
});
