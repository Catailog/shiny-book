import Link from 'next/link';

import { ArrowLeft } from 'lucide-react';

import { ADMIN_ROUTES } from '@/constants/routes';
import { getLocale } from '@/lib/i18n/get-locale';
import { locales } from '@/locales';

import { AdminTopbar } from '../../admin-topbar';
import { NewCouponForm } from './new-coupon-form';

export default async function AdminCouponsNewPage() {
  const locale = await getLocale();
  const t = locales[locale];

  return (
    <div className="flex flex-1 flex-col">
      <AdminTopbar title={t.admin.coupons.newTitle} />
      <div className="flex flex-1 flex-col gap-4 px-10 py-8">
        <Link
          href={ADMIN_ROUTES.COUPONS}
          className="flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft aria-hidden="true" className="size-3.5" />
          {t.admin.coupons.create.backToList}
        </Link>
        <div className="max-w-2xl rounded-lg border border-border bg-card p-6 shadow-sm">
          <NewCouponForm />
        </div>
      </div>
    </div>
  );
}
