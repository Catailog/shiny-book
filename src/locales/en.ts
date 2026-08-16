import type { AnnouncementCategory } from '@/constants/announcement-category';
import type { ApiErrorCode } from '@/constants/api-errors';
import type { OrderStatus } from '@/constants/order-status';

export const en = {
  common: {
    loading: 'Loading...',
    error: 'Something went wrong.',
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
      login: 'Sign in',
      signup: 'Sign up',
      mypage: 'My page',
      logout: 'Sign out',
      startOrder: 'Start an order',
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
        prevLabel: 'Previous review',
        nextLabel: 'Next review',
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
    backToMypageButton: 'Back to my page',
  },
  admin: {
    nav: {
      orders: 'Orders',
      coupons: 'Coupons',
      announcements: 'Announcements',
      faqs: 'FAQs',
      inquiries: 'Inquiries',
    },
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
        files: 'Files',
        actions: 'Actions',
      },
      quantitySuffix: 'copies',
      advanceButton: 'Advance to next stage',
      manuscriptButton: 'View manuscript',
      coverButton: 'View cover',
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
      activateButton: 'Activate',
      deactivateButton: 'Deactivate',
      form: {
        codeLabel: 'Coupon code',
        discountTypeLabel: 'Discount type',
        discountValueLabel: 'Discount value',
        maxUsesLabel: 'Max uses',
        expiresAtLabel: 'Expires at',
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
      errors: {
        unauthorized: 'You do not have permission. Please sign in again.',
        validation_failed: 'Please check your input and try again.',
        code_taken: 'This coupon code is already in use.',
        conflict: 'This was already changed elsewhere. Please refresh and try again.',
        unexpected_error: 'Something went wrong. Please try again shortly.',
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
      viewLink: 'View',
      answerLabel: 'Answer',
      answerButton: 'Submit answer',
      answering: 'Submitting...',
      answerSuccess: 'Answer submitted.',
      errors: {
        unauthorized: 'You do not have permission. Please sign in again.',
        validation_failed: 'Please check your input and try again.',
        unexpected_error: 'Something went wrong. Please try again shortly.',
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
      accountButton: 'Account settings',
      inquiriesButton: 'Inquiries',
      orders: {
        title: 'Order history',
        empty: 'No orders yet.',
        columns: {
          title: 'Title',
          quantity: 'Quantity',
          amount: 'Amount',
          status: 'Status',
          createdAt: 'Created at',
          actions: 'Actions',
        },
        quantitySuffix: 'copies',
        reviewLink: 'Review',
      },
    },
    account: {
      title: 'Account settings',
      passwordLabel: 'New password',
      passwordConfirmLabel: 'Confirm new password',
      submitButton: 'Change password',
      submitting: 'Changing...',
      success: 'Your password has been changed.',
      errors: {
        passwordTooShort: 'Password must be at least 6 characters.',
        passwordMismatch: 'Passwords do not match.',
        unauthorized: 'You do not have permission. Please sign in again.',
        validation_failed: 'Please check your input and try again.',
        unexpected_error: 'Something went wrong. Please try again shortly.',
      },
    },
    orderNew: {
      title: 'Create an order',
      titleLabel: 'Book title',
      quantityLabel: 'Quantity',
      manuscriptLabel: 'Manuscript file (PDF)',
      coverLabel: 'Cover image',
      couponLabel: 'Coupon code (optional)',
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
        coupon_not_found: 'This coupon code does not exist.',
        coupon_inactive: 'This coupon is not available.',
        coupon_expired: 'This coupon has expired.',
        coupon_usage_limit_reached: 'This coupon has reached its usage limit.',
        coupon_conflict: 'This coupon was just used elsewhere. Please try again.',
        unexpected_error: 'Something went wrong. Please try again shortly.',
      },
    },
    inquiries: {
      title: 'Inquiries',
      newTitle: 'New inquiry',
      newButton: 'New inquiry',
      empty: 'No inquiries yet.',
      statusPending: 'Pending',
      statusAnswered: 'Answered',
      answerLabel: 'Answer',
      backToList: 'Back to list',
      form: {
        titleLabel: 'Title',
        contentLabel: 'Content',
        submitButton: 'Submit',
        submitting: 'Submitting...',
      },
      errors: {
        unauthorized: 'You do not have permission. Please sign in again.',
        validation_failed: 'Please check your input and try again.',
        unexpected_error: 'Something went wrong. Please try again shortly.',
      },
    },
    reviews: {
      notCompleted: 'Only completed orders can be reviewed.',
      ratingLabel: 'Rating',
      form: {
        ratingLabel: 'Rating',
        contentLabel: 'Review',
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
      title: 'Announcements',
      empty: 'No announcements yet.',
    },
    detail: {
      backToList: 'Back to list',
    },
  },
  faq: {
    title: 'Frequently asked questions',
    empty: 'No FAQs yet.',
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
  review: {
    title: 'Reviews',
    empty: 'No reviews yet.',
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
