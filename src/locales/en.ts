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
    needAgreement: 'Please agree to the required terms.',
    alreadyProcessed: 'This order has already been processed.',
    orderIdLabel: 'Order ID',
    paymentErrors: {
      notSelectedPaymentMethod: 'Please select a payment method.',
      needCardPaymentDetail: 'Please select your card details.',
      needRefundAccountDetail: 'Please enter your refund account details.',
      exceedDepositAmountLimit:
        'This exceeds the virtual account deposit limit. Please use another payment method.',
      providerStatusUnhealthy:
        'The payment provider is temporarily unavailable. Please select another payment method.',
      unsupportedTestPhasePaymentMethod: 'This payment method is not supported in test mode.',
      networkError: 'A network error occurred. Please try again shortly.',
      invalidMethodTransaction: 'A request is already in progress. Please try again shortly.',
    },
    testNotice: {
      title: 'This is a test payment environment',
      body: 'This integration uses a test API key, so no real charge will ever occur. That said, the payment flow itself works exactly like a real payment. The "test environment" banner below is shown by Toss Payments itself, not by this site, and during authentication you can also check the browser address bar for a sandbox domain such as payment-gateway-sandbox.tosspayments.com to verify it\'s a test.',
    },
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
      abortedTitle: 'Payment confirmation failed',
      abortedDescription: 'The payment was aborted during confirmation. Please try again.',
      rejectedTitle: 'Payment rejected',
      rejectedDescription:
        'Your card issuer rejected this payment. Please check your card details or limit.',
      codeLabel: 'Error code',
      messageLabel: 'Error message',
    },
  },
} as const;
