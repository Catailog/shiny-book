import { ADMIN_ROUTES } from '@/constants/routes';
import { getLocale } from '@/lib/i18n/get-locale';
import { locales } from '@/locales';

import { AdminTopbar } from '../../admin-topbar';
import { CreateAnnouncementForm } from './create-announcement-form';

export default async function AdminAnnouncementsNewPage() {
  const locale = await getLocale();
  const t = locales[locale];

  return (
    <div className="flex flex-1 flex-col">
      <AdminTopbar title={t.admin.announcements.newTitle} />
      <div className="flex flex-1 gap-6 px-10 py-8">
        <CreateAnnouncementForm cancelHref={ADMIN_ROUTES.ANNOUNCEMENTS} />
      </div>
    </div>
  );
}
