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
    payCancelled: 'You cancelled the payment.',
    alreadyProcessed: 'This order has already been processed.',
    orderIdLabel: 'Order ID',
    confirm: {
      confirmed: {
        title: 'Payment complete',
        description: 'The order has moved to the paid status.',
      },
      alreadyProcessed: {
        title: 'Payment already processed',
        description: 'This order has already been confirmed.',
      },
      amountMismatch: {
        title: 'Payment amount mismatch',
        description: 'We could not confirm this payment. Please contact support.',
      },
      confirmFailed: {
        title: 'Payment confirmation failed',
        description: 'Please try again later or contact support.',
      },
      notFound: {
        title: 'Order not found',
        description: '',
      },
      invalidRequest: {
        title: 'Invalid request',
        description: '',
      },
    },
    fail: {
      title: 'Payment failed',
      cancelledTitle: 'Payment cancelled',
      cancelledDescription: 'The payment was cancelled. Please try again.',
      codeLabel: 'Error code',
      messageLabel: 'Error message',
    },
  },
} as const;
