import { describe, expect, it } from 'vitest';

import type { Tables } from '@/lib/db/database.types';
import { toOrderResponse } from '@/lib/orders/to-order-response';

function buildOrderRow(overrides: Partial<Tables<'orders'>> = {}): Tables<'orders'> {
  return {
    id: 'order-1',
    client_id: 'client-1',
    status: 'awaiting_payment',
    title: '나의 첫 동화책',
    manuscript_file_url: 'https://storage.example.com/manuscript.pdf',
    cover_file_url: 'https://storage.example.com/cover.png',
    quantity: 1,
    created_at: '2026-08-13T00:00:00.000Z',
    updated_at: '2026-08-13T00:00:00.000Z',
    ...overrides,
  };
}

describe('toOrderResponse', () => {
  it('maps a valid order row to the camelCase response shape', () => {
    const result = toOrderResponse(buildOrderRow());

    expect(result).toEqual({
      id: 'order-1',
      status: 'awaiting_payment',
      title: '나의 첫 동화책',
      manuscriptFileUrl: 'https://storage.example.com/manuscript.pdf',
      coverFileUrl: 'https://storage.example.com/cover.png',
      quantity: 1,
      createdAt: '2026-08-13T00:00:00.000Z',
      updatedAt: '2026-08-13T00:00:00.000Z',
    });
  });

  it('returns null when the stored status is not a recognized order status', () => {
    const result = toOrderResponse(buildOrderRow({ status: 'cancelled' }));
    expect(result).toBeNull();
  });
});
