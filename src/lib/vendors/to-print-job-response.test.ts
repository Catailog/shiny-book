import { describe, expect, it } from 'vitest';

import type { Tables } from '@/lib/db/database.types';
import { toPrintJobResponse } from '@/lib/vendors/to-print-job-response';

function buildPrintJobRow(overrides: Partial<Tables<'print_jobs'>> = {}): Tables<'print_jobs'> {
  return {
    id: 'print-job-1',
    order_id: 'order-1',
    status: 'received',
    manuscript_file_url: 'https://storage.example.com/manuscript.pdf',
    cover_file_url: 'https://storage.example.com/cover.png',
    quantity: 1,
    created_at: '2026-08-13T00:00:00.000Z',
    updated_at: '2026-08-13T00:00:00.000Z',
    ...overrides,
  };
}

describe('toPrintJobResponse', () => {
  it('maps a valid print job row to the camelCase response shape', () => {
    const result = toPrintJobResponse(buildPrintJobRow());

    expect(result).toEqual({
      id: 'print-job-1',
      orderId: 'order-1',
      status: 'received',
      manuscriptFileUrl: 'https://storage.example.com/manuscript.pdf',
      coverFileUrl: 'https://storage.example.com/cover.png',
      quantity: 1,
      createdAt: '2026-08-13T00:00:00.000Z',
      updatedAt: '2026-08-13T00:00:00.000Z',
    });
  });

  it('returns null when the stored status is not a recognized print job status', () => {
    const result = toPrintJobResponse(buildPrintJobRow({ status: 'shipped' }));
    expect(result).toBeNull();
  });
});
