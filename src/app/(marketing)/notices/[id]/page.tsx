import Link from 'next/link';
import { notFound } from 'next/navigation';

import { SiteContainer } from '@/components/site-container';
import { Badge } from '@/components/ui/badge';
import { isAnnouncementCategory } from '@/constants/announcement-category';
import { NOTICE_ROUTES } from '@/constants/routes';
import { getAnnouncementById } from '@/lib/announcements/get-announcement-by-id';
import { formatDate } from '@/lib/format-date';
import { getLocale } from '@/lib/i18n/get-locale';
import { locales } from '@/locales';

export default async function NoticeDetailPage(props: PageProps<'/notices/[id]'>) {
  const { id } = await props.params;
  const locale = await getLocale();
  const t = locales[locale];
  const notice = await getAnnouncementById(id);

  if (!notice) {
    notFound();
  }

  return (
    <SiteContainer className="flex flex-col gap-6 py-16">
      <div className="flex flex-col gap-3 border-b border-border pb-6">
        {isAnnouncementCategory(notice.category) ? (
          <Badge variant="secondary" className="w-fit">
            {t.announcementCategories[notice.category]}
          </Badge>
        ) : null}
        <h1 className="font-heading text-3xl font-bold text-foreground">{notice.title}</h1>
        <span className="text-sm text-muted-foreground">{formatDate(notice.created_at)}</span>
      </div>
      <p className="whitespace-pre-wrap text-foreground">{notice.content}</p>
      <Link
        href={NOTICE_ROUTES.LIST}
        className="mt-6 w-fit text-sm font-medium text-foreground underline"
      >
        {t.notice.detail.backToList}
      </Link>
    </SiteContainer>
  );
}
