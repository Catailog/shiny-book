import { randomUUID } from 'node:crypto';
import 'server-only';

import { env } from '@/env';

interface CancelPaymentParams {
  paymentKey: string;
  cancelReason: string;
  // Omit for a full cancellation.
  cancelAmount?: number;
}

interface CancelPaymentSuccess {
  isCancelled: true;
  transactionKey: string | null;
}

interface CancelPaymentFailure {
  isCancelled: false;
  errorMessage: string;
}

export type CancelPaymentResult = CancelPaymentSuccess | CancelPaymentFailure;

interface TossErrorBody {
  message: string;
}

function isTossErrorBody(value: unknown): value is TossErrorBody {
  return (
    typeof value === 'object' &&
    value !== null &&
    'message' in value &&
    typeof (value as Record<string, unknown>).message === 'string'
  );
}

// Toss returns the full Payment object; the newest entry in `cancels` carries
// the transactionKey for this cancellation.
function extractLatestTransactionKey(value: unknown): string | null {
  if (typeof value !== 'object' || value === null || !('cancels' in value)) {
    return null;
  }

  const { cancels } = value as { cancels: unknown };
  if (!Array.isArray(cancels) || cancels.length === 0) {
    return null;
  }

  const latest: unknown = cancels[cancels.length - 1];
  if (
    typeof latest === 'object' &&
    latest !== null &&
    'transactionKey' in latest &&
    typeof (latest as Record<string, unknown>).transactionKey === 'string'
  ) {
    return (latest as { transactionKey: string }).transactionKey;
  }

  return null;
}

export async function cancelTossPayment(params: CancelPaymentParams): Promise<CancelPaymentResult> {
  // No usable test MID: in the test-payment environment there is no real Toss
  // payment to cancel, so return a mock success. The real cancel call runs only
  // when test payments are disabled (production).
  if (env.ALLOW_TEST_PAYMENT) {
    return { isCancelled: true, transactionKey: `mock-cancel-${randomUUID()}` };
  }

  const credentials = Buffer.from(`${env.TOSS_SECRET_KEY}:`).toString('base64');

  const response = await fetch(
    `https://api.tosspayments.com/v1/payments/${encodeURIComponent(params.paymentKey)}/cancel`,
    {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cancelReason: params.cancelReason,
        ...(params.cancelAmount === undefined ? {} : { cancelAmount: params.cancelAmount }),
      }),
    },
  );

  const body: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMessage = isTossErrorBody(body) ? body.message : 'Payment cancellation failed';
    return { isCancelled: false, errorMessage };
  }

  return { isCancelled: true, transactionKey: extractLatestTransactionKey(body) };
}
