import { ADMIN_ROUTES } from '@/constants/routes';
import { getLocale } from '@/lib/i18n/get-locale';
import { locales } from '@/locales';

import { AdminTopbar } from '../../admin-topbar';
import { CreateCouponForm } from './create-coupon-form';

export default async function AdminCouponsNewPage() {
  const locale = await getLocale();
  const t = locales[locale];

  return (
    <div className="flex flex-1 flex-col">
      <AdminTopbar title={t.admin.coupons.newTitle} />
      <div className="flex flex-1 gap-6 px-10 py-8">
        <CreateCouponForm cancelHref={ADMIN_ROUTES.COUPONS} />
      </div>
    </div>
  );
}
