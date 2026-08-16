import Link from 'next/link';

import { OrderStatusBadge } from '@/components/order-status-badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { getOrdersByConsumer } from '@/lib/orders/get-orders-by-consumer';
import { defaultLocale, locales } from '@/locales';

export default async function MypagePage() {
  const t = locales[defaultLocale];
  const consumer = await getCurrentConsumer();
  const orders = consumer ? await getOrdersByConsumer(consumer.id) : [];

  return (
    <div className="flex flex-1 flex-col gap-6 px-6 py-8">
      <h1 className="text-2xl font-semibold text-foreground">{t.consumer.mypage.title}</h1>

      <Card>
        <CardHeader>
          <CardTitle>{t.consumer.mypage.orders.title}</CardTitle>
        </CardHeader>
        <CardContent>
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
                  <TableHead>{t.consumer.mypage.orders.columns.actions}</TableHead>
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}
