import { DollarSign, Settings, ShoppingCart, Tag } from 'lucide-react';

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
import { getCoupons } from '@/lib/coupons/get-coupons';
import { formatDate } from '@/lib/format-date';
import { getLocale } from '@/lib/i18n/get-locale';
import { getOrders } from '@/lib/orders/get-orders';
import { getNextStatuses } from '@/lib/orders/order-state-machine';
import { locales } from '@/locales';

import { AdminTopbar } from './admin-topbar';
import { AdvanceOrderStatusButton } from './advance-order-status-button';
import { ViewOrderFileButton } from './view-order-file-button';

const PENDING_PRODUCTION_STATUSES = new Set<string>([
  ORDER_STATUS.PAID,
  ORDER_STATUS.PRINTING,
  ORDER_STATUS.BINDING,
  ORDER_STATUS.SHIPPING,
]);

export default async function AdminDashboardPage() {
  const locale = await getLocale();
  const t = locales[locale];
  const [orders, coupons] = await Promise.all([getOrders(), getCoupons()]);

  const today = new Date().toDateString();
  const todayOrders = orders.filter((order) => new Date(order.created_at).toDateString() === today);
  const pendingProduction = orders.filter((order) => PENDING_PRODUCTION_STATUSES.has(order.status));
  const now = new Date();
  const revenueThisMonth = orders
    .filter((order) => {
      const createdAt = new Date(order.created_at);
      return (
        order.status !== ORDER_STATUS.AWAITING_PAYMENT &&
        createdAt.getFullYear() === now.getFullYear() &&
        createdAt.getMonth() === now.getMonth()
      );
    })
    .reduce((sum, order) => sum + order.amount, 0);
  const activeCoupons = coupons.filter((coupon) => coupon.is_active);

  const kpis = [
    { key: 'todayOrders', value: String(todayOrders.length), icon: ShoppingCart },
    { key: 'pendingProduction', value: String(pendingProduction.length), icon: Settings },
    { key: 'revenueThisMonth', value: `₩${revenueThisMonth.toLocaleString()}`, icon: DollarSign },
    { key: 'activeCoupons', value: String(activeCoupons.length), icon: Tag },
  ] as const;

  return (
    <div className="flex flex-1 flex-col">
      <AdminTopbar title={t.admin.dashboard.title} />
      <div className="flex flex-1 flex-col gap-6 px-10 py-8">
        <div className="grid grid-cols-4 gap-6">
          {kpis.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <div
                key={kpi.key}
                className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-muted-foreground">
                    {t.admin.dashboard.kpi[kpi.key]}
                  </span>
                  <div className="flex size-9 items-center justify-center rounded-md bg-primary-soft">
                    <Icon aria-hidden="true" className="size-4.5 text-primary" />
                  </div>
                </div>
                <span className="font-heading text-3xl font-bold text-foreground">{kpi.value}</span>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6">
          <h2 className="font-heading text-xl font-bold text-foreground">
            {t.admin.dashboard.recentSubmissions.title}
          </h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.admin.orders.columns.title}</TableHead>
                <TableHead>{t.admin.orders.columns.quantity}</TableHead>
                <TableHead>{t.admin.orders.columns.amount}</TableHead>
                <TableHead>{t.admin.orders.columns.status}</TableHead>
                <TableHead>{t.admin.orders.columns.files}</TableHead>
                <TableHead>{t.admin.orders.columns.createdAt}</TableHead>
                <TableHead>{t.admin.orders.columns.actions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    {t.admin.orders.empty}
                  </TableCell>
                </TableRow>
              ) : null}
              {orders.map((order) => {
                const status = isOrderStatus(order.status) ? order.status : null;
                const nextStatus =
                  status && status !== ORDER_STATUS.AWAITING_PAYMENT
                    ? getNextStatuses(status)[0]
                    : undefined;

                return (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium text-foreground">{order.title}</TableCell>
                    <TableCell>
                      {order.quantity}
                      {t.admin.orders.quantitySuffix}
                    </TableCell>
                    <TableCell>₩{order.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      {status ? <OrderStatusBadge status={status} /> : order.status}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1.5">
                        <ViewOrderFileButton
                          path={order.manuscript_file_url}
                          label={t.admin.orders.manuscriptButton}
                        />
                        <ViewOrderFileButton
                          path={order.cover_file_url}
                          label={t.admin.orders.coverButton}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(order.created_at)}
                    </TableCell>
                    <TableCell>
                      {status && nextStatus ? (
                        <AdvanceOrderStatusButton
                          orderId={order.id}
                          from={status}
                          to={nextStatus}
                        />
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
