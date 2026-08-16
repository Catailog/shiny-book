import Link from 'next/link';
import { notFound } from 'next/navigation';

import { AnnouncementCategoryBadge } from '@/components/announcement-category-badge';
import { SiteContainer } from '@/components/site-container';
import { NOTICE_ROUTES } from '@/constants/routes';
import { getAnnouncementById } from '@/lib/announcements/get-announcement-by-id';
import { defaultLocale, locales } from '@/locales';

export default async function NoticeDetailPage(props: PageProps<'/notices/[id]'>) {
  const { id } = await props.params;
  const announcement = await getAnnouncementById(id);
  const t = locales[defaultLocale];

  if (!announcement) {
    notFound();
  }

  return (
    <SiteContainer className="flex max-w-2xl flex-1 flex-col gap-6 py-12">
      <div className="flex flex-col gap-2 border-b border-border pb-4">
        <AnnouncementCategoryBadge category={announcement.category} className="w-fit" />
        <h1 className="text-2xl font-semibold text-foreground">{announcement.title}</h1>
        <span className="text-sm text-muted-foreground">
          {new Date(announcement.created_at).toLocaleDateString('ko-KR')}
        </span>
      </div>
      <p className="whitespace-pre-wrap text-foreground">{announcement.content}</p>
      <Link href={NOTICE_ROUTES.LIST} className="text-sm font-medium text-foreground underline">
        {t.notice.detail.backToList}
      </Link>
    </SiteContainer>
  );
}
