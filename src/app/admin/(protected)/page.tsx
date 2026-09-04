import { DollarSign, Settings, ShoppingCart, Tag } from 'lucide-react';

import { FilterLink } from '@/components/filter-link';
import { ListPagination } from '@/components/list-pagination';
import { SearchForm } from '@/components/search-form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValueMap,
} from '@/components/ui/select';
import { ORDER_SEARCH_FIELD, isOrderSearchField } from '@/constants/order-search';
import { ORDER_STATUS, type OrderStatus, isOrderStatus } from '@/constants/order-status';
import { ADMIN_PAGE_SIZE_OPTIONS, DEFAULT_LIST_PAGE_SIZE } from '@/constants/pagination';
import { ADMIN_ROUTES } from '@/constants/routes';
import { ADMIN_SEARCH_QUERY_MAX_LENGTH } from '@/constants/search';
import { env } from '@/env';
import { getCoupons } from '@/lib/coupons/get-coupons';
import { filterOrders } from '@/lib/orders/filter-orders';
import { getOrders } from '@/lib/orders/get-orders';
import { firstSearchParam, paginate, parsePageParam, parsePageSizeParam } from '@/lib/pagination';
import { defaultLocale, locales } from '@/locales';

import { AdminPageSizeSelect } from './admin-page-size-select';
import { AdminTopbar } from './admin-topbar';
import { ExportOrdersCsvButton } from './export-orders-csv-button';
import { OrdersTable } from './orders-table';

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
  const filteredOrders = filterOrders(allOrders, { activeFilter, searchField, query });
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
            <ExportOrdersCsvButton
              filterParam={filterParam}
              searchFieldParam={searchFieldParam}
              query={query}
            />
          </div>
          <OrdersTable
            key={`${activeFilter ?? 'all'}-${searchField}-${query}-${page}`}
            orders={orders}
            activeFilter={activeFilter}
            showSimulator={showSimulator}
          />
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
