import Link from 'next/link';

import { ArrowLeft } from 'lucide-react';

import { ADMIN_ROUTES } from '@/constants/routes';
import { defaultLocale, locales } from '@/locales';

import { AdminTopbar } from '../../admin-topbar';
import { CreateAnnouncementForm } from './create-form';

export default async function AdminAnnouncementsNewPage() {
  const t = locales[defaultLocale];

  return (
    <div className="flex flex-1 flex-col">
      <AdminTopbar title={t.admin.announcements.newTitle} />
      <div className="flex flex-1 flex-col gap-4 px-10 py-8">
        <Link
          href={ADMIN_ROUTES.ANNOUNCEMENTS}
          className="flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft aria-hidden="true" className="size-3.5" />
          {t.admin.announcements.create.backToList}
        </Link>
        <div className="max-w-2xl rounded-lg border border-border bg-card p-6 shadow-sm">
          <CreateAnnouncementForm />
        </div>
      </div>
    </div>
  );
}
