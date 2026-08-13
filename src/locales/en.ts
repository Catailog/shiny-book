import type { ApiErrorCode } from '@/constants/api-errors';

export const en = {
  common: {
    loading: 'Loading...',
    error: 'Something went wrong.',
  },
  apiErrors: {
    UNAUTHORIZED: 'Authentication is required.',
    FORBIDDEN: 'You do not have permission.',
    NOT_FOUND: 'The requested resource was not found.',
    VALIDATION_FAILED: 'The input is invalid.',
    RATE_LIMITED: 'Too many requests. Please try again later.',
    INTERNAL_ERROR: 'Something went wrong. Please try again.',
  } satisfies Record<ApiErrorCode, string>,
  checkout: {
    title: 'Checkout',
    quantitySuffix: 'copies',
    amountLabel: 'Amount',
    payButton: 'Pay now',
    payError: 'Something went wrong while requesting payment. Please try again.',
    alreadyProcessed: 'This order has already been processed.',
    success: {
      title: 'Payment request received',
      description: 'Payment confirmation will be handled in the next step.',
      paymentKeyLabel: 'Payment key',
      orderIdLabel: 'Order ID',
      amountLabel: 'Amount',
    },
    fail: {
      title: 'Payment failed',
      codeLabel: 'Error code',
      messageLabel: 'Error message',
    },
  },
} as const;
