import 'server-only';

import { TOSS_PAYMENT_STATUS } from '@/constants/toss-payment-status';
import { env } from '@/env';

interface ConfirmPaymentParams {
  paymentKey: string;
  orderId: string;
  amount: number;
}

interface ConfirmPaymentSuccess {
  isConfirmed: true;
}

interface ConfirmPaymentFailure {
  isConfirmed: false;
  errorMessage: string;
}

export type ConfirmPaymentResult = ConfirmPaymentSuccess | ConfirmPaymentFailure;

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

interface TossPaymentBody {
  status: string;
}

function isTossPaymentBody(value: unknown): value is TossPaymentBody {
  return (
    typeof value === 'object' &&
    value !== null &&
    'status' in value &&
    typeof (value as Record<string, unknown>).status === 'string'
  );
}

export async function confirmTossPayment(
  params: ConfirmPaymentParams,
): Promise<ConfirmPaymentResult> {
  const credentials = Buffer.from(`${env.TOSS_SECRET_KEY}:`).toString('base64');

  const response = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  const body: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMessage = isTossErrorBody(body) ? body.message : 'Payment confirmation failed';
    return { isConfirmed: false, errorMessage };
  }

  if (!isTossPaymentBody(body)) {
    return { isConfirmed: false, errorMessage: 'Unexpected response from payment provider' };
  }

  if (body.status !== TOSS_PAYMENT_STATUS.DONE) {
    return { isConfirmed: false, errorMessage: `Unexpected payment status: ${body.status}` };
  }

  return { isConfirmed: true };
}
