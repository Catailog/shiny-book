import Link from 'next/link';

import { CancelOrderButton } from '@/components/cancel-order-button';
import { OrderStatusBadge } from '@/components/order-status-badge';
import { RelativeDate } from '@/components/relative-date';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ORDER_STATUS, isOrderStatus } from '@/constants/order-status';
import { isRefundableOrderStatus } from '@/constants/refund';
import { CONSUMER_ROUTES } from '@/constants/routes';
import { getCurrentConsumer } from '@/lib/auth/get-current-consumer';
import { formatIdPrefix } from '@/lib/format-id-prefix';
import { getLocale } from '@/lib/i18n/get-locale';
import { getInquiriesByConsumer } from '@/lib/inquiries/get-inquiries-by-consumer';
import { getOrdersByConsumer } from '@/lib/orders/get-orders-by-consumer';
import { getReviewsByConsumer } from '@/lib/reviews/get-reviews-by-consumer';
import { locales } from '@/locales';

import { ConsumerOrderHistoryButton } from './consumer-order-history-button';
import { RequestRefundButton } from './request-refund-button';

const IN_PROGRESS_STATUSES = new Set<string>([
  ORDER_STATUS.PAID,
  ORDER_STATUS.PRINTING,
  ORDER_STATUS.BINDING,
  ORDER_STATUS.SHIPPING,
]);

export default async function MypagePage() {
  const locale = await getLocale();
  const t = locales[locale];
  const consumer = await getCurrentConsumer();
  const [allOrders, inquiries, reviews] = consumer
    ? await Promise.all([
        getOrdersByConsumer(consumer.id),
        getInquiriesByConsumer(consumer.id),
        getReviewsByConsumer(consumer.id),
      ])
    : [[], [], []];
  const orders = allOrders.filter((order) => order.status !== ORDER_STATUS.CANCELLED);
  const reviewByOrderId = new Map(reviews.map((review) => [review.order_id, review]));
  const inquiryByOrderId = new Map(inquiries.map((inquiry) => [inquiry.order_id, inquiry]));

  const stats = [
    {
      key: 'completed',
      value: String(orders.filter((order) => order.status === ORDER_STATUS.COMPLETED).length),
      suffix: 'volumeSuffix',
      tone: 'text-foreground',
    },
    {
      key: 'inProgress',
      value: String(orders.filter((order) => IN_PROGRESS_STATUSES.has(order.status)).length),
      suffix: 'volumeSuffix',
      tone: 'text-primary',
    },
    {
      key: 'inquiries',
      value: String(inquiries.length),
      suffix: 'countSuffix',
      tone: 'text-foreground',
    },
  ] as const;

  return (
    <div className="flex flex-1 flex-col gap-8 px-10 py-10">
      <div>
        <h1 className="font-heading text-4xl font-bold text-foreground">
          {t.consumer.mypage.title}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{t.consumer.mypage.subtitle}</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.key}
            className="flex flex-col gap-2 rounded-lg border border-border bg-muted p-6"
          >
            <span className="text-sm font-semibold text-muted-foreground">
              {t.consumer.mypage.stats[stat.key]}
            </span>
            <span className={`font-heading text-4xl font-bold ${stat.tone}`}>
              {stat.value} {t.consumer.mypage.stats[stat.suffix]}
            </span>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="font-heading text-2xl font-bold text-foreground">
          {t.consumer.mypage.recentOrdersTitle}
        </h2>
        <div className="overflow-hidden rounded-lg border border-border bg-input-background">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted hover:bg-muted">
                <TableHead>{t.consumer.mypage.orders.columns.title}</TableHead>
                <TableHead className="w-20">{t.consumer.mypage.orders.columns.quantity}</TableHead>
                <TableHead className="w-28">{t.consumer.mypage.orders.columns.amount}</TableHead>
                <TableHead className="w-24">{t.consumer.mypage.orders.columns.status}</TableHead>
                <TableHead className="w-28">{t.consumer.mypage.orders.columns.createdAt}</TableHead>
                <TableHead className="w-24">{t.consumer.mypage.orders.columns.actions}</TableHead>
                <TableHead className="w-24">{t.consumer.mypage.orders.columns.inquiry}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    {t.consumer.mypage.orders.empty}
                  </TableCell>
                </TableRow>
              ) : null}
              {orders.map((order) => {
                const status = isOrderStatus(order.status) ? order.status : null;
                const review = reviewByOrderId.get(order.id) ?? null;
                const inquiry = inquiryByOrderId.get(order.id) ?? null;

                return (
                  <TableRow key={order.id} className="hover:bg-transparent">
                    <TableCell className="font-medium text-foreground">
                      <div className="flex flex-col gap-0.5">
                        <span className="truncate">{order.title}</span>
                        <span className="text-xs font-normal text-muted-foreground">
                          {formatIdPrefix(order.id)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {order.quantity}
                      {t.consumer.mypage.orders.quantitySuffix}
                    </TableCell>
                    <TableCell>₩{order.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex flex-col items-start gap-1">
                        {status ? <OrderStatusBadge status={status} /> : order.status}
                        <ConsumerOrderHistoryButton orderId={order.id} />
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      <RelativeDate value={order.created_at} locale={locale} />
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col items-start gap-1.5">
                        {status === ORDER_STATUS.COMPLETED ? (
                          <Link
                            href={`/mypage/orders/${order.id}/review`}
                            className="text-sm font-medium text-foreground underline"
                          >
                            {review
                              ? t.consumer.mypage.orders.reviewDoneLink
                              : t.consumer.mypage.orders.reviewWriteLink}
                          </Link>
                        ) : status === ORDER_STATUS.AWAITING_PAYMENT ? (
                          <div className="flex flex-col items-start gap-1">
                            <Link
                              href={`/checkout/${order.id}`}
                              className="text-sm font-medium text-primary underline"
                            >
                              {t.consumer.mypage.orders.payLink}
                            </Link>
                            <CancelOrderButton
                              orderId={order.id}
                              className="text-sm text-muted-foreground underline"
                            />
                          </div>
                        ) : null}
                        {status && isRefundableOrderStatus(status) ? (
                          <RequestRefundButton orderId={order.id} />
                        ) : null}
                        {status &&
                        status !== ORDER_STATUS.AWAITING_PAYMENT &&
                        !isRefundableOrderStatus(status) ? (
                          <span className="text-muted-foreground">-</span>
                        ) : null}
                      </div>
                    </TableCell>
                    <TableCell>
                      {inquiry ? (
                        <Link
                          href={`${CONSUMER_ROUTES.INQUIRIES}/${inquiry.id}`}
                          className="text-sm font-medium text-foreground underline"
                        >
                          {inquiry.answered_at && !inquiry.hasNewConsumerReply
                            ? t.consumer.inquiries.statusAnswered
                            : t.consumer.inquiries.statusPending}
                        </Link>
                      ) : (
                        <Link
                          href={`${CONSUMER_ROUTES.NEW_INQUIRY}?orderId=${order.id}`}
                          className="text-sm font-medium text-foreground underline"
                        >
                          {t.consumer.mypage.orders.inquiryLink}
                        </Link>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
