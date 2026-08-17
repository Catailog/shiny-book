import Link from 'next/link';

import { OrderStatusBadge } from '@/components/order-status-badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ORDER_STATUS, isOrderStatus } from '@/constants/order-status';
import { getCurrentConsumer } from '@/lib/auth/get-current-consumer';
import { formatDate } from '@/lib/format-date';
import { getLocale } from '@/lib/i18n/get-locale';
import { getInquiriesByConsumer } from '@/lib/inquiries/get-inquiries-by-consumer';
import { getOrdersByConsumer } from '@/lib/orders/get-orders-by-consumer';
import { locales } from '@/locales';

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
  const [orders, inquiries] = consumer
    ? await Promise.all([getOrdersByConsumer(consumer.id), getInquiriesByConsumer(consumer.id)])
    : [[], []];

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
        <div className="rounded-lg border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.consumer.mypage.orders.columns.title}</TableHead>
                <TableHead>{t.consumer.mypage.orders.columns.quantity}</TableHead>
                <TableHead>{t.consumer.mypage.orders.columns.amount}</TableHead>
                <TableHead>{t.consumer.mypage.orders.columns.status}</TableHead>
                <TableHead>{t.consumer.mypage.orders.columns.createdAt}</TableHead>
                <TableHead>{t.consumer.mypage.orders.columns.actions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    {t.consumer.mypage.orders.empty}
                  </TableCell>
                </TableRow>
              ) : null}
              {orders.map((order) => {
                const status = isOrderStatus(order.status) ? order.status : null;

                return (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium text-foreground">{order.title}</TableCell>
                    <TableCell>
                      {order.quantity}
                      {t.consumer.mypage.orders.quantitySuffix}
                    </TableCell>
                    <TableCell>₩{order.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      {status ? <OrderStatusBadge status={status} /> : order.status}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(order.created_at)}
                    </TableCell>
                    <TableCell>
                      {status === ORDER_STATUS.COMPLETED ? (
                        <Link
                          href={`/mypage/orders/${order.id}/review`}
                          className="text-sm font-medium text-foreground underline"
                        >
                          {t.consumer.mypage.orders.reviewLink}
                        </Link>
                      ) : (
                        <span className="text-muted-foreground">-</span>
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
