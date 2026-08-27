import { notFound } from 'next/navigation';

import { CancelOrderButton } from '@/components/cancel-order-button';
import { ORDER_STATUS } from '@/constants/order-status';
import { env } from '@/env';
import { getCurrentConsumer } from '@/lib/auth/get-current-consumer';
import { formatCurrency } from '@/lib/format/currency';
import { getLocale } from '@/lib/i18n/get-locale';
import { getOrderById } from '@/lib/orders/get-order-by-id';
import { getOrderPaymentSummary } from '@/lib/orders/get-order-payment-summary';
import { locales } from '@/locales';

import { BackButton } from './back-button';
import { CheckoutWidget } from './checkout-widget';
import { CouponForm } from './coupon-form';

export default async function CheckoutPage(props: PageProps<'/checkout/[orderId]'>) {
  const { orderId } = await props.params;
  const [consumer, order, paymentSummary] = await Promise.all([
    getCurrentConsumer(),
    getOrderById(orderId),
    getOrderPaymentSummary(orderId),
  ]);
  const locale = await getLocale();
  const t = locales[locale];

  if (!order || !consumer || order.consumer_id !== consumer.id) {
    notFound();
  }

  if (order.status !== ORDER_STATUS.AWAITING_PAYMENT) {
    return (
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-2 px-4 text-center">
        <p className="text-lg font-medium text-foreground">{t.checkout.alreadyProcessed}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-10 px-6 py-16 lg:flex-row lg:items-start lg:gap-16">
      <div className="flex w-full flex-col gap-6 rounded-xl border border-border bg-secondary p-8 lg:w-90">
        <h2 className="font-heading text-xl font-bold text-foreground">
          {t.checkout.summaryTitle}
        </h2>
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <p className="font-heading text-base font-semibold text-foreground">{order.title}</p>
            <p className="text-sm text-muted-foreground">
              {order.quantity}
              {t.checkout.quantitySuffix}
            </p>
          </div>
        </div>
        <div className="h-px w-full bg-border" />
        {paymentSummary ? (
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{t.checkout.merchandiseAmountLabel}</span>
              <span className="text-foreground">
                {formatCurrency(paymentSummary.merchandiseAmount)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{t.checkout.shippingFeeLabel}</span>
              <span className="text-foreground">{formatCurrency(paymentSummary.shippingFee)}</span>
            </div>
            {paymentSummary.discountAmount > 0 ? (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  {t.checkout.coupon.discountLabel}
                  {paymentSummary.couponCode ? ` (${paymentSummary.couponCode})` : ''}
                </span>
                <span className="text-primary">
                  -{formatCurrency(paymentSummary.discountAmount)}
                </span>
              </div>
            ) : null}
          </div>
        ) : null}
        {paymentSummary && !paymentSummary.couponCode ? <CouponForm orderId={order.id} /> : null}
        <div className="h-px w-full bg-border" />
        <div className="flex items-center justify-between">
          <p className="font-heading text-base font-bold text-foreground">
            {t.checkout.amountLabel}
          </p>
          <p className="font-heading text-xl font-bold text-primary">
            {formatCurrency(order.amount)}
          </p>
        </div>
        <CancelOrderButton orderId={order.id} className="text-sm text-muted-foreground underline" />
      </div>
      <div className="flex flex-1 flex-col gap-8">
        <BackButton orderId={order.id} />
        <h1 className="font-heading text-3xl font-bold text-foreground">{t.checkout.title}</h1>
        <div className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold tracking-wide text-foreground uppercase">
            {t.checkout.paymentTitle}
          </h2>
          <div className="flex flex-col gap-2 rounded-lg bg-secondary p-4 text-sm">
            <p className="font-medium text-foreground">{t.checkout.testNotice.title}</p>
            <p className="text-muted-foreground">{t.checkout.testNotice.body}</p>
            <p className="text-muted-foreground">{t.checkout.testNotice.darkThemeNote}</p>
          </div>
          <CheckoutWidget
            orderId={order.id}
            orderName={order.title}
            amount={order.amount}
            allowTestPayment={env.ALLOW_TEST_PAYMENT}
          />
        </div>
      </div>
    </div>
  );
}
