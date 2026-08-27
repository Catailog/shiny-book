import { ADDRESS_LABEL_MAX_LENGTH } from '@/constants/address';
import {
  ANNOUNCEMENT_CONTENT_MAX_LENGTH,
  ANNOUNCEMENT_TITLE_MAX_LENGTH,
} from '@/constants/announcement';
import type { AnnouncementCategory } from '@/constants/announcement-category';
import type { ApiErrorCode } from '@/constants/api-errors';
import {
  DISPLAY_NAME_MAX_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from '@/constants/auth';
import {
  COUPON_CODE_MAX_LENGTH,
  COUPON_DISCOUNT_VALUE_MAX,
  COUPON_PERCENTAGE_MAX,
} from '@/constants/coupon';
import { FAQ_ANSWER_MAX_LENGTH, FAQ_QUESTION_MAX_LENGTH } from '@/constants/faq';
import { INQUIRY_CONTENT_MAX_LENGTH, INQUIRY_TITLE_MAX_LENGTH } from '@/constants/inquiry';
import { ORDER_TITLE_MAX_LENGTH } from '@/constants/order';
import type { OrderStatus } from '@/constants/order-status';
import { PERSON_NAME_MAX_LENGTH } from '@/constants/person-name';
import {
  PRODUCT_DESCRIPTION_MAX_LENGTH,
  PRODUCT_NAME_MAX_LENGTH,
  PRODUCT_PRICE_MAX,
  PRODUCT_SIZE_MAX_LENGTH,
  PRODUCT_SLUG_MAX_LENGTH,
} from '@/constants/product';

export const en = {
  common: {
    loading: 'Loading...',
    error: 'Something went wrong.',
    coachmarkClose: 'Close',
    turnstilePendingTooltip: 'Please wait until security verification finishes.',
    searchLabel: 'Search',
    warning: 'Warning',
    importantToastLabel: 'Important',
    charLimitHint: '{max} characters or fewer.',
  },
  site: {
    nav: {
      products: 'Products',
      gallery: 'Gallery',
      pricing: 'Pricing',
      about: 'About',
      atelier: 'The Atelier',
      notices: 'Notices',
      faq: 'FAQ',
      reviews: 'Reviews',
      studioGroup: 'Studio',
      productionGroup: 'Production Info',
      supportGroup: 'Support',
      login: 'Sign in',
      signup: 'Sign up',
      mypage: 'My page',
      logout: 'Sign out',
      startOrder: 'Start an order',
      changeLanguage: 'Change language',
      switchToLightMode: 'Switch to light mode',
      switchToDarkMode: 'Switch to dark mode',
      goToAdmin: 'Go to admin page',
      goToAdminTooltip: 'Go to admin page - added for testing purposes.',
      openMenu: 'Open menu',
      menuTitle: 'Site menu',
      coachmarkTestFeaturesTitle: 'Test features',
      coachmarkTestFeaturesDescription:
        'Sign in instantly to test things out, or check out the admin page - no sign-up needed.',
    },
    footer: {
      productsTitle: 'Products',
      customerServiceTitle: 'Support',
      companyTitle: 'Company',
      inquiries: 'Contact Us',
      terms: 'Terms of Service',
      privacy: 'Privacy Policy',
      businessInfo:
        'Representative: Hong Gil-dong\nBusiness registration No. 000-00-00000\nMail order sales registration No. 2026-Seoul Jung-gu-0000\n110 Sejong-daero, Jung-gu, Seoul, Republic of Korea\n02-0000-0000\nexample@example.com',
      copyright: '© 2026 Shiny Book',
      links: {
        viewProducts: 'View products',
        layoutGuidelines: 'Layout guidelines',
        ecoPapers: 'Eco-friendly papers',
        shippingPolicy: 'Shipping policy',
        ourStory: 'Our story',
        atelier: 'The atelier',
        sustainability: 'Sustainability',
        press: 'Press inquiries',
      },
    },
    home: {
      hero: {
        eyebrow: 'Custom Book Printing & Publishing',
        title: 'Your story, bound in a book of its own',
        description:
          'Preserve your most treasured moments in a form that lasts. Shiny Book prints on carefully chosen premium paper with durable binding to create a book that is truly yours.',
        primaryCtaLabel: 'Make my book',
        secondaryCtaLabel: 'View products',
        coachmarkNewOrderTitle: 'You can order now',
        coachmarkNewOrderDescription: 'Tap here to start making your own book.',
        stats: [
          { label: 'Premium paper usage', suffix: '%' },
          { label: 'Premium collections', suffix: '' },
          { label: 'Books sold', suffix: '' },
        ],
      },
      steps: {
        eyebrow: 'The Process',
        title: 'Making a premium book is easier than you think',
        items: [
          {
            title: 'Upload your photos',
            description:
              'Upload your high-resolution, memory-filled photos. Sent securely from mobile or desktop.',
          },
          {
            title: 'Choose layout & cover',
            description:
              'Match a classic template, precisely designed by our studio, with a premium linen or leather cover.',
          },
          {
            title: 'Bind & receive',
            description:
              "After a craftsman's careful finishing, meet your finished book at home, safely packed in a custom box.",
          },
        ],
      },
      features: {
        eyebrow: 'Our Promise',
        title: 'Uncompromising quality, obsessive finishing',
        subtitle:
          'Careful printing and binding, down to the smallest detail, for a book that feels complete.',
        items: [
          {
            title: 'Non-toxic archival paper',
            description:
              'Carefully selected archival-grade fine art paper that resists fading and damage over time.',
          },
          {
            title: 'Hand-sewn Smyth binding',
            description:
              "Traditional hand-crafted hardcover binding that won't easily lose pages and opens smoothly.",
          },
          {
            title: 'Thoughtful, custom layouts',
            description:
              'From spacious, minimal magazine styles to dense collections, we support a range of design templates.',
          },
          {
            title: 'Eco-conscious custom packaging',
            description:
              'Once finished, every book is shipped promptly in dedicated packaging that protects it from impact and moisture.',
          },
        ],
      },
      products: {
        eyebrow: 'The Collection',
        title: 'The Shiny Book Lineup',
        ctaLabel: 'Start an order',
        startingFromLabel: 'Starting from',
        filterLabel: 'Product filter',
        filters: {
          all: 'View all',
          classic: 'Classic series',
          premium: 'Premium series',
        },
        items: [
          {
            name: 'Hardcover Photobook',
            size: '10 x 10 in',
            description:
              'A sturdy board cover with precise finishing, built to last for generations.',
            price: '$0.99',
          },
          {
            name: 'Softcover Photobook',
            size: '8 x 10 in',
            description:
              'A light, soft cover that is comfortable to flip through for everyday keepsakes.',
            price: '$0.79',
          },
          {
            name: 'Premium Photo Album',
            size: '12 x 12 in',
            description:
              'A premium leather cover with thick archival paper for your most special keepsake.',
            price: '$9.90',
          },
          {
            name: 'Travel Journal',
            size: '6 x 8 in',
            description: 'A compact, portable size, perfect for recording moments on the road.',
            price: '$0.69',
          },
          {
            name: 'Wedding Album',
            size: '11 x 14 in',
            description: 'An elegant album dedicated to the most radiant moment of a lifetime.',
            price: '$9.90',
          },
          {
            name: "Baby's First Year",
            size: '9 x 9 in',
            description: 'A lovingly crafted album capturing a baby’s first year of growth.',
            price: '$8.90',
          },
        ],
      },
      notices: {
        title: 'Notices',
        empty: 'No notices yet.',
        more: 'More',
        expandLabel: 'Expand notice list',
        prevPageLabel: 'Previous page',
        nextPageLabel: 'Next page',
      },
      reviews: {
        eyebrow: 'Customer Voices',
        title: 'Stories from our customers',
        empty: 'No reviews yet.',
        more: 'View all reviews',
        ratingLabel: 'Rating',
        purchasedLabel: 'Purchased',
      },
      cta: {
        eyebrow: 'Get Started Now',
        title: 'Create your own photobook, right now',
        description:
          "It only takes a few minutes to upload and arrange your photos, then order a beautifully crafted print you'll be proud of.",
        primaryLabel: 'Start now',
        secondaryLabel: 'Contact us',
      },
    },
  },
  notFound: {
    title: 'Page not found',
    description: 'The page you requested does not exist or has been moved.',
    backToHome: 'Back to home',
  },
  orderStatus: {
    awaiting_payment: 'Awaiting payment',
    paid: 'Paid',
    printing: 'Printing',
    binding: 'Binding',
    shipping: 'Shipping',
    completed: 'Completed',
    cancelled: 'Cancelled',
  } satisfies Record<OrderStatus, string>,
  announcementCategories: {
    notice: 'Notice',
    event: 'Event',
    winner: 'Winners',
  } satisfies Record<AnnouncementCategory, string>,
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
    backButton: 'Back',
    cancelOrder: {
      button: 'Cancel order',
      confirmTitle: 'Cancel this order?',
      confirmDescription:
        'Cancelling takes it out of awaiting-payment status and cannot be undone.',
      cancelButton: 'Close',
      confirmButton: 'Cancel order',
      success: 'The order has been cancelled.',
      errors: {
        unauthorized: 'You are not authorized. Please sign in again.',
        order_not_cancellable: 'This order was already processed and can no longer be cancelled.',
      },
    },
    summaryTitle: 'Order Summary',
    paymentTitle: 'Payment Method',
    quantitySuffix: 'copies',
    amountLabel: 'Amount',
    merchandiseAmountLabel: 'Merchandise amount',
    shippingFeeLabel: 'Shipping fee',
    coupon: {
      label: 'Coupon code',
      applyButton: 'Apply',
      applying: 'Applying...',
      applySuccess: 'Coupon applied.',
      discountLabel: 'Coupon discount',
      errors: {
        validation_failed: `The coupon code must be ${COUPON_CODE_MAX_LENGTH} characters or fewer.`,
        not_found: 'This order could not be found.',
        already_applied: 'A coupon has already been applied to this order.',
        coupon_invalid: "This coupon code can't be used.",
        coupon_conflict: 'This coupon was just used elsewhere. Please try again.',
        rate_limited: 'Too many attempts. Please try again later.',
        unexpected_error: 'Something went wrong. Please try again shortly.',
      },
    },
    payButton: 'Pay now',
    testPaymentButton: 'Auto test payment',
    testPaymentTooltip: 'Skips the payment widget and marks the order as paid instantly.',
    coachmarkTestPaymentTitle: 'Test payment',
    coachmarkTestPaymentDescription: 'Mark this order as paid instantly, no real payment needed.',
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
      darkThemeNote: 'The test payment widget does not support dark theme.',
    },
    confirm: {
      confirmed: {
        title: 'Payment complete',
        description: 'The order has moved to the paid status.',
      },
      amountMismatch: {
        title: 'Payment amount mismatch',
        description: 'We could not confirm this payment. Please contact support.',
      },
      couponUnavailable: {
        title: 'This coupon is no longer available',
        description:
          'The coupon on this order expired or was used by another order in the meantime. No payment was taken. Please contact support.',
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
    backToMypageButton: 'Back to my page',
  },
  admin: {
    portalLabel: 'Admin Portal',
    notificationsLabel: 'Notifications',
    notificationsEmptyLabel: 'No unanswered inquiries.',
    notificationsViewAllLabel: 'View all inquiries',
    pagination: {
      pageSizeLabel: 'Rows per page',
      pageSizeOption: '{count} / page',
    },
    nav: {
      dashboard: 'Dashboard',
      products: 'Products',
      orders: 'Orders',
      coupons: 'Coupons',
      announcements: 'Announcements',
      faqs: 'FAQs',
      inquiries: 'Inquiries',
      logout: 'Logout',
    },
    login: {
      title: 'Admin login',
      emailLabel: 'Email',
      passwordLabel: 'Password',
      submitButton: 'Sign in',
      submitting: 'Signing in...',
      testLoginButton: 'Instant test account login',
      testLoginSubmitting: 'Signing in...',
      testLoginTooltip: 'Automatically signs you in with a fresh account for admin testing.',
      coachmarkTestLoginTitle: 'Instant admin test login',
      coachmarkTestLoginDescription: 'One click gets you into the admin screens.',
      errors: {
        emailInvalid: 'Please enter a valid email.',
        passwordRequired: 'Please enter your password.',
        invalid_credentials: 'Please check your email and password.',
        rate_limited: 'Too many login attempts. Please try again later.',
        unexpected_error: 'Something went wrong. Please try again shortly.',
      },
      testLoginErrors: {
        unavailable: 'This feature is not available right now.',
        bot_verification_failed: "We couldn't verify this is a genuine request. Please try again.",
        unexpected_error: 'Something went wrong. Please try again shortly.',
      },
    },
    dashboard: {
      title: 'Dashboard Overview',
      signOutButton: 'Sign out',
      kpi: {
        todayOrders: "TODAY'S ORDERS",
        pendingProduction: 'PENDING PRODUCTION',
        revenueThisMonth: 'REVENUE THIS MONTH',
        activeCoupons: 'ACTIVE COUPONS',
        vsLastMonth: 'vs last month',
      },
      recentSubmissions: {
        title: 'Recent Submissions',
        exportCsv: 'Export CSV',
        viewAll: 'View All',
        columns: {
          orderId: 'ORDER ID',
          customer: 'CUSTOMER',
          product: 'PRODUCT',
          status: 'STATUS',
          files: 'FILES (MAN/COV)',
          date: 'DATE',
          amount: 'AMOUNT',
        },
        selected: 'Selected',
        viewManuscript: 'View Manuscript',
        viewCoverLayout: 'View Cover Layout',
      },
    },
    orders: {
      title: 'Orders',
      empty: 'No orders to show.',
      columns: {
        title: 'Title',
        customerName: 'Customer',
        quantity: 'Quantity',
        amount: 'Amount',
        status: 'Status',
        createdAt: 'Created at',
        files: 'Files',
        actions: 'Actions',
      },
      quantitySuffix: 'copies',
      filterAllLabel: 'All',
      search: {
        placeholder: 'Search',
        fieldOptions: {
          title: 'Title',
          id: 'Order ID',
          customerName: 'Customer',
        },
      },
      advanceButton: 'Advance to next stage',
      revertButton: 'Revert to previous stage',
      revertConfirmTitle: 'Revert to the previous stage?',
      revertConfirmDescription:
        'This will move the order status back to the previous stage. If work has already progressed, it may no longer match reality, so proceed carefully.',
      revertConfirmButton: 'Force revert',
      revertCancelButton: 'Cancel',
      viewPhotosButton: 'Uploaded photos',
      photosLoading: 'Loading...',
      photosEmpty: 'No photos uploaded.',
      fileViewError: 'Failed to load the file.',
      statusChangeErrors: {
        unauthorized: 'You do not have permission. Please sign in again.',
        not_allowed: 'This status change is not allowed.',
        conflict: 'This order was already updated elsewhere. Please refresh and try again.',
      },
    },
    coupons: {
      title: 'Coupons',
      newTitle: 'Issue Coupon',
      issueButton: 'Issue',
      empty: 'No coupons yet.',
      createSuccess: 'Coupon created.',
      unlimited: 'Unlimited',
      noExpiry: 'No expiry',
      activeLabel: 'Active',
      inactiveLabel: 'Inactive',
      expiredLabel: 'Expired',
      scheduledLabel: 'Scheduled',
      activateButton: 'Activate',
      deactivateButton: 'Deactivate',
      form: {
        codeLabel: 'Coupon code',
        discountTypeLabel: 'Discount type',
        discountValueLabel: 'Discount value',
        maxUsesLabel: 'Max uses',
        expiresAtLabel: 'Expires at',
        periodLabel: 'Active period',
        periodPlaceholder: 'Select start and end date',
        submitButton: 'Create',
        submitting: 'Creating...',
      },
      discountTypeOptions: {
        fixed: 'Fixed amount',
        percentage: 'Percentage',
      },
      columns: {
        code: 'Code',
        discount: 'Discount',
        usage: 'Usage',
        expiresAt: 'Expires at',
        active: 'Status',
        createdAt: 'Created at',
        actions: 'Actions',
      },
      list: {
        tabs: {
          all: 'All Coupons',
          activeOnly: 'Active Only',
          expired: 'Expired',
        },
        searchPlaceholder: 'Search coupon codes...',
        createButton: 'Create Coupon',
        table: {
          code: 'COUPON CODE',
          type: 'TYPE',
          value: 'VALUE',
          minOrder: 'MIN. ORDER',
          usage: 'USAGE / LIMIT',
          expiry: 'EXPIRY',
          status: 'STATUS',
          actions: 'ACTIONS',
        },
        typeLabels: {
          percentage: 'Percentage',
          fixed: 'Fixed Amount',
        },
      },
      create: {
        specificationsTitle: 'Coupon Specifications',
        codeLabel: 'Coupon Code',
        autoGenerateButton: 'Auto-Generate',
        typeLabel: 'Discount Type',
        typeOptions: {
          percentage: 'Percentage (%)',
          fixed: 'Fixed Amount (₩)',
        },
        valueLabel: 'Discount Value',
        minOrderLabel: 'Min. Order Amount',
        startDateLabel: 'Start Date',
        endDateLabel: 'End Date',
        descriptionLabel: 'Internal Description',
        backToList: 'Back to Coupons list',
        cancelButton: 'Cancel',
        submitButton: 'Create Coupon',
        previewLabel: 'LIVE PREVIEW',
        previewMinPurchase: 'Minimum purchase of',
        previewExpires: 'Expires',
      },
      errors: {
        unauthorized: 'You do not have permission. Please sign in again.',
        validation_failed: 'Please check your input and try again.',
        code_taken: 'This coupon code is already in use.',
        expired: 'Expired coupons cannot change status.',
        conflict: 'This was already changed elsewhere. Please refresh and try again.',
        unexpected_error: 'Something went wrong. Please try again shortly.',
        fields: {
          code: {
            required: 'Please enter a coupon code.',
            tooLong: `Keep the coupon code within ${COUPON_CODE_MAX_LENGTH} characters.`,
          },
          discountValue: {
            required: 'Please enter a discount value.',
            invalid: 'Please enter the discount value as a number.',
            min: 'The discount value must be 1 or more.',
            max: `The discount value must be ${COUPON_DISCOUNT_VALUE_MAX.toLocaleString('en-US')} or less.`,
            custom: `A percentage discount cannot exceed ${COUPON_PERCENTAGE_MAX}%.`,
          },
          period: 'The start date must be on or before the end date.',
        },
      },
    },
    announcements: {
      title: 'Announcements',
      newTitle: 'Write announcement',
      editTitle: 'Edit announcement',
      empty: 'No announcements yet.',
      editLink: 'Edit',
      writeButton: 'Write',
      saveSuccess: 'Saved.',
      form: {
        titleLabel: 'Title',
        categoryLabel: 'Category',
        contentLabel: 'Content',
        createButton: 'Create',
        saveButton: 'Save',
        submitting: 'Saving...',
      },
      columns: {
        category: 'Category',
        title: 'Title',
        createdAt: 'Created at',
        updatedAt: 'Updated at',
        actions: 'Actions',
      },
      errors: {
        unauthorized: 'You do not have permission. Please sign in again.',
        validation_failed: 'Please check your input and try again.',
        unexpected_error: 'Something went wrong. Please try again shortly.',
        fields: {
          title: {
            required: 'Please enter a title.',
            tooLong: `Keep the title within ${ANNOUNCEMENT_TITLE_MAX_LENGTH} characters.`,
          },
          content: {
            required: 'Please enter the content.',
            tooLong: `Keep the content within ${ANNOUNCEMENT_CONTENT_MAX_LENGTH.toLocaleString('en-US')} characters.`,
          },
        },
      },
      list: {
        filterAllLabel: 'All',
        categoryTabs: {
          all: 'All Categories',
          service: 'Service',
          event: 'Event',
          maintenance: 'Maintenance',
        },
        searchPlaceholder: 'Search announcements...',
        createButton: 'New Announcement',
        selectAll: 'Select all',
        table: {
          category: 'Category',
          title: 'Title',
          author: 'Author',
          date: 'Date',
          status: 'Status',
          views: 'Views',
        },
        statusLabels: {
          published: 'Published',
          draft: 'Draft',
        },
      },
      create: {
        backToList: 'Back to Announcements list',
        compositionTitle: 'Composition Area',
        titleLabel: 'Announcement Title',
        categoryLabel: 'Category',
        attachmentsLabel: 'Attachments',
        attachmentsHint: 'Drag & drop file attachments here, or Browse',
        pinLabel: 'Pin announcement to top of listings',
        saveDraftButton: 'Save Draft',
        publishButton: 'Save & Publish Now',
        publishingOptionsTitle: 'PUBLISHING OPTIONS',
        publishImmediately: 'Publish Immediately',
        publishImmediatelyHint: 'Post to frontend layout instantly',
        schedulePublication: 'Schedule Publication',
        schedulePublicationHint: 'Pick custom timestamp release',
      },
    },
    faqs: {
      title: 'FAQs',
      newTitle: 'Write FAQ',
      editTitle: 'Edit FAQ',
      empty: 'No FAQs yet.',
      editLink: 'Edit',
      writeButton: 'Write',
      saveSuccess: 'Saved.',
      form: {
        questionLabel: 'Question',
        answerLabel: 'Answer',
        createButton: 'Create',
        saveButton: 'Save',
        submitting: 'Saving...',
      },
      columns: {
        question: 'Question',
        createdAt: 'Created at',
        actions: 'Actions',
      },
      errors: {
        unauthorized: 'You do not have permission. Please sign in again.',
        validation_failed: 'Please check your input and try again.',
        unexpected_error: 'Something went wrong. Please try again shortly.',
        fields: {
          question: {
            required: 'Please enter a question.',
            tooLong: `Keep the question within ${FAQ_QUESTION_MAX_LENGTH} characters.`,
          },
          answer: {
            required: 'Please enter an answer.',
            tooLong: `Keep the answer within ${FAQ_ANSWER_MAX_LENGTH.toLocaleString('en-US')} characters.`,
          },
        },
      },
      list: {
        searchPlaceholder: 'Search questions...',
        allCategories: 'All Categories',
        allStatuses: 'All Statuses',
        showingCount: 'Showing {shown} FAQs',
        table: {
          title: 'QUESTION TITLE',
          category: 'CATEGORY',
          displayOrder: 'DISPLAY ORDER',
          status: 'STATUS',
          lastEdited: 'LAST EDITED',
          actions: 'ACTIONS',
        },
      },
      create: {
        backToList: 'Back to FAQs list',
        detailsTitle: 'FAQ details',
        categoryLabel: 'Category',
        displayOrderLabel: 'Display Order',
        statusLabel: 'Status',
        questionLabel: 'Question (Korean)',
        answerLabel: 'Answer (Korean Rich Text)',
        cancelButton: 'CANCEL',
        submitButton: 'SAVE FAQ',
        previewTitle: 'Live Customer Preview',
        helpfulQuestion: 'Was this answer helpful?',
        yes: 'Yes',
        no: 'No',
      },
    },
    inquiries: {
      title: 'Inquiries',
      empty: 'No inquiries yet.',
      columns: {
        title: 'Title',
        consumer: 'Consumer',
        status: 'Status',
        createdAt: 'Created at',
        actions: 'Actions',
      },
      statusPending: 'Pending',
      statusAnswered: 'Answered',
      newReplyBadge: 'New reply',
      viewLink: 'View',
      answerButton: 'Submit answer',
      answering: 'Submitting...',
      answerSuccess: 'Answer submitted.',
      errors: {
        unauthorized: 'You do not have permission. Please sign in again.',
        validation_failed: 'Please check your input and try again.',
        not_found: 'This message could not be found.',
        unexpected_error: 'Something went wrong. Please try again shortly.',
      },
      list: {
        filterAllLabel: 'All',
        unresolvedFilterLabel: 'Unresolved',
        statusTabs: {
          all: 'All Inquiries',
          new: 'New',
          inProgress: 'In Progress',
          answered: 'Answered',
          closed: 'Closed',
        },
        search: {
          placeholder: 'Search',
          fieldOptions: {
            customerName: 'Customer',
            title: 'Title',
          },
        },
        table: {
          inquiryNo: 'INQUIRY #',
          customerName: 'CUSTOMER NAME',
          category: 'CATEGORY BADGE',
          subject: 'SUBJECT',
          status: 'STATUS BADGE',
          receivedDate: 'FIRST RECEIVED',
          lastMessageDate: 'LAST MESSAGE',
        },
        deletedConsumerLabel: 'Deleted user',
      },
      detail: {
        backToList: 'Back to Inquiries List',
        clientProfileTitle: 'Client Profile',
        membershipLabel: 'Membership',
        totalSpentLabel: 'Total Spent',
        openTicketsLabel: 'Open Tickets',
        contextTitle: 'Inquiry context',
        subjectLabel: 'Ticket Subject',
        attachmentsLabel: 'Customer Attachments',
        conversationTitle: 'Conversation History',
        customerLabel: 'Customer',
        internalNoteLabel: 'INTERNAL NOTE',
        publicReplyTab: 'PUBLIC REPLY',
        internalNoteTab: 'INTERNAL NOTE',
        toLabel: 'To',
        attachFileButton: 'ATTACH FILE',
        closeInquiryButton: 'CLOSE INQUIRY',
        sendReplyButton: 'SEND REPLY',
        relatedOrderLabel: 'Related order',
        relatedOrderQuantity: 'Quantity',
        relatedOrderAmount: 'Amount paid',
        relatedOrderDate: 'Order date',
        couponUsedLabel: 'Coupon used',
        couponNotUsedLabel: 'No coupon used',
        threadLabel: 'Conversation',
        adminAuthorLabel: 'Admin',
        consumerAuthorLabel: 'Customer',
        replyLabel: 'Write a reply',
        replyPlaceholder: 'Enter your reply.',
        editButton: 'Edit',
        deleteButton: 'Delete',
        editCancelButton: 'Cancel',
        editSaveButton: 'Save',
        deleteConfirmTitle: 'Delete this message?',
        deleteConfirmDescription: 'This cannot be undone.',
        deleteCancelButton: 'Cancel',
        deleteConfirmButton: 'Delete',
      },
    },
    products: {
      title: 'Products',
      newTitle: 'Add product',
      editTitle: 'Edit product',
      empty: 'No products yet.',
      writeButton: 'Add product',
      searchPlaceholder: 'Search by product name...',
      saveSuccess: 'Saved.',
      backToList: 'Back to Products list',
      form: {
        slugLabel: 'Slug (URL identifier)',
        sizeLabel: 'Size',
        languageLabel: 'Language',
        nameLabel: 'Product name',
        descriptionLabel: 'Description',
        fallbackNotice: 'If left empty, {fallbackLanguage} will be shown instead.',
        priceLabel: 'Price (KRW)',
        imageUrlLabel: 'Product image',
        imageUploadButton: 'Upload image',
        imageUploading: 'Uploading...',
        categoryLabel: 'Category',
        isActiveLabel: 'Visible',
        createButton: 'Create',
        saveButton: 'Save',
        submitting: 'Saving...',
      },
      categoryOptions: {
        classic: 'Classic',
        premium: 'Premium',
      },
      columns: {
        name: 'Name',
        category: 'Category',
        price: 'Price',
        status: 'Status',
        createdAt: 'Registered',
        actions: 'Actions',
      },
      statusLabels: {
        active: 'Visible',
        inactive: 'Hidden',
      },
      filterTabs: {
        all: 'All',
        active: 'Visible',
        inactive: 'Hidden',
      },
      showButton: 'Show',
      hideButton: 'Hide',
      errors: {
        unauthorized: 'You do not have permission. Please sign in again.',
        validation_failed: 'Please check your input and try again.',
        slug_taken: 'This slug is already in use.',
        conflict: 'This was just changed elsewhere. Please refresh and try again.',
        unexpected_error: 'Something went wrong. Please try again shortly.',
        fields: {
          slug: {
            required: 'Please enter a slug.',
            tooLong: `Keep the slug within ${PRODUCT_SLUG_MAX_LENGTH} characters.`,
            format: 'Use only lowercase letters, numbers, and hyphens (-).',
          },
          name: {
            required: 'Please enter a product name.',
            tooLong: `Keep the product name within ${PRODUCT_NAME_MAX_LENGTH} characters.`,
          },
          size: {
            required: 'Please enter a size.',
            tooLong: `Keep the size within ${PRODUCT_SIZE_MAX_LENGTH} characters.`,
          },
          description: {
            required: 'Please enter a product description.',
            tooLong: `Keep the description within ${PRODUCT_DESCRIPTION_MAX_LENGTH.toLocaleString('en-US')} characters.`,
          },
          price: {
            required: 'Please enter a price.',
            invalid: 'Please enter the price as a number.',
            min: 'The price must be 0 or more.',
            max: `The price must be ${PRODUCT_PRICE_MAX.toLocaleString('en-US')} or less.`,
          },
        },
      },
    },
  },
  consumer: {
    login: {
      title: 'Sign in',
      subtitle: 'Continue making your own book',
      quote: {
        text: 'The reading of all good books is like a conversation with the finest minds of past centuries.',
        author: 'René Descartes',
      },
      emailLabel: 'Email',
      passwordLabel: 'Password',
      showPasswordLabel: 'Show password',
      hidePasswordLabel: 'Hide password',
      submitButton: 'Sign in',
      submitting: 'Signing in...',
      testLoginButton: 'Instant test account login',
      testLoginSubmitting: 'Signing in...',
      testLoginTooltip: 'Automatically signs you in with a fresh account for consumer testing.',
      coachmarkTestLoginTitle: 'Instant consumer test login',
      coachmarkTestLoginDescription: 'You can also sign up yourself to test that flow.',
      signupPrompt: "Don't have an account yet?",
      signupLink: 'Sign up',
      errors: {
        emailInvalid: 'Please enter a valid email.',
        passwordRequired: 'Please enter your password.',
        invalid_credentials: 'Please check your email and password.',
        rate_limited: 'Too many login attempts. Please try again later.',
        unexpected_error: 'Something went wrong. Please try again shortly.',
      },
      testLoginErrors: {
        unavailable: 'This feature is not available right now.',
        bot_verification_failed: "We couldn't verify this is a genuine request. Please try again.",
        unexpected_error: 'Something went wrong. Please try again shortly.',
      },
    },
    signup: {
      title: 'Get Started',
      subtitle: 'The studio that preserves your memories in a book',
      nameLabel: 'Full Name',
      emailLabel: 'Email',
      passwordLabel: 'Password',
      passwordConfirmLabel: 'Confirm Password',
      phoneLabel: 'Phone number (optional)',
      agreeTermsLabel: "I agree to Shiny Book's Terms of Service. (required)",
      agreePrivacyLabel: 'I agree to the collection and use of my personal information. (required)',
      marketingEmailLabel: 'I agree to receive marketing emails. (optional)',
      marketingSmsLabel: 'I agree to receive marketing SMS. (optional)',
      submitButton: 'Create Account',
      submitting: 'Creating account...',
      socialDividerLabel: 'Or continue with',
      googleButton: 'Google',
      appleButton: 'Apple',
      loginPrompt: 'Already have an account?',
      loginLink: 'Sign in',
      errors: {
        nameRequired: `Name must be 1 to ${PERSON_NAME_MAX_LENGTH} characters.`,
        emailInvalid: 'Please enter a valid email.',
        passwordTooShort: `Password must be ${PASSWORD_MIN_LENGTH} to ${PASSWORD_MAX_LENGTH} characters.`,
        passwordConfirmRequired: 'Please confirm your password.',
        passwordMismatch: 'Passwords do not match.',
        phoneInvalid: 'Please enter a valid mobile phone number.',
        agreeTermsRequired: 'Please agree to the Terms of Service.',
        agreePrivacyRequired:
          'Please agree to the collection and use of your personal information.',
        email_taken: 'This email is already registered.',
        bot_verification_failed: "We couldn't verify this is a genuine request. Please try again.",
        unexpected_error: 'Something went wrong. Please try again shortly.',
      },
    },
    mypage: {
      title: 'My Page',
      subtitle: 'Check your ongoing projects and order history.',
      sidebar: {
        orders: 'My Orders',
        account: 'Account Settings',
        inquiries: 'My Inquiries',
      },
      stats: {
        completed: 'Total Orders Completed',
        inProgress: 'In Production & Shipping',
        inquiries: 'My 1:1 Inquiries',
        volumeSuffix: '',
        countSuffix: '',
      },
      recentOrdersTitle: 'Recent Orders',
      orders: {
        title: 'Order history',
        empty: 'No orders yet.',
        columns: {
          title: 'Title',
          quantity: 'Quantity',
          amount: 'Amount',
          status: 'Status',
          createdAt: 'Created at',
          actions: 'Manage',
          inquiry: 'Inquiry',
        },
        quantitySuffix: 'copies',
        reviewWriteLink: 'Write review',
        reviewDoneLink: 'Review done',
        inquiryLink: 'Ask',
        payLink: 'Pay now',
      },
    },
    account: {
      title: 'Account settings',
      currentPasswordLabel: 'Current password',
      passwordLabel: 'New password',
      passwordConfirmLabel: 'Confirm new password',
      submitButton: 'Change password',
      submitting: 'Changing...',
      success: 'Your password has been changed.',
      errors: {
        currentPasswordRequired: 'Please enter your current password.',
        incorrect_current_password: 'Your current password is incorrect.',
        passwordTooShort: `Password must be ${PASSWORD_MIN_LENGTH} to ${PASSWORD_MAX_LENGTH} characters.`,
        passwordConfirmRequired: 'Please confirm your new password.',
        passwordMismatch: 'Passwords do not match.',
        unauthorized: 'You do not have permission. Please sign in again.',
        validation_failed: 'Please check your input and try again.',
        unexpected_error: 'Something went wrong. Please try again shortly.',
      },
      personalInfo: {
        title: 'Personal Information',
        editLink: 'Edit',
        nameLabel: 'Name',
        emailLabel: 'Email',
        phoneLabel: 'Phone',
        editNameTitle: 'Change name',
        editPhoneTitle: 'Change phone number',
        nameInvalid: `Name must be between 1 and ${DISPLAY_NAME_MAX_LENGTH} characters.`,
        phoneInvalid: 'Please enter a valid phone number.',
        phonePlaceholder: 'Leave the phone number blank to remove it.',
        updateSuccess: 'Your name has been updated.',
        phoneUpdateSuccess: 'Your phone number has been updated.',
      },
      profileImage: {
        changeButton: 'Change image',
        deleteButton: 'Remove',
        uploading: 'Uploading...',
        deleting: 'Removing...',
        updateSuccess: 'Profile image updated.',
        deleteSuccess: 'Profile image removed.',
        errors: {
          unauthorized: 'You do not have permission. Please sign in again.',
          validation_failed: 'Please upload an image file (PNG, JPG, WEBP) up to 5MB.',
          unexpected_error: 'Something went wrong. Please try again shortly.',
        },
      },
      changePassword: {
        title: 'Change Password',
        currentPasswordLabel: 'Current Password',
        newPasswordLabel: 'New Password',
        newPasswordConfirmLabel: 'Confirm New Password',
      },
      shippingAddress: {
        title: 'Shipping Addresses',
        addButton: '+ Add Address',
        editLink: 'Edit',
        deleteLink: 'Delete',
        defaultLabel: 'Default Address',
        empty: 'No addresses saved yet.',
        addTitle: 'Add Address',
        editTitle: 'Edit Address',
        form: {
          labelLabel: 'Address label',
          recipientNameLabel: 'Recipient',
          phoneLabel: 'Phone',
          postalCodeLabel: 'Postal code',
          searchAddressButton: 'Search address',
          addressLine1Label: 'Address',
          addressLine2Label: 'Address line 2 (optional)',
          isDefaultLabel: 'Set as default address',
          submitButton: 'Save',
          submitting: 'Saving...',
          cancelButton: 'Cancel',
        },
        deleteConfirmTitle: 'Delete this address?',
        deleteConfirmDescription: 'Deleted addresses cannot be recovered.',
        errors: {
          unauthorized: 'You do not have permission. Please sign in again.',
          validation_failed: 'Please check your input and try again.',
          not_found: 'Address not found.',
          unexpected_error: 'Something went wrong. Please try again shortly.',
          fields: {
            label: {
              required: 'Please enter an address label.',
              tooLong: `Keep the address label within ${ADDRESS_LABEL_MAX_LENGTH} characters.`,
            },
            recipientName: {
              required: 'Please enter a recipient name.',
              tooLong: `Keep the recipient name within ${PERSON_NAME_MAX_LENGTH} characters.`,
            },
            phone: {
              required: 'Please enter a phone number.',
              tooShort: 'Please enter a valid phone number.',
              format: 'Please enter a valid phone number.',
            },
            addressLine1: {
              required: 'Please use the address search to fill in the address.',
            },
          },
        },
      },
      notifications: {
        title: 'Notification Settings',
        emailMarketing: 'Agree to email marketing',
        smsUpdates: 'SMS updates for production/shipping',
      },
      deleteAccount: {
        prompt: 'No longer using your account?',
        button: 'Delete Account',
        confirmTitle: 'Are you sure you want to delete your account?',
        confirmDescription:
          'Your account and related data will be permanently deleted. This cannot be undone.',
        confirmButton: 'Delete account',
        cancelButton: 'Cancel',
        errors: {
          unauthorized: 'You do not have permission. Please sign in again.',
          unexpected_error:
            'Something went wrong while deleting your account. Please contact support.',
        },
      },
    },
    orderNew: {
      title: 'New Project Request',
      productLabel: 'Selected product',
      titleLabel: 'Book title',
      titlePlaceholder: 'Enter a book title',
      quantityLabel: 'Quantity',
      pageCountLabel: 'Page count',
      nextButton: 'Next',
      editButton: 'Edit',
      photosLabel: 'Interior photos',
      photosHint: '{count} / {required} uploaded',
      addPhotosButton: 'Add photos',
      removePhotoLabel: 'Remove photo',
      testUploadButton: 'Auto-upload test photos',
      testUploadTooltip: 'Automatically uploads photos so you can test the next screen.',
      coachmarkTestUploadTitle: 'Test image upload',
      coachmarkTestUploadDescription: 'Sample photos get uploaded automatically for you.',
      couponLabel: 'Coupon code (optional)',
      testCouponButton: 'Fill test coupon code',
      testCouponTooltip: 'Automatically fills in a 10% off test coupon code.',
      coachmarkTestCouponTitle: 'Test coupon entry',
      coachmarkTestCouponDescription: 'An unlimited-use test coupon gets filled in automatically.',
      couponLockedNote: "A coupon already applied to this order can't be changed here.",
      uploadingTooltip: "You can't continue while images are still uploading.",
      submitting: 'Creating order...',
      status: {
        uploading: 'Uploading...',
        processing: 'Processing image...',
        done: 'Upload complete',
      },
      summary: {
        title: 'Order Summary',
        productLine: '{productName} ({pageCount}p) x{quantity}',
        pageCountLine: 'Page count ({pageCount}p)',
        shipping: 'Shipping',
        shippingFree: 'Free',
        shippingUndetermined: 'To be determined',
        amountPending: 'Shown after quantity is set',
        finalEstimate: 'Final Estimated Total',
        payButton: 'Request & Pay',
      },
      errors: {
        titleRequired: 'Please enter a book title.',
        titleTooLong: `Title can be up to ${ORDER_TITLE_MAX_LENGTH} characters.`,
        titleInvalidChars: 'Title contains characters that are not allowed.',
        quantityInvalid: 'Quantity must be at least 1.',
        quantityTooLarge: 'Quantity cannot exceed {max}.',
        pageCountInvalid: 'Please select a page count.',
        photoCountMismatch: 'Please upload the exact number of interior photos required.',
        photoCountExceeded:
          'The {count} uploaded photos exceed what the new page count needs ({required}). Please remove some photos or increase the page count.',
        addressRequired: 'Please select a shipping address.',
        couponTooLong: `The coupon code must be ${COUPON_CODE_MAX_LENGTH} characters or fewer.`,
        uploadFailed: 'File upload failed. Please try again.',
        filesRequired: 'Please upload interior photos.',
        unauthorized: 'You do not have permission. Please sign in again.',
        validation_failed: 'Please check your input and try again.',
        product_not_found: 'Product not found.',
        address_not_found: 'The selected address could not be found. Please choose again.',
        order_not_editable:
          'This order was already processed and can no longer be edited. Check My Page.',
        coupon_invalid: "This coupon code can't be used.",
        coupon_conflict: 'This coupon was just used elsewhere. Please try again.',
        unexpected_error: 'Something went wrong. Please try again shortly.',
      },
      addressLabel: 'Shipping address',
      addressEmpty: 'No saved addresses yet. Please add one from My Page first.',
      addAddressLink: 'Add a shipping address',
      manageAddressLink: 'Add / edit addresses',
      refreshAddressesButton: 'Refresh',
    },
    inquiries: {
      title: '1:1 Inquiry History',
      subtitle: 'Your consultation history with our studio experts.',
      newTitle: 'Write an Inquiry',
      newButton: 'Write New Inquiry',
      empty: 'No inquiries yet.',
      statusPending: 'Pending',
      statusAnswered: 'Answered',
      backToList: 'Back to list',
      threadLabel: 'Conversation',
      loadOlderMessages: 'Load older messages',
      loadingOlderMessages: 'Loading...',
      adminAuthorLabel: 'Support',
      consumerAuthorLabel: 'Me',
      couponUsedLabel: 'Coupon used',
      couponNotUsedLabel: 'No coupon used',
      replyPlaceholder: 'Add more details to your inquiry.',
      replyButton: 'Submit',
      replying: 'Submitting...',
      filterTabs: {
        all: 'All',
        answered: 'Answered',
        pending: 'Pending',
      },
      table: {
        number: 'No.',
        inquiryId: 'Inquiry ID',
        orderTitle: 'Related book',
        category: 'Category',
        title: 'Title',
        status: 'Status',
        createdAt: 'First received',
        lastMessageDate: 'Last message',
      },
      form: {
        categoryLabel: 'Inquiry Category',
        categoryOptions: {
          general: 'General Inquiry',
          order: 'Order Inquiry',
        },
        relatedOrderLabel: 'Related Order (optional)',
        relatedOrderPlaceholder: 'Select an order',
        relatedOrderLine: 'Related order',
        titleLabel: 'Title',
        titlePlaceholder: 'Summarize what you need help with.',
        contentLabel: 'Content',
        contentPlaceholder:
          'Feel free to write detailed production questions or requests. Our editorial designers reply within 24 business hours.',
        attachmentsLabel: 'Attachments (up to 3)',
        attachmentsHint: 'Upload reference images if you have any. (PNG, JPG, PDF supported)',
        chooseFileButton: 'Choose File',
        cancelButton: 'Cancel',
        submitButton: 'Submit',
        submitting: 'Submitting...',
      },
      errors: {
        unauthorized: 'You do not have permission. Please sign in again.',
        validation_failed: 'Please check your input and try again.',
        not_found: 'This inquiry could not be found.',
        unexpected_error: 'Something went wrong. Please try again shortly.',
        fields: {
          title: {
            required: 'Please enter a title.',
            tooLong: `Keep the title within ${INQUIRY_TITLE_MAX_LENGTH} characters.`,
          },
          content: {
            required: 'Please enter the content.',
            tooLong: `Keep the content within ${INQUIRY_CONTENT_MAX_LENGTH.toLocaleString('en-US')} characters.`,
          },
        },
      },
    },
    reviews: {
      notCompleted: 'Only completed orders can be reviewed.',
      ratingLabel: 'Rating',
      form: {
        ratingLabel: 'Rating',
        contentLabel: 'Review (optional)',
        submitButton: 'Submit review',
        submitting: 'Submitting...',
      },
      errors: {
        unauthorized: 'You do not have permission.',
        not_completed: 'Only completed orders can be reviewed.',
        already_reviewed: 'This order has already been reviewed.',
        validation_failed: 'Please check your input and try again.',
        unexpected_error: 'Something went wrong. Please try again shortly.',
      },
    },
  },
  notice: {
    list: {
      eyebrow: 'Archive & Bulletin',
      title: 'Notices & Announcements',
      empty: 'No announcements yet.',
      searchPlaceholder: 'Search notices',
      categoryTabs: {
        all: 'All',
      },
      table: {
        category: 'Category',
        title: 'Title',
        date: 'Date',
      },
    },
    detail: {
      backToList: 'Back to list',
    },
  },
  faq: {
    hero: {
      eyebrow: 'How Can We Help You?',
      description:
        "We've carefully gathered the most common questions about creating a premium archival book. For anything else, reach us through 1:1 inquiries.",
    },
    title: 'Frequently asked questions',
    empty: 'No FAQs yet.',
    inquiryCtaLabel: 'Ask a 1:1 question',
  },
  products: {
    hero: {
      eyebrow: 'The Atelier Collection',
      title: 'The Collection',
      description:
        'A premium book guide curated by Shiny Book for pieces worth keeping. We use only authentic Smyth-sewn binding and carefully selected eco-friendly papers.',
    },
    resultsLabel: '{count} products',
    viewDetails: 'View details',
    detail: {
      notFoundTitle: 'Product not found',
      backToList: 'Back to list',
      ctaLabel: 'Start my book',
      specsEyebrow: 'Specifications',
      specsTitle: 'Crafted with meticulous detail',
      specs: [
        {
          title: 'Archival acid-free paper',
          description: 'Premium archive-grade paper that resists yellowing for decades.',
        },
        {
          title: 'Authentic hand binding',
          description: 'Hand Smyth-sewn stitching that guarantees a perfect 180-degree spread.',
        },
        {
          title: 'Considered whitespace templates',
          description: "Layout templates designed around our team's golden-ratio proportions.",
        },
      ],
      relatedEyebrow: 'Recommended',
      relatedTitle: 'More pieces to complement your everyday',
    },
  },
  pricing: {
    hero: {
      eyebrow: 'Transparent Values',
      title: 'Pricing',
      description:
        'The base price depends on the product you choose, and your selected page count and shipping fee are added on top. No hidden options, calculated exactly as shown below.',
    },
    pagePricing: {
      title: 'Price by page count',
      description:
        'Base product prices vary by product, so check the product list for those. Your selected page count adds the cost below on top.',
      perPageLine: 'Additional cost per page',
      productLinkLabel: 'View base prices by product',
    },
    shippingPricing: {
      title: 'Shipping',
      tableHeaders: {
        item: 'Item',
        amount: 'Amount',
      },
      baseFeeLine: 'Base shipping fee',
      jejuLine: 'Jeju surcharge',
      remoteLine: 'Remote island surcharge',
      freeThresholdLine: 'On orders of {amount} or more',
      freeThresholdValue: 'Free shipping',
    },
    ctaLabel: 'Start my book',
  },
  gallery: {
    hero: {
      eyebrow: 'Archived Memories',
      title: 'The Shiny Book Gallery',
      description:
        'A showcase of finished volumes created together with our customers. See the real layouts and hand-bound fabric finishes for yourself.',
    },
    filters: {
      all: 'All',
      wedding: 'Wedding',
      travel: 'Travel',
      family: 'Family',
      baby: 'Baby',
      lifestyle: 'Lifestyle',
    },
    items: [
      {
        image: '/images/gallery/forest-record.png',
        category: 'travel',
        title: 'A Quiet Record of the Forest',
        description:
          "Nordic conifer forests and minimal interiors, foil-stamped onto a sand linen cover to capture the region's stillness.",
      },
      {
        image: '/images/gallery/wedding-day.png',
        category: 'wedding',
        title: 'Our Classic Wedding Day',
        description:
          'Elegant Italian silk fabric with silver foil engraving, capturing the grandeur of a stately cathedral ceremony.',
      },
      {
        image: '/images/gallery/first-steps.png',
        category: 'baby',
        title: "Spring, Baby's First Steps",
        description:
          "A tender album printed on soft pastel fine art paper that captures a baby's downy hair and bright laughter.",
      },
      {
        image: '/images/gallery/alps-hiking.png',
        category: 'travel',
        title: 'Alps Hiking Journal',
        description:
          'A pocket-sized classic journal with fountain-pen notes and a handsome orange-brown leather cord binding.',
      },
      {
        image: '/images/gallery/three-generations.png',
        category: 'family',
        title: 'Family Time, A Three-Generation Portrait',
        description:
          "A grand 12-inch premium album made for grandparents' 70th birthday, with the distinct elegance of a leather cover.",
      },
      {
        image: '/images/gallery/afternoon-essay.png',
        category: 'lifestyle',
        title: 'A Modest Afternoon Essay',
        description:
          'Quiet everyday moments, a cup of coffee, light through the window, composed simply in a modern layout.',
      },
    ],
  },
  about: {
    hero: {
      eyebrow: 'Our Story & Philosophy',
      title: "The world's only history, kept from ever fading",
      description:
        "Thousands of photos buried and forgotten inside a phone. They hold not just files, but the warmest moments of a life. We were founded to bring the tactile, lasting joy of analog craft to what digital data alone can't offer, through a fusion of technology and hand bookbinding.",
    },
    values: {
      eyebrow: 'Our Core Values',
      title: 'The three essentials Shiny Book stands for',
      items: [
        {
          title: 'Craftsmanship',
          description:
            'Every book passes through the hands of a professional bookbinder. No compromise, down to a single stitch of thread.',
        },
        {
          title: 'Sustainability',
          description:
            'We use only archive-grade FSC-certified eco paper and biodegradable coated fabrics that resist yellowing for a century.',
        },
        {
          title: 'Quality',
          description:
            'Layout templates with perfectly balanced whitespace and precise print specs preserve every photo at its full vitality.',
        },
      ],
    },
    milestones: {
      title: 'Company Milestones',
      items: [
        {
          year: '2018',
          title: 'Studio founded',
          description:
            'Two master binders and one digital designer began in a modest bindery in Seoul, aiming for traditional book publishing.',
        },
        {
          year: '2020',
          title: 'Switched fully to FSC eco paper',
          description:
            'Officially launched our archival-grade books using only FSC-certified non-toxic paper for sustainable preservation.',
        },
        {
          year: '2022',
          title: 'Introduced full-grain Italian leather',
          description:
            'Adopted eco-tanned Florentine leather used by top luxury brands, expanding our premium album line.',
        },
        {
          year: '2024',
          title: 'Preserved our 10,000th memory',
          description:
            "We've printed countless families' and creators' precious personal histories into books worth keeping.",
        },
      ],
    },
    team: {
      title: 'The Makers',
      members: [
        {
          image: '/images/about/team-1.png',
          name: 'Seoyoung Jang',
          role: 'Master Bookbinder',
          description:
            'A hand-bookbinding master with 30 years of experience, overseeing Smyth-sewing and traditional leather binding.',
        },
        {
          image: '/images/about/team-2.png',
          name: 'David Kim',
          role: 'Creative Director',
          description:
            "A Central Saint Martins graduate who designed Shiny Book's own classic editorial templates.",
        },
        {
          image: '/images/about/team-3.png',
          name: 'Jiwoo Han',
          role: 'Chief Paper Curator',
          description:
            'Appraises eco-friendly, high-quality paper stock from around the world and controls precise print color.',
        },
      ],
    },
  },
  atelier: {
    hero: {
      eyebrow: 'Inside the Shiny Book Workshop',
      title: 'The Atelier',
      description:
        'A workspace that carries the quiet, meticulous spirit of a traditional hand bindery passed down over generations. Feel the character of eco-friendly materials that only deepen with time.',
    },
    process: [
      {
        image: '/images/atelier/process-1.png',
        title: 'Rigorous paper analysis and print proofing',
        description:
          'We precisely measure the humidity and weight of imported fine art archival paper to find the ideal non-toxic ink absorption, printing a subtle, refined texture digital alone cannot reproduce.',
      },
      {
        image: '/images/atelier/process-2.png',
        title: 'Smyth-sewing and traditional binding',
        description:
          'Binders trained for years thread each stitch on the sewing frame, weaving the pages into a sturdy block. This is what lets a book lie fully flat at 180 degrees for decades without cracking.',
      },
      {
        image: '/images/atelier/process-3.png',
        title: 'Hand pressing and final quality check',
        description:
          'After machine pressing, books rest under hand presses for a day or more to set their form. Before shipping, every stitch and package is inspected one final time.',
      },
    ],
    materials: {
      title: 'Our Handcraft Material Library',
      items: [
        {
          eyebrow: 'Papers',
          title: 'Arches fine art archival paper',
          description:
            'Never yellows over time, staying acid-free, with a matte coating that gives a warm, ink-wash-like texture.',
        },
        {
          eyebrow: 'Leathers',
          title: 'Florentine full-grain natural leather',
          description:
            'Tanned by Italian leather artisans using only plant-based tannins, with a natural sheen and quiet elegance.',
        },
        {
          eyebrow: 'Fabrics',
          title: 'Eco natural Belgian linen',
          description:
            'Hand-woven yarn fabric from natural Belgian flax that feels warm and cozy to the touch.',
        },
      ],
    },
  },
  layoutGuidelines: {
    hero: {
      eyebrow: 'Editorial Specs',
      title: 'Layout Guidelines',
      description:
        'The best photobook proportions and print-optimized specs, tuned by our designers and print artisans. Get the format and margins right to elevate your keepsake.',
    },
    specs: {
      eyebrow: 'Optimization Guide',
      title: 'Recommended Image Specs',
      items: [
        {
          title: 'Resolution',
          description:
            'To fully preserve print sharpness, we strongly recommend high-quality JPG/PNG images at 300 DPI or higher.',
        },
        {
          title: 'Color Space',
          description:
            'Use your original sRGB profile for rich, faithful print tones. We auto-correct to our print equipment calibration before output.',
        },
      ],
    },
    templates: {
      eyebrow: 'Classic Templates',
      title: 'Available Layout Preview',
      items: [
        {
          image: '/images/layout-guidelines/classic-single.png',
          title: 'Classic Single',
          description:
            'A timeless default format that pairs generous whitespace with a single portrait or landscape per page.',
        },
        {
          image: '/images/layout-guidelines/panorama-spread.png',
          title: 'Panorama Spread',
          description:
            'Uses the 180-degree lay-flat spread of our Smyth-sewn binding to run a grand landscape photo uninterrupted across the gutter.',
        },
        {
          image: '/images/layout-guidelines/grid-collage.png',
          title: 'Grid Collage',
          description:
            'A documentary format that compactly arranges chronological or detail shots in a 2x2 or 3x3 grid.',
        },
        {
          image: '/images/layout-guidelines/full-bleed.png',
          title: 'Full Bleed',
          description:
            'Fills the entire page with a high-resolution image, no text or margins, for total immersion and warmth.',
        },
      ],
    },
  },
  ecoPapers: {
    hero: {
      eyebrow: 'Ecological Papers',
      title: 'Our Paper Promise',
      description:
        'Every book we make is designed to do no harm to the planet, and only bring joy to the person who keeps it. FSC-certified eco paper is how we live alongside nature.',
    },
    fsc: {
      title: 'FSC® certification and eco soy ink',
      description:
        'Every text block and cover fabric Shiny Book uses is made only from materials tracked under the Forest Stewardship Council (FSC), the international body protecting forest resources sustainably. We use plant-based soy inks throughout, blocking volatile organic compounds, so they stay safe even against skin for long periods.',
    },
    catalog: {
      eyebrow: 'Atelier Swatches',
      title: 'Premium Paper Catalog',
      items: [
        {
          image: '/images/eco-papers/fine-art-matte.png',
          name: 'Fine Art Matte',
          weight: '240 gsm',
          description:
            'An imported signature paper with a calm, deep matte texture, ideal for pastoral landscapes or quiet portrait collections.',
          bestFor: 'Best for fine art & landscape photos',
        },
        {
          image: '/images/eco-papers/lustre-semi-gloss.png',
          name: 'Lustre Semi-Gloss',
          weight: '260 gsm',
          description:
            'A subtle, refined micro-sheen coating with vivid color retention and highlight rendering, a great match for wedding albums and lively portrait snaps.',
          bestFor: 'Best for bright portraiture & wedding albums',
        },
        {
          image: '/images/eco-papers/cotton-rag.png',
          name: 'Cotton Rag',
          weight: '310 gsm',
          description:
            'A museum-grade fine art paper made from 100% organic cotton fiber, guaranteeing non-toxic pH-neutral archival preservation with an elegant soft-white thickness.',
          bestFor: 'Best for archival art reproductions',
        },
        {
          image: '/images/eco-papers/recycled-kraft.png',
          name: 'Recycled Kraft',
          weight: '180 gsm',
          description:
            'A rustic, warm natural brown 100% sustainable recycled paper that adds distinct character to film photography, travel reflections, essays, and watercolor sketches.',
          bestFor: 'Best for vintage film & journal essays',
        },
      ],
    },
    impact: {
      eyebrow: 'Cumulative Progress',
      title: 'Natural Resource Protection Stats',
      asOfLabel: 'As of July 2026',
      stats: [
        { value: '1,420+', label: 'Managed Trees Saved' },
        { value: '12.4 Tons', label: 'Carbon Footprint Offset' },
        { value: '320k Liters', label: 'Pure Water Conserved' },
      ],
    },
  },
  sustainability: {
    hero: {
      eyebrow: 'Ecological Story',
      title: 'Our Eco Mission',
      description:
        'Shiny Book preserves the beauty of owning a paper book, while running a strict, honest zero-carbon system so the process never harms forest conservation or a greener future.',
    },
    pillars: {
      eyebrow: 'Operational Commitments',
      title: 'Three Pillars of Ecology',
      items: [
        {
          title: 'Responsible Sourcing',
          tag: 'FSC-certified paper & eco materials',
          description:
            'From raw materials onward, we use only non-toxic, forest-traceable fine art paper to help preserve forests.',
        },
        {
          title: 'Zero-Waste Production',
          tag: 'Cut-loss-minimizing design',
          description:
            'Precision layout design radically reduces scrap loss, driving a self-sustaining recycling cycle.',
        },
        {
          title: 'Carbon-Neutral Delivery',
          tag: 'Carbon-neutral shipping',
          description:
            'We partner with international climate protection organizations and reforestation funds to offset shipping emissions.',
        },
      ],
    },
    roadmap: {
      eyebrow: 'Roadmap',
      title: 'Future Eco Goals Timeline',
      items: [
        {
          year: '2025',
          title: 'Fully sustainable, eco-friendly packaging',
          description:
            'Transitioning every packaging material, from cushioning to adhesive tape, to biodegradable organic sources.',
        },
        {
          year: '2026',
          title: 'Solar-powered atelier',
          description:
            'Installing solar panels across our print and hand-binding workshop roofs to reach carbon-free operations.',
        },
      ],
    },
  },
  shippingPolicy: {
    hero: {
      eyebrow: 'Logistics & Delivery',
      title: 'Safe Passage',
      description:
        'A careful, rigorous shipping safety guide for delivering your finished keepsake to your door in perfect, undamaged condition.',
    },
    methods: {
      eyebrow: 'Execution Tiers',
      title: 'Shipping Methods & Rates',
    },
    viewPricingButton: 'View shipping rates',
    packaging: {
      eyebrow: 'The Unboxing Ritual',
      title: 'Custom Preservation Packaging',
      description:
        'To fully prevent corner crushing or surface scratches in transit, we ship every book in a double-sealed, moisture-controlled package: a sturdy recycled cardboard protective frame plus a neutral humidity-control paper pouch.',
      subtitle: 'Double-protection box with non-toxic cushioning',
      badgeLabel: 'Custom hard box included at no charge',
    },
    returns: {
      title: 'Returns & Production Exchange Policy',
      description:
        "Shiny Book photobooks are custom-produced to order based on your private photos and personal template settings. Because of this, we can't cancel or refund an order mid-production simply due to a change of mind. However, if a defect in the book itself or a binding flaw is found, we promise a free, expedited reprint exchange within 7 days of receipt.",
    },
  },
  press: {
    hero: {
      eyebrow: 'Media & Press Relations',
      title: 'Press Inquiries',
      description:
        "A collection of brand assets showcasing Shiny Book's handcrafted atelier values and design-led approach.",
    },
    features: {
      title: 'Recent Features & Mentions',
      items: [
        {
          date: '2025.10',
          outlet: 'Classic Living Korea',
          headline: 'Where hand bookbinding tradition meets modern editorial craft: Shiny Book',
        },
        {
          date: '2025.08',
          outlet: 'The Atelier Weekly',
          headline: 'Printing your most personal, everyday moments into a permanent fine art book',
        },
        {
          date: '2025.05',
          outlet: 'Eco Design Digest',
          headline:
            'A premium archival photobook made with FSC-certified biodegradable paper and non-toxic soy ink',
        },
      ],
    },
    contact: {
      title: 'Media Contact',
      description: 'For interviews, coverage, or partnership proposals, please reach us by email.',
      buttonLabel: 'Contact us by email',
    },
    factSheet: {
      title: 'Company Fact Sheet',
      items: [
        {
          label: 'Founded',
          value: '2023 | Started as a hand-bindery atelier in Seongsu-dong, Seoul',
        },
        {
          label: 'Key Products',
          value: 'Eco hardcover photobooks, hand-bound linen journals, leather family albums',
        },
        {
          label: 'Production Method',
          value: '180-degree lay-flat Smyth-sewn binding with eco soy-ink printing',
        },
        {
          label: 'Milestones',
          value: 'Surpassed 10,000 printed volumes while offsetting natural resource impact',
        },
      ],
    },
  },
  review: {
    title: 'Reviews',
    empty: 'No reviews yet.',
    hero: {
      eyebrow: 'Customer Board',
      title: 'Customer Reviews',
      averageLabel: 'Average Rating',
      totalReviewsLabel: '{count} Total Reviews',
    },
    filters: {
      allProducts: 'All Products',
    },
  },
  legal: {
    lastUpdatedLabel: 'Last updated',
    terms: {
      title: 'Terms of Service',
      lastUpdated: 'August 14, 2026',
      sections: [
        {
          heading: 'Article 1 (Purpose)',
          body: 'These Terms govern the rights, obligations, and responsibilities between the "Mall" operated by Shiny Book and users regarding the use of the book printing service provided through the internet cyber mall.',
        },
        {
          heading: 'Article 2 (Definitions)',
          body: '"Mall" means the website operated by the Company to provide goods or services to users. "User" means a member or non-member who accesses the Mall and uses the services provided under these Terms. "Member" means a person registered with the Mall who may continuously use the services provided by the Mall.',
        },
        {
          heading: 'Article 3 (Posting, Explanation, and Amendment of Terms)',
          body: 'The Mall posts these Terms on its initial screen so that users can be aware of them. The Mall may amend these Terms within the scope permitted by applicable law, and will announce the effective date and reasons for amendment along with the current Terms in advance.',
        },
        {
          heading: 'Article 4 (Provision and Change of Service)',
          body: 'The Mall provides manuscript/cover upload, order production, payment, and shipment tracking services. The Mall may change the content of goods to be provided under future contracts in the event of a stockout or change in technical specifications.',
        },
        {
          heading: 'Article 5 (Suspension of Service)',
          body: 'The Mall may temporarily suspend the Service in the event of maintenance, replacement, or failure of computer or other information communication equipment, or communication outages.',
        },
        {
          heading: 'Article 6 (Membership)',
          body: 'A user applies for membership by filling out the registration form set by the Mall and expressing agreement to these Terms; the membership agreement is established when the Mall accepts the application.',
        },
        {
          heading: "Article 7 (Withdrawal and Loss of Member's Status)",
          body: "A member may request withdrawal from the Mall at any time, and the Mall will process the withdrawal immediately. The Mall may restrict or suspend a member's status if the member violates applicable law or these Terms.",
        },
        {
          heading: 'Article 8 (Notices to Members)',
          body: 'When the Mall gives notice to a member, it may do so via the email address submitted at registration or via a notice within the account page.',
        },
        {
          heading: 'Article 9 (Purchase Application and Consent to Provide Personal Information)',
          body: 'A user applies to purchase by uploading a manuscript and cover file and entering the book title, quantity, and similar details; in this process, the Mall may request personal information from the user as necessary to provide the service, including shipping.',
        },
        {
          heading: 'Article 10 (Formation of Contract)',
          body: "The Mall accepts a purchase application under Article 9 except where the content contains false statements, omissions, or errors, and the contract is deemed formed when the Mall's acceptance reaches the user.",
        },
        {
          heading: 'Article 11 (Payment Methods)',
          body: 'Payment for goods purchased through the Mall may be made by credit card or other available payment methods, and payments are processed through the payment gateway (PG) provider, Toss Payments Corp.',
        },
        {
          heading:
            'Article 12 (Confirmation Notice, and Change/Cancellation of Purchase Application)',
          body: 'The Mall sends a confirmation notice to the user upon receiving a purchase application. The user may request a change or cancellation of the purchase application after receiving the confirmation notice and before production begins.',
        },
        {
          heading: 'Article 13 (Supply of Goods)',
          body: 'Unless otherwise agreed with the user regarding the timing of supply, the Mall arranges for goods to be shipped within 7 days of the date the user submitted the order.',
        },
        {
          heading: 'Article 14 (Refunds)',
          body: 'If the Mall is unable to supply goods requested by a user, it will notify the user of the reason without delay, and if payment was received in advance, will refund it or take the necessary measures to do so within 3 business days of receipt.',
        },
        {
          heading: 'Article 15 (Withdrawal of Offer)',
          body: "A user who has entered into a purchase contract with the Mall may withdraw the offer within 7 days of the date of contract. However, given that printed materials are individually produced to the user's specifications, withdrawal may be restricted once production has begun.",
        },
        {
          heading: 'Article 16 (Effects of Withdrawal of Offer)',
          body: 'The Mall refunds the amount already paid within 3 business days of receiving the returned goods, and the party responsible for return costs arising from withdrawal is determined in accordance with applicable law.',
        },
        {
          heading: 'Article 17 (Protection of Personal Information)',
          body: "The Mall collects the minimum personal information necessary to provide the service and endeavors to protect users' personal information as required by applicable law. Further details are governed by the Privacy Policy.",
        },
        {
          heading: 'Article 18 (Obligations of the Mall)',
          body: "The Mall does not engage in conduct prohibited by law or these Terms or contrary to public order, and makes every effort to provide continuous and stable service. The Mall maintains a security system to protect users' personal information.",
        },
        {
          heading: "Article 19 (Member's Obligations Regarding ID and Password)",
          body: 'Members are responsible for managing their own account and must not allow third parties to use it. If a member becomes aware that their account has been stolen or is being used by a third party, they must notify the Mall immediately.',
        },
        {
          heading: "Article 20 (User's Obligations)",
          body: "Users must not register false information, use another person's information without authorization, or alter information posted on the Mall. Users must not upload manuscripts or covers that infringe the copyrights or other intellectual property rights of others.",
        },
        {
          heading: 'Article 21 (Relationship Between Linked and Linking "Malls")',
          body: 'Where a mall is connected to another mall by hyperlink or similar means, the former is called the linking mall and the latter the linked mall. The linking mall is not liable for transactions conducted with users based on goods independently provided by the linked mall.',
        },
        {
          heading: 'Article 22 (Copyright Ownership and Restrictions on Use)',
          body: "Copyright in manuscripts and covers uploaded by users belongs to the user. Copyright and other intellectual property rights in works created by the Mall belong to the Mall, and users may not use information obtained through the Mall for commercial purposes without the Mall's prior consent.",
        },
        {
          heading: 'Article 23 (Dispute Resolution)',
          body: 'The Mall operates a customer support center to reflect legitimate opinions or complaints raised by users and to process compensation for damages. Disputes between the Mall and users may be resolved through a dispute mediation body such as the e-commerce dispute mediation committee.',
        },
        {
          heading: 'Article 24 (Jurisdiction and Governing Law)',
          body: "Lawsuits regarding disputes between the Mall and users are governed by the user's address at the time of filing, or place of residence if no address exists, under the exclusive jurisdiction of the competent district court, and the laws of the Republic of Korea apply to disputes related to these Terms.",
        },
        {
          heading: 'Business Information',
          body: 'Company name: Shiny Book\nRepresentative: Hong Gil-dong\nBusiness registration number: 000-00-00000\nMail order sales registration number: No. 2026-Seoul Jung-gu-0000\nAddress: 110 Sejong-daero, Jung-gu, Seoul, Republic of Korea\nPhone: 02-0000-0000\nEmail: example@example.com',
        },
      ],
    },
    privacy: {
      title: 'Privacy Policy',
      lastUpdated: 'August 14, 2026',
      sections: [
        {
          heading: '1. Personal Information Collected',
          body: 'The Mall collects email address and password (stored encrypted) for membership registration and service provision. Recipient information may additionally be collected for orders and shipping.',
        },
        {
          heading: '2. Purpose of Collection and Use',
          body: 'Collected personal information is used only for member identification and login authentication, order processing and shipping, customer support, and payment processing.',
        },
        {
          heading: '3. Retention and Use Period',
          body: 'Personal information is destroyed without delay upon membership withdrawal, except where retention is required by applicable law, in which case it is retained for the period required by that law.',
        },
        {
          heading: '4. Provision to Third Parties',
          body: 'The Mall does not provide personal information to external parties in principle, except for the minimum information necessary to the courier for shipping purposes.',
        },
        {
          heading: '5. Outsourcing of Personal Information Processing',
          body: 'The Mall outsources payment processing to Toss Payments Corp. and sets out the necessary matters in the outsourcing agreement to ensure personal information is managed securely.',
        },
        {
          heading: "6. Users' Rights and How to Exercise Them",
          body: 'Users may view or edit their personal information at any time through their account page, and may withdraw consent to the collection and use of personal information by deleting their account.',
        },
        {
          heading: '7. Destruction of Personal Information',
          body: 'When the retention period has elapsed or the purpose of processing has been achieved, the relevant personal information is destroyed without delay.',
        },
        {
          heading: '8. Personal Information Protection Officer',
          body: 'Personal Information Protection Officer: Hong Gil-dong / Contact: example@example.com',
        },
      ],
    },
  },
} as const;
