import Link from 'next/link';

import { Plus, Search } from 'lucide-react';

import { FilterLink } from '@/components/filter-link';
import { ListPagination } from '@/components/list-pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DISCOUNT_TYPE, isDiscountType } from '@/constants/coupon';
import { ADMIN_PAGE_SIZE_OPTIONS, DEFAULT_LIST_PAGE_SIZE } from '@/constants/pagination';
import { ADMIN_ROUTES } from '@/constants/routes';
import { ADMIN_SEARCH_QUERY_MAX_LENGTH } from '@/constants/search';
import { getCoupons } from '@/lib/coupons/get-coupons';
import { formatDateTime } from '@/lib/format-date';
import { firstSearchParam, paginate, parsePageParam, parsePageSizeParam } from '@/lib/pagination';
import { defaultLocale, locales } from '@/locales';

import { AdminPageSizeSelect } from '../admin-page-size-select';
import { AdminTopbar } from '../admin-topbar';
import { ToggleCouponButton } from './toggle-coupon-button';

const FILTER_TABS = ['all', 'active', 'expired'] as const;
type CouponFilter = (typeof FILTER_TABS)[number];

function isCouponFilter(value: string): value is CouponFilter {
  return (FILTER_TABS as readonly string[]).includes(value);
}

export default async function AdminCouponsPage(props: PageProps<'/admin/coupons'>) {
  const t = locales[defaultLocale];
  const searchParams = await props.searchParams;
  const filterParam = firstSearchParam(searchParams.filter);
  const activeFilter = isCouponFilter(filterParam) ? filterParam : 'all';
  const query = firstSearchParam(searchParams.q).trim().slice(0, ADMIN_SEARCH_QUERY_MAX_LENGTH);

  const coupons = await getCoupons();
  const now = new Date();
  const allFilteredCoupons = coupons.filter((coupon) => {
    const isExpired = coupon.expires_at !== null && new Date(coupon.expires_at) <= now;
    const matchesFilter =
      activeFilter === 'active'
        ? coupon.is_active && !isExpired
        : activeFilter === 'expired'
          ? isExpired
          : true;
    const matchesQuery =
      query.length === 0 || coupon.code.toLowerCase().includes(query.toLowerCase());
    return matchesFilter && matchesQuery;
  });
  const pageSize = parsePageSizeParam(
    searchParams.pageSize,
    ADMIN_PAGE_SIZE_OPTIONS,
    DEFAULT_LIST_PAGE_SIZE,
  );
  const {
    items: filteredCoupons,
    page,
    totalPages,
  } = paginate(allFilteredCoupons, parsePageParam(searchParams.page), pageSize);

  return (
    <div className="flex flex-1 flex-col">
      <AdminTopbar title={t.admin.coupons.title} actions={<AdminPageSizeSelect />} />
      <div className="flex flex-1 flex-col gap-6 px-10 py-8">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <FilterLink href={ADMIN_ROUTES.COUPONS} isActive={activeFilter === 'all'}>
              {t.admin.coupons.list.tabs.all}
            </FilterLink>
            <FilterLink
              href={`${ADMIN_ROUTES.COUPONS}?filter=active`}
              isActive={activeFilter === 'active'}
            >
              {t.admin.coupons.list.tabs.activeOnly}
            </FilterLink>
            <FilterLink
              href={`${ADMIN_ROUTES.COUPONS}?filter=expired`}
              isActive={activeFilter === 'expired'}
            >
              {t.admin.coupons.list.tabs.expired}
            </FilterLink>
          </div>
          <div className="flex items-center gap-3">
            <form className="relative">
              <Search
                aria-hidden="true"
                className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                type="search"
                name="q"
                defaultValue={query}
                placeholder={t.admin.coupons.list.searchPlaceholder}
                className="w-60 pl-9"
              />
            </form>
            <Button
              render={<Link href={ADMIN_ROUTES.COUPONS_NEW} />}
              nativeButton={false}
              variant="primary"
            >
              <Plus aria-hidden="true" className="size-4" />
              {t.admin.coupons.list.createButton}
            </Button>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-border bg-input-background">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted hover:bg-muted">
                <TableHead className="w-32">{t.admin.coupons.list.table.code}</TableHead>
                <TableHead className="w-28">{t.admin.coupons.list.table.type}</TableHead>
                <TableHead className="w-24">{t.admin.coupons.list.table.value}</TableHead>
                <TableHead className="w-28">{t.admin.coupons.list.table.usage}</TableHead>
                <TableHead>{t.admin.coupons.list.table.expiry}</TableHead>
                <TableHead className="w-24">{t.admin.coupons.list.table.status}</TableHead>
                <TableHead className="w-28 text-right">
                  {t.admin.coupons.list.table.actions}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCoupons.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    {t.admin.coupons.empty}
                  </TableCell>
                </TableRow>
              ) : null}
              {filteredCoupons.map((coupon) => {
                const discountType = isDiscountType(coupon.discount_type)
                  ? coupon.discount_type
                  : DISCOUNT_TYPE.PERCENTAGE;
                const value =
                  discountType === DISCOUNT_TYPE.PERCENTAGE
                    ? `${coupon.discount_value}%`
                    : `₩${coupon.discount_value.toLocaleString()}`;
                const usage =
                  coupon.max_uses === null
                    ? `${coupon.used_count}`
                    : `${coupon.used_count} / ${coupon.max_uses}`;
                const expiry = coupon.expires_at
                  ? formatDateTime(coupon.expires_at)
                  : t.admin.coupons.noExpiry;
                const isExpired = coupon.expires_at !== null && new Date(coupon.expires_at) <= now;
                const isScheduled = coupon.starts_at !== null && new Date(coupon.starts_at) > now;

                return (
                  <TableRow key={coupon.id}>
                    <TableCell>
                      <span className="rounded bg-primary-soft px-2.5 py-1 font-semibold text-primary">
                        {coupon.code}
                      </span>
                    </TableCell>
                    <TableCell>{t.admin.coupons.list.typeLabels[discountType]}</TableCell>
                    <TableCell className="font-semibold text-foreground">{value}</TableCell>
                    <TableCell>{usage}</TableCell>
                    <TableCell className="text-muted-foreground">{expiry}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          isExpired
                            ? 'bg-destructive/10 text-destructive'
                            : isScheduled
                              ? 'bg-order-status-in-progress/10 text-order-status-in-progress'
                              : coupon.is_active
                                ? 'bg-order-status-done/10 text-order-status-done'
                                : 'bg-muted text-muted-foreground'
                        }
                      >
                        {isExpired
                          ? t.admin.coupons.expiredLabel
                          : isScheduled
                            ? t.admin.coupons.scheduledLabel
                            : coupon.is_active
                              ? t.admin.coupons.activeLabel
                              : t.admin.coupons.inactiveLabel}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {isExpired ? (
                        <span className="text-muted-foreground">-</span>
                      ) : (
                        <div className="flex justify-end">
                          <ToggleCouponButton couponId={coupon.id} isActive={coupon.is_active} />
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        <ListPagination
          basePath={ADMIN_ROUTES.COUPONS}
          searchParams={searchParams}
          page={page}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
}
