import Link from 'next/link';

import { OrderStatusBadge } from '@/components/order-status-badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { isOrderStatus } from '@/constants/order-status';
import { CONSUMER_ROUTES } from '@/constants/routes';
import { getCurrentConsumer } from '@/lib/auth/get-current-consumer';
import { getOrdersByConsumer } from '@/lib/orders/get-orders-by-consumer';
import { defaultLocale, locales } from '@/locales';

export default async function MypagePage() {
  const t = locales[defaultLocale];
  const consumer = await getCurrentConsumer();
  const orders = consumer ? await getOrdersByConsumer(consumer.id) : [];

  return (
    <div className="flex flex-1 flex-col gap-6 px-6 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">{t.consumer.mypage.title}</h1>
        <div className="flex gap-2">
          <Button
            render={<Link href={CONSUMER_ROUTES.INQUIRIES} />}
            nativeButton={false}
            variant="outline"
          >
            {t.consumer.mypage.inquiriesButton}
          </Button>
          <Button
            render={<Link href={CONSUMER_ROUTES.ACCOUNT} />}
            nativeButton={false}
            variant="outline"
          >
            {t.consumer.mypage.accountButton}
          </Button>
          <Button render={<Link href={CONSUMER_ROUTES.NEW_ORDER} />} nativeButton={false}>
            {t.consumer.mypage.newOrderButton}
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-medium text-foreground">{t.consumer.mypage.orders.title}</h2>
        {orders.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t.consumer.mypage.orders.empty}</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.consumer.mypage.orders.columns.title}</TableHead>
                <TableHead>{t.consumer.mypage.orders.columns.quantity}</TableHead>
                <TableHead>{t.consumer.mypage.orders.columns.amount}</TableHead>
                <TableHead>{t.consumer.mypage.orders.columns.status}</TableHead>
                <TableHead>{t.consumer.mypage.orders.columns.createdAt}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => {
                const status = isOrderStatus(order.status) ? order.status : null;

                return (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium text-foreground">{order.title}</TableCell>
                    <TableCell>
                      {order.quantity}
                      {t.consumer.mypage.orders.quantitySuffix}
                    </TableCell>
                    <TableCell>{order.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      {status ? <OrderStatusBadge status={status} /> : order.status}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(order.created_at).toLocaleString('ko-KR')}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
