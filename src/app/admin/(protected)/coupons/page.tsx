import Link from 'next/link';

import { Plus, Search } from 'lucide-react';

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
import { ADMIN_ROUTES } from '@/constants/routes';
import { getCoupons } from '@/lib/coupons/get-coupons';
import { formatDate } from '@/lib/format-date';
import { defaultLocale, locales } from '@/locales';

import { AdminTopbar } from '../admin-topbar';
import { ToggleCouponButton } from './toggle-coupon-button';

export default async function AdminCouponsPage() {
  const t = locales[defaultLocale];
  const coupons = await getCoupons();

  return (
    <div className="flex flex-1 flex-col">
      <AdminTopbar title={t.admin.coupons.title} />
      <div className="flex flex-1 flex-col gap-6 px-10 py-8">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button variant="default" size="sm">
              {t.admin.coupons.list.tabs.all}
            </Button>
            <Button variant="outline" size="sm">
              {t.admin.coupons.list.tabs.activeOnly}
            </Button>
            <Button variant="outline" size="sm">
              {t.admin.coupons.list.tabs.expired}
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search
                aria-hidden="true"
                className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                type="search"
                placeholder={t.admin.coupons.list.searchPlaceholder}
                className="w-60 bg-input-background pl-9"
              />
            </div>
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

        <div className="rounded-lg border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.admin.coupons.list.table.code}</TableHead>
                <TableHead>{t.admin.coupons.list.table.type}</TableHead>
                <TableHead>{t.admin.coupons.list.table.value}</TableHead>
                <TableHead>{t.admin.coupons.list.table.usage}</TableHead>
                <TableHead>{t.admin.coupons.list.table.expiry}</TableHead>
                <TableHead className="text-right">{t.admin.coupons.list.table.status}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {coupons.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    {t.admin.coupons.empty}
                  </TableCell>
                </TableRow>
              ) : null}
              {coupons.map((coupon) => {
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
                  ? formatDate(coupon.expires_at)
                  : t.admin.coupons.noExpiry;

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
                    <TableCell className="text-right">
                      <div className="flex justify-end">
                        <ToggleCouponButton couponId={coupon.id} isActive={coupon.is_active} />
                      </div>
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
