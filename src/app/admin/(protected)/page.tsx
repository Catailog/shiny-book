import { DollarSign, Settings, ShoppingCart, Tag } from 'lucide-react';

import { FilterLink } from '@/components/filter-link';
import { ListPagination } from '@/components/list-pagination';
import { OrderStatusBadge } from '@/components/order-status-badge';
import { RelativeDate } from '@/components/relative-date';
import { SearchForm } from '@/components/search-form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValueMap,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ORDER_SEARCH_FIELD, isOrderSearchField } from '@/constants/order-search';
import { ORDER_STATUS, type OrderStatus, isOrderStatus } from '@/constants/order-status';
import { ADMIN_PAGE_SIZE_OPTIONS, DEFAULT_LIST_PAGE_SIZE } from '@/constants/pagination';
import { isRefundableOrderStatus } from '@/constants/refund';
import { ADMIN_ROUTES } from '@/constants/routes';
import { ADMIN_SEARCH_QUERY_MAX_LENGTH } from '@/constants/search';
import { env } from '@/env';
import { getCoupons } from '@/lib/coupons/get-coupons';
import { formatIdPrefix } from '@/lib/format-id-prefix';
import { getOrders } from '@/lib/orders/get-orders';
import { getNextStatuses, getPreviousStatus } from '@/lib/orders/order-state-machine';
import { firstSearchParam, paginate, parsePageParam, parsePageSizeParam } from '@/lib/pagination';
import { defaultLocale, locales } from '@/locales';

import { AdminPageSizeSelect } from './admin-page-size-select';
import { AdminTopbar } from './admin-topbar';
import { OrderActionsMenu } from './order-actions-menu';
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
  ORDER_STATUS.CANCELLED,
  ORDER_STATUS.REFUNDED,
];

export default async function AdminDashboardPage(props: PageProps<'/admin'>) {
  const t = locales[defaultLocale];
  const searchParams = await props.searchParams;
  const filterParam = firstSearchParam(searchParams.filter);
  const activeFilter = isOrderStatus(filterParam) ? filterParam : null;
  const searchFieldParam = firstSearchParam(searchParams.searchField);
  const searchField = isOrderSearchField(searchFieldParam)
    ? searchFieldParam
    : ORDER_SEARCH_FIELD.TITLE;
  const query = firstSearchParam(searchParams.q).trim().slice(0, ADMIN_SEARCH_QUERY_MAX_LENGTH);

  const showSimulator = env.NODE_ENV !== 'production';
  const [allOrders, coupons] = await Promise.all([getOrders(), getCoupons()]);
  const filteredOrders = allOrders.filter((order) => {
    const matchesFilter = activeFilter === null || order.status === activeFilter;
    if (!matchesFilter) {
      return false;
    }
    if (query.length === 0) {
      return true;
    }
    const normalizedQuery = query.toLowerCase();
    if (searchField === ORDER_SEARCH_FIELD.ID) {
      return order.id.toLowerCase().includes(normalizedQuery);
    }
    if (searchField === ORDER_SEARCH_FIELD.CUSTOMER_NAME) {
      return (order.consumerName ?? '').toLowerCase().includes(normalizedQuery);
    }
    return order.title.toLowerCase().includes(normalizedQuery);
  });
  const pageSize = parsePageSizeParam(
    searchParams.pageSize,
    ADMIN_PAGE_SIZE_OPTIONS,
    DEFAULT_LIST_PAGE_SIZE,
  );
  const {
    items: orders,
    page,
    totalPages,
  } = paginate(filteredOrders, parsePageParam(searchParams.page), pageSize);

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
        order.status !== ORDER_STATUS.CANCELLED &&
        order.status !== ORDER_STATUS.REFUNDED &&
        createdAt.getFullYear() === now.getFullYear() &&
        createdAt.getMonth() === now.getMonth()
      );
    })
    .reduce((sum, order) => sum + (order.amount - order.refunded_amount), 0);
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
          <div className="flex justify-end">
            <AdminPageSizeSelect />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2">
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
            <SearchForm
              defaultValue={query}
              placeholder={t.admin.orders.search.placeholder}
              submitLabel={t.common.searchLabel}
              inputClassName="w-48"
            >
              <Select size="sm" name="searchField" defaultValue={searchField}>
                <SelectTrigger className="w-28">
                  <SelectValueMap labels={t.admin.orders.search.fieldOptions} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ORDER_SEARCH_FIELD.TITLE}>
                    {t.admin.orders.search.fieldOptions.title}
                  </SelectItem>
                  <SelectItem value={ORDER_SEARCH_FIELD.ID}>
                    {t.admin.orders.search.fieldOptions.id}
                  </SelectItem>
                  <SelectItem value={ORDER_SEARCH_FIELD.CUSTOMER_NAME}>
                    {t.admin.orders.search.fieldOptions.customerName}
                  </SelectItem>
                </SelectContent>
              </Select>
            </SearchForm>
          </div>
          <div className="overflow-hidden rounded-lg border border-border bg-input-background">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted hover:bg-muted">
                  <TableHead>{t.admin.orders.columns.title}</TableHead>
                  <TableHead className="w-32">{t.admin.orders.columns.customerName}</TableHead>
                  <TableHead className="w-20">{t.admin.orders.columns.quantity}</TableHead>
                  <TableHead className="w-28">{t.admin.orders.columns.amount}</TableHead>
                  <TableHead className="w-24">{t.admin.orders.columns.status}</TableHead>
                  <TableHead className="w-28">{t.admin.orders.columns.files}</TableHead>
                  <TableHead className="w-28">{t.admin.orders.columns.createdAt}</TableHead>
                  <TableHead className="w-20">{t.admin.orders.columns.actions}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground">
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
                      <TableCell className="truncate font-medium text-foreground">
                        <div className="flex flex-col gap-0.5">
                          <span className="truncate">{order.title}</span>
                          <span className="text-xs font-normal text-muted-foreground">
                            {formatIdPrefix(order.id)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="truncate text-muted-foreground">
                        {order.consumerName ?? '-'}
                      </TableCell>
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
                        <RelativeDate value={order.created_at} locale={defaultLocale} />
                      </TableCell>
                      <TableCell>
                        {status ? (
                          <OrderActionsMenu
                            orderId={order.id}
                            status={status}
                            previousStatus={previousStatus}
                            nextStatus={nextStatus ?? null}
                            orderAmount={order.amount}
                            refundedAmount={order.refunded_amount}
                            isRefundable={isRefundableOrderStatus(status)}
                            showSimulator={showSimulator}
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
          <ListPagination
            basePath={ADMIN_ROUTES.DASHBOARD}
            searchParams={searchParams}
            page={page}
            totalPages={totalPages}
          />
        </div>
      </div>
    </div>
  );
}
