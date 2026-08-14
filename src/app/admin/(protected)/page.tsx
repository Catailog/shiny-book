import { OrderStatusBadge } from '@/components/order-status-badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { isOrderStatus } from '@/constants/order-status';
import { getOrders } from '@/lib/orders/get-orders';
import { defaultLocale, locales } from '@/locales';

export default async function AdminDashboardPage() {
  const t = locales[defaultLocale];
  const orders = await getOrders();

  return (
    <div className="flex flex-1 flex-col gap-4 px-6 py-8">
      <h1 className="text-2xl font-semibold text-foreground">{t.admin.orders.title}</h1>
      {orders.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t.admin.orders.empty}</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t.admin.orders.columns.title}</TableHead>
              <TableHead>{t.admin.orders.columns.quantity}</TableHead>
              <TableHead>{t.admin.orders.columns.amount}</TableHead>
              <TableHead>{t.admin.orders.columns.status}</TableHead>
              <TableHead>{t.admin.orders.columns.createdAt}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium text-foreground">{order.title}</TableCell>
                <TableCell>
                  {order.quantity}
                  {t.admin.orders.quantitySuffix}
                </TableCell>
                <TableCell>{order.amount.toLocaleString()}</TableCell>
                <TableCell>
                  {isOrderStatus(order.status) ? (
                    <OrderStatusBadge status={order.status} />
                  ) : (
                    order.status
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(order.created_at).toLocaleString('ko-KR')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
