import type { ApiErrorCode } from '@/constants/api-errors';
import type { OrderStatus } from '@/constants/order-status';

export const en = {
  common: {
    loading: 'Loading...',
    error: 'Something went wrong.',
  },
  orderStatus: {
    awaiting_payment: 'Awaiting payment',
    paid: 'Paid',
    printing: 'Printing',
    binding: 'Binding',
    shipping: 'Shipping',
    completed: 'Completed',
  } satisfies Record<OrderStatus, string>,
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
  admin: {
    login: {
      title: 'Admin login',
      emailLabel: 'Email',
      passwordLabel: 'Password',
      submitButton: 'Sign in',
      submitting: 'Signing in...',
      errors: {
        emailInvalid: 'Please enter a valid email.',
        passwordRequired: 'Please enter your password.',
        invalid_credentials: 'Please check your email and password.',
        unexpected_error: 'Something went wrong. Please try again shortly.',
      },
    },
    dashboard: {
      title: 'Admin dashboard',
      signOutButton: 'Sign out',
    },
    orders: {
      title: 'Orders',
      empty: 'No orders to show.',
      columns: {
        title: 'Title',
        quantity: 'Quantity',
        amount: 'Amount',
        status: 'Status',
        createdAt: 'Created at',
        actions: 'Actions',
      },
      quantitySuffix: 'copies',
      advanceButton: 'Advance to next stage',
      statusChangeErrors: {
        unauthorized: 'You do not have permission. Please sign in again.',
        not_allowed: 'This status change is not allowed.',
        conflict: 'This order was already updated elsewhere. Please refresh and try again.',
      },
    },
  },
  consumer: {
    login: {
      title: 'Sign in',
      emailLabel: 'Email',
      passwordLabel: 'Password',
      submitButton: 'Sign in',
      submitting: 'Signing in...',
      signupPrompt: "Don't have an account yet?",
      signupLink: 'Sign up',
      errors: {
        emailInvalid: 'Please enter a valid email.',
        passwordRequired: 'Please enter your password.',
        invalid_credentials: 'Please check your email and password.',
        unexpected_error: 'Something went wrong. Please try again shortly.',
      },
    },
    signup: {
      title: 'Sign up',
      emailLabel: 'Email',
      passwordLabel: 'Password',
      passwordConfirmLabel: 'Confirm password',
      submitButton: 'Sign up',
      submitting: 'Creating account...',
      loginPrompt: 'Already have an account?',
      loginLink: 'Sign in',
      errors: {
        emailInvalid: 'Please enter a valid email.',
        passwordTooShort: 'Password must be at least 6 characters.',
        passwordMismatch: 'Passwords do not match.',
        email_taken: 'This email is already registered.',
        unexpected_error: 'Something went wrong. Please try again shortly.',
      },
    },
    mypage: {
      title: 'My page',
      signOutButton: 'Sign out',
      newOrderButton: 'Create new order',
    },
    orderNew: {
      title: 'Create an order',
      titleLabel: 'Book title',
      quantityLabel: 'Quantity',
      manuscriptLabel: 'Manuscript file (PDF)',
      coverLabel: 'Cover image',
      submitButton: 'Go to payment',
      submitting: 'Creating order...',
      status: {
        uploading: 'Uploading...',
        processing: 'Processing image...',
        done: 'Upload complete',
      },
      errors: {
        titleRequired: 'Please enter a book title.',
        quantityInvalid: 'Quantity must be at least 1.',
        uploadFailed: 'File upload failed. Please try again.',
        filesRequired: 'Please upload both the manuscript and cover files.',
        unauthorized: 'You do not have permission. Please sign in again.',
        validation_failed: 'Please check your input and try again.',
        unexpected_error: 'Something went wrong. Please try again shortly.',
      },
    },
  },
} as const;
