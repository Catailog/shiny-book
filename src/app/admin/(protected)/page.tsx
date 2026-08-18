import { DollarSign, Settings, ShoppingCart, Tag } from 'lucide-react';

import { FilterLink } from '@/components/filter-link';
import { OrderStatusBadge } from '@/components/order-status-badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ORDER_STATUS, type OrderStatus, isOrderStatus } from '@/constants/order-status';
import { ADMIN_ROUTES } from '@/constants/routes';
import { getCoupons } from '@/lib/coupons/get-coupons';
import { formatDate } from '@/lib/format-date';
import { getOrders } from '@/lib/orders/get-orders';
import { getNextStatuses, getPreviousStatus } from '@/lib/orders/order-state-machine';
import { defaultLocale, locales } from '@/locales';

import { AdminTopbar } from './admin-topbar';
import { AdvanceOrderStatusButton } from './advance-order-status-button';
import { RevertOrderStatusButton } from './revert-order-status-button';
import { ViewOrderPhotosButton } from './view-order-photos-button';

const PENDING_PRODUCTION_STATUSES = new Set<string>([
  ORDER_STATUS.PAID,
  ORDER_STATUS.PRINTING,
  ORDER_STATUS.BINDING,
  ORDER_STATUS.SHIPPING,
]);

const STATUS_FILTER_VALUES: readonly OrderStatus[] = [
  ORDER_STATUS.AWAITING_PAYMENT,
  ORDER_STATUS.PAID,
  ORDER_STATUS.PRINTING,
  ORDER_STATUS.BINDING,
  ORDER_STATUS.SHIPPING,
  ORDER_STATUS.COMPLETED,
];

export default async function AdminDashboardPage(props: PageProps<'/admin'>) {
  const t = locales[defaultLocale];
  const searchParams = await props.searchParams;
  const filterParam = firstParam(searchParams.filter);
  const activeFilter = isOrderStatus(filterParam) ? filterParam : null;

  const [allOrders, coupons] = await Promise.all([getOrders(), getCoupons()]);
  const orders = activeFilter
    ? allOrders.filter((order) => order.status === activeFilter)
    : allOrders;

  const today = new Date().toDateString();
  const todayOrders = allOrders.filter(
    (order) => new Date(order.created_at).toDateString() === today,
  );
  const pendingProduction = allOrders.filter((order) =>
    PENDING_PRODUCTION_STATUSES.has(order.status),
  );
  const now = new Date();
  const revenueThisMonth = allOrders
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
          <div className="flex flex-wrap gap-2">
            <FilterLink href={ADMIN_ROUTES.DASHBOARD} isActive={activeFilter === null}>
              {t.admin.orders.filterAllLabel}
            </FilterLink>
            {STATUS_FILTER_VALUES.map((status) => (
              <FilterLink
                key={status}
                href={`${ADMIN_ROUTES.DASHBOARD}?filter=${status}`}
                isActive={activeFilter === status}
              >
                {t.orderStatus[status]}
              </FilterLink>
            ))}
          </div>
          <div className="overflow-hidden rounded-lg border border-border bg-input-background">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted hover:bg-muted">
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
                  const previousStatus = status ? getPreviousStatus(status) : null;

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
                        {order.page_count !== null ? (
                          <ViewOrderPhotosButton orderId={order.id} />
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(order.created_at)}
                      </TableCell>
                      <TableCell>
                        {status ? (
                          <div className="flex gap-2">
                            <RevertOrderStatusButton
                              orderId={order.id}
                              from={status}
                              to={previousStatus}
                            />
                            <AdvanceOrderStatusButton
                              orderId={order.id}
                              from={status}
                              to={nextStatus ?? null}
                            />
                          </div>
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
    </div>
  );
}

function firstParam(value: string | string[] | undefined): string {
  return Array.isArray(value) ? (value[0] ?? '') : (value ?? '');
}
