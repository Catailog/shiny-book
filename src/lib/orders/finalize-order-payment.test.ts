import { beforeEach, describe, expect, it, vi } from 'vitest';

const selectMaybeSingleMock = vi.fn();
const updateMaybeSingleMock = vi.fn();

vi.mock('@/lib/supabase/service-role', () => ({
  createServiceRoleClient: () => ({
    from: () => ({
      select: () => ({
        eq: () => ({
          maybeSingle: selectMaybeSingleMock,
        }),
      }),
      update: () => ({
        eq: () => ({
          eq: () => ({
            select: () => ({
              maybeSingle: updateMaybeSingleMock,
            }),
          }),
        }),
      }),
    }),
  }),
}));

const confirmTossPaymentMock = vi.fn();
vi.mock('@/lib/payments/toss-confirm-payment', () => ({
  confirmTossPayment: confirmTossPaymentMock,
}));

vi.mock('@/lib/orders/record-order-event', () => ({
  recordOrderEvent: vi.fn(),
}));

const { finalizeOrderPayment } = await import('@/lib/orders/finalize-order-payment');

function buildOrder(overrides: Record<string, unknown> = {}) {
  return {
    id: 'order-1',
    client_id: 'client-1',
    status: 'awaiting_payment',
    title: 'title',
    manuscript_file_url: 'https://example.com/m.pdf',
    cover_file_url: 'https://example.com/c.png',
    quantity: 1,
    amount: 10000,
    created_at: '2026-08-13T00:00:00.000Z',
    updated_at: '2026-08-13T00:00:00.000Z',
    ...overrides,
  };
}

beforeEach(() => {
  selectMaybeSingleMock.mockReset();
  updateMaybeSingleMock.mockReset();
  confirmTossPaymentMock.mockReset();
});

describe('finalizeOrderPayment', () => {
  it('returns not_found when the order does not exist', async () => {
    selectMaybeSingleMock.mockResolvedValueOnce({ data: null });

    const result = await finalizeOrderPayment('order-1', 'payment-key', 10000);

    expect(result).toEqual({ outcome: 'not_found' });
  });

  it('returns already_processed when the order is not awaiting payment', async () => {
    selectMaybeSingleMock.mockResolvedValueOnce({ data: buildOrder({ status: 'paid' }) });

    const result = await finalizeOrderPayment('order-1', 'payment-key', 10000);

    expect(result.outcome).toBe('already_processed');
  });

  it('returns amount_mismatch when the paid amount does not match the order amount', async () => {
    selectMaybeSingleMock.mockResolvedValueOnce({ data: buildOrder() });

    const result = await finalizeOrderPayment('order-1', 'payment-key', 5000);

    expect(result).toEqual({ outcome: 'amount_mismatch' });
  });

  it('returns confirm_failed when Toss rejects the confirmation', async () => {
    selectMaybeSingleMock.mockResolvedValueOnce({ data: buildOrder() });
    confirmTossPaymentMock.mockResolvedValueOnce({
      isConfirmed: false,
      errorMessage: 'REJECTED',
    });

    const result = await finalizeOrderPayment('order-1', 'payment-key', 10000);

    expect(result).toEqual({ outcome: 'confirm_failed', errorMessage: 'REJECTED' });
  });

  it('transitions the order to paid when confirmation succeeds', async () => {
    selectMaybeSingleMock.mockResolvedValueOnce({ data: buildOrder() });
    confirmTossPaymentMock.mockResolvedValueOnce({ isConfirmed: true });
    updateMaybeSingleMock.mockResolvedValueOnce({ data: buildOrder({ status: 'paid' }) });

    const result = await finalizeOrderPayment('order-1', 'payment-key', 10000);

    expect(result.outcome).toBe('confirmed');
    if (result.outcome === 'confirmed') {
      expect(result.order.status).toBe('paid');
    }
  });

  it('confirms using the stored order amount when no reported amount is given', async () => {
    selectMaybeSingleMock.mockResolvedValueOnce({ data: buildOrder() });
    confirmTossPaymentMock.mockResolvedValueOnce({ isConfirmed: true });
    updateMaybeSingleMock.mockResolvedValueOnce({ data: buildOrder({ status: 'paid' }) });

    const result = await finalizeOrderPayment('order-1', 'payment-key');

    expect(confirmTossPaymentMock).toHaveBeenCalledWith({
      paymentKey: 'payment-key',
      orderId: 'order-1',
      amount: 10000,
    });
    expect(result.outcome).toBe('confirmed');
  });

  it('falls back to already_processed when the conditional update loses a race', async () => {
    selectMaybeSingleMock.mockResolvedValueOnce({ data: buildOrder() });
    confirmTossPaymentMock.mockResolvedValueOnce({ isConfirmed: true });
    updateMaybeSingleMock.mockResolvedValueOnce({ data: null });
    selectMaybeSingleMock.mockResolvedValueOnce({ data: buildOrder({ status: 'paid' }) });

    const result = await finalizeOrderPayment('order-1', 'payment-key', 10000);

    expect(result.outcome).toBe('already_processed');
  });
});
