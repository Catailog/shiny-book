import { notFound } from 'next/navigation';

import { ANNOUNCEMENT_CATEGORY, isAnnouncementCategory } from '@/constants/announcement-category';
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

  const category = isAnnouncementCategory(announcement.category)
    ? announcement.category
    : ANNOUNCEMENT_CATEGORY.NOTICE;

  return (
    <div className="flex flex-1 flex-col gap-6 px-6 py-8">
      <h1 className="text-2xl font-semibold text-foreground">{t.admin.announcements.editTitle}</h1>
      <div className="max-w-md rounded-lg border border-border bg-card p-4 shadow-sm">
        <EditAnnouncementForm
          id={announcement.id}
          defaultValues={{ title: announcement.title, category, content: announcement.content }}
        />
      </div>
    </div>
  );
}
