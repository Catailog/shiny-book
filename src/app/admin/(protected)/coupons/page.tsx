import Link from 'next/link';

import { Plus, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ADMIN_ROUTES } from '@/constants/routes';
import { getLocale } from '@/lib/i18n/get-locale';
import { locales } from '@/locales';

import { AdminTopbar } from '../admin-topbar';

const MOCK_COUPONS = [
  {
    code: 'WELCOME10',
    type: 'percentage',
    value: '10%',
    minOrder: '₩50,000',
    usage: '428 / 1000',
    expiry: '2025.12.31',
    active: true,
  },
  {
    code: 'AUTUMN30K',
    type: 'fixed',
    value: '₩30,000',
    minOrder: '₩150,000',
    usage: '92 / 500',
    expiry: '2025.11.15',
    active: true,
  },
] as const;

export default async function AdminCouponsPage() {
  const locale = await getLocale();
  const t = locales[locale];

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
              className="bg-primary text-primary-foreground hover:bg-primary/90"
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
                <TableHead>{t.admin.coupons.list.table.minOrder}</TableHead>
                <TableHead>{t.admin.coupons.list.table.usage}</TableHead>
                <TableHead>{t.admin.coupons.list.table.expiry}</TableHead>
                <TableHead className="text-right">{t.admin.coupons.list.table.status}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_COUPONS.map((coupon) => (
                <TableRow key={coupon.code}>
                  <TableCell>
                    <span className="rounded bg-primary-soft px-2.5 py-1 font-semibold text-primary">
                      {coupon.code}
                    </span>
                  </TableCell>
                  <TableCell>{t.admin.coupons.list.typeLabels[coupon.type]}</TableCell>
                  <TableCell className="font-semibold text-foreground">{coupon.value}</TableCell>
                  <TableCell className="text-muted-foreground">{coupon.minOrder}</TableCell>
                  <TableCell>{coupon.usage}</TableCell>
                  <TableCell className="text-muted-foreground">{coupon.expiry}</TableCell>
                  <TableCell className="text-right">
                    <Switch defaultChecked={coupon.active} className="ml-auto" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
