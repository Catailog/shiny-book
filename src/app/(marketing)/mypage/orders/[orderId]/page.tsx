import Link from 'next/link';
import { notFound } from 'next/navigation';

import { OrderStatusBadge } from '@/components/order-status-badge';
import { ShipmentTrackingSteps } from '@/components/shipment-tracking-steps';
import { ShippingAddressSummary } from '@/components/shipping-address-summary';
import { isOrderStatus } from '@/constants/order-status';
import { CONSUMER_ROUTES } from '@/constants/routes';
import { formatDateTime } from '@/lib/format-date';
import { getLocale } from '@/lib/i18n/get-locale';
import { getConsumerOrderDetail } from '@/lib/orders/get-consumer-order-detail';
import { locales } from '@/locales';

export default async function OrderDetailPage(props: PageProps<'/mypage/orders/[orderId]'>) {
  const { orderId } = await props.params;
  const detail = await getConsumerOrderDetail(orderId);
  if (!detail) {
    notFound();
  }

  const locale = await getLocale();
  const t = locales[locale];
  const td = t.consumer.mypage.orders.detail;
  const { order, payment, shippingAddress, events, shipment } = detail;
  const status = isOrderStatus(order.status) ? order.status : null;

  return (
    <div className="flex flex-1 flex-col gap-6 px-6 py-8">
      <div className="flex flex-col gap-2">
        <Link href={CONSUMER_ROUTES.MYPAGE} className="text-xs text-muted-foreground underline">
          {td.backLink}
        </Link>
        <h1 className="text-2xl font-semibold text-foreground">{order.title}</h1>
      </div>

      <section className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4">
        <h2 className="text-sm font-semibold text-foreground">{td.summaryTitle}</h2>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <dt className="text-muted-foreground">{td.quantityLabel}</dt>
          <dd className="text-foreground">
            {order.quantity}
            {t.consumer.mypage.orders.quantitySuffix}
          </dd>
          <dt className="text-muted-foreground">{td.amountLabel}</dt>
          <dd className="text-foreground">₩{order.amount.toLocaleString()}</dd>
          <dt className="text-muted-foreground">{td.orderedAtLabel}</dt>
          <dd className="text-foreground">{formatDateTime(order.created_at)}</dd>
          <dt className="text-muted-foreground">{td.statusLabel}</dt>
          <dd>{status ? <OrderStatusBadge status={status} /> : order.status}</dd>
        </dl>
      </section>

      {payment ? (
        <section className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4">
          <h2 className="text-sm font-semibold text-foreground">{td.paymentTitle}</h2>
          <dl className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">{td.merchandiseLabel}</dt>
              <dd className="text-foreground">₩{payment.merchandiseAmount.toLocaleString()}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">{td.shippingFeeLabel}</dt>
              <dd className="text-foreground">₩{payment.shippingFee.toLocaleString()}</dd>
            </div>
            {payment.discountAmount > 0 ? (
              <div className="flex justify-between">
                <dt className="text-muted-foreground">
                  {td.discountLabel}
                  {payment.couponCode ? ` (${payment.couponCode})` : ''}
                </dt>
                <dd className="text-foreground">-₩{payment.discountAmount.toLocaleString()}</dd>
              </div>
            ) : null}
            <div className="flex justify-between border-t border-border pt-2 font-semibold">
              <dt className="text-foreground">{td.totalLabel}</dt>
              <dd className="text-foreground">₩{payment.finalAmount.toLocaleString()}</dd>
            </div>
          </dl>
        </section>
      ) : null}

      {shippingAddress ? (
        <section className="flex flex-col gap-2 rounded-lg border border-border bg-card p-4">
          <h2 className="text-sm font-semibold text-foreground">{td.shippingAddressTitle}</h2>
          <ShippingAddressSummary
            recipientName={shippingAddress.recipientName}
            phone={shippingAddress.phone}
            postalCode={shippingAddress.postalCode}
            addressLine1={shippingAddress.addressLine1}
            addressLine2={shippingAddress.addressLine2}
          />
        </section>
      ) : null}

      {shipment ? (
        <section className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4">
          <div className="flex flex-col gap-0.5">
            <h2 className="text-sm font-semibold text-foreground">{td.trackingTitle}</h2>
            <span className="text-sm text-foreground">
              <span className="text-muted-foreground">{td.trackingNumberLabel}</span>{' '}
              {shipment.trackingNumber}
            </span>
          </div>
          <ShipmentTrackingSteps steps={shipment.steps} labels={t.shipmentStatus} />
        </section>
      ) : null}

      <section className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4">
        <h2 className="text-sm font-semibold text-foreground">{td.timelineTitle}</h2>
        {events.length > 0 ? (
          <ol className="space-y-3">
            {events.map((event) => (
              <li key={event.id} className="flex flex-col gap-0.5 border-l-2 border-border pl-3">
                <span className="text-sm font-medium text-foreground">{event.title}</span>
                <span className="text-xs text-muted-foreground">{formatDateTime(event.at)}</span>
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-sm text-muted-foreground">{td.timelineEmpty}</p>
        )}
      </section>
    </div>
  );
}
