import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DISCOUNT_TYPE } from '@/constants/coupon';
import { getCoupons } from '@/lib/coupons/get-coupons';
import { defaultLocale, locales } from '@/locales';

import { CouponForm } from './coupon-form';
import { ToggleCouponButton } from './toggle-coupon-button';

export default async function AdminCouponsPage() {
  const t = locales[defaultLocale];
  const coupons = await getCoupons();

  return (
    <div className="flex flex-1 flex-col gap-6 px-6 py-8">
      <h1 className="text-2xl font-semibold text-foreground">{t.admin.coupons.title}</h1>
      <CouponForm />
      {coupons.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t.admin.coupons.empty}</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t.admin.coupons.columns.code}</TableHead>
              <TableHead>{t.admin.coupons.columns.discount}</TableHead>
              <TableHead>{t.admin.coupons.columns.usage}</TableHead>
              <TableHead>{t.admin.coupons.columns.expiresAt}</TableHead>
              <TableHead>{t.admin.coupons.columns.active}</TableHead>
              <TableHead>{t.admin.coupons.columns.createdAt}</TableHead>
              <TableHead>{t.admin.coupons.columns.actions}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {coupons.map((coupon) => (
              <TableRow key={coupon.id}>
                <TableCell className="font-medium text-foreground">{coupon.code}</TableCell>
                <TableCell>
                  {coupon.discount_type === DISCOUNT_TYPE.PERCENTAGE
                    ? `${coupon.discount_value}%`
                    : coupon.discount_value.toLocaleString()}
                </TableCell>
                <TableCell>
                  {coupon.used_count}
                  {' / '}
                  {coupon.max_uses ?? t.admin.coupons.unlimited}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {coupon.expires_at
                    ? new Date(coupon.expires_at).toLocaleDateString('ko-KR')
                    : t.admin.coupons.noExpiry}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {coupon.is_active ? t.admin.coupons.activeLabel : t.admin.coupons.inactiveLabel}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(coupon.created_at).toLocaleString('ko-KR')}
                </TableCell>
                <TableCell>
                  <ToggleCouponButton couponId={coupon.id} isActive={coupon.is_active} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
