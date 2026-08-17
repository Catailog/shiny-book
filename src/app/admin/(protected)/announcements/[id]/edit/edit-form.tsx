'use client';

import { useRouter } from 'next/navigation';

import { ADMIN_ROUTES } from '@/constants/routes';
import { defaultLocale, locales } from '@/locales';

import { updateAnnouncement } from '../../actions';
import { AnnouncementForm } from '../../announcement-form';
import type { AnnouncementFormInput } from '../../announcement-schema';

interface EditAnnouncementFormProps {
  id: string;
  defaultValues: AnnouncementFormInput;
}

export function EditAnnouncementForm({ id, defaultValues }: EditAnnouncementFormProps) {
  const t = locales[defaultLocale];
  const router = useRouter();

  return (
    <AnnouncementForm
      defaultValues={defaultValues}
      action={(values) => updateAnnouncement(id, values)}
      submitLabel={t.admin.announcements.form.saveButton}
      submittingLabel={t.admin.announcements.form.submitting}
      onSuccess={() => router.push(ADMIN_ROUTES.ANNOUNCEMENTS)}
    />
  );
}
