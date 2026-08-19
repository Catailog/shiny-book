import { describe, expect, it } from 'vitest';
import { z } from 'zod';

import { API_ERROR_CODES } from '@/constants/api-errors';
import { createSuccessEnvelopeSchema, errorEnvelopeSchema } from '@/schemas/api/envelope';

describe('createSuccessEnvelopeSchema', () => {
  const schema = createSuccessEnvelopeSchema(z.object({ id: z.string() }));

  it('accepts a payload matching the data schema', () => {
    const result = schema.safeParse({ data: { id: 'order-1' }, error: null });
    expect(result.success).toBe(true);
  });

  it('rejects a payload that does not match the data schema', () => {
    const result = schema.safeParse({ data: { id: 42 }, error: null });
    expect(result.success).toBe(false);
  });

  it('rejects a payload with a non-null error field', () => {
    const result = schema.safeParse({ data: { id: 'order-1' }, error: 'oops' });
    expect(result.success).toBe(false);
  });
});

describe('errorEnvelopeSchema', () => {
  it('accepts a known error code with a message', () => {
    const result = errorEnvelopeSchema.safeParse({
      data: null,
      error: { code: API_ERROR_CODES.NOT_FOUND, message: 'Order not found' },
    });
    expect(result.success).toBe(true);
  });

  it('rejects an unknown error code', () => {
    const result = errorEnvelopeSchema.safeParse({
      data: null,
      error: { code: 'SOMETHING_ELSE', message: 'oops' },
    });
    expect(result.success).toBe(false);
  });

  it('rejects a non-null data field', () => {
    const result = errorEnvelopeSchema.safeParse({
      data: { id: 'order-1' },
      error: { code: API_ERROR_CODES.NOT_FOUND, message: 'Order not found' },
    });
    expect(result.success).toBe(false);
  });
});
