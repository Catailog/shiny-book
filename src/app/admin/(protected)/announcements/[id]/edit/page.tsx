import { notFound } from 'next/navigation';

import { getAnnouncementById } from '@/lib/announcements/get-announcement-by-id';
import { defaultLocale, locales } from '@/locales';

import { EditAnnouncementForm } from './edit-form';

export default async function EditAnnouncementPage(
  props: PageProps<'/admin/announcements/[id]/edit'>,
) {
  const { id } = await props.params;
  const announcement = await getAnnouncementById(id);
  const t = locales[defaultLocale];

  if (!announcement) {
    notFound();
  }

  return (
    <div className="flex flex-1 flex-col gap-6 px-6 py-8">
      <h1 className="text-2xl font-semibold text-foreground">{t.admin.announcements.editTitle}</h1>
      <div className="max-w-md rounded-lg border border-border p-4">
        <EditAnnouncementForm
          id={announcement.id}
          defaultValues={{ title: announcement.title, content: announcement.content }}
        />
      </div>
    </div>
  );
}
