'use client';

import { useRouter } from 'next/navigation';

import { ADMIN_ROUTES } from '@/constants/routes';
import { defaultLocale, locales } from '@/locales';

import { createAnnouncement } from '../actions';
import { AnnouncementForm } from '../announcement-form';

export function CreateAnnouncementForm() {
  const t = locales[defaultLocale];
  const router = useRouter();

  return (
    <AnnouncementForm
      action={createAnnouncement}
      submitLabel={t.admin.announcements.form.createButton}
      submittingLabel={t.admin.announcements.form.submitting}
      onSuccess={() => router.push(ADMIN_ROUTES.ANNOUNCEMENTS)}
    />
  );
}
