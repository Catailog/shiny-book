import Link from 'next/link';

import { AnnouncementCategoryBadge } from '@/components/announcement-category-badge';
import { SiteContainer } from '@/components/site-container';
import { NOTICE_LIST_LIMIT } from '@/constants/announcement';
import { NOTICE_ROUTES } from '@/constants/routes';
import { getAnnouncements } from '@/lib/announcements/get-announcements';
import { defaultLocale, locales } from '@/locales';

export default async function NoticeListPage() {
  const t = locales[defaultLocale];
  const announcements = await getAnnouncements(NOTICE_LIST_LIMIT);

  return (
    <SiteContainer className="flex max-w-2xl flex-1 flex-col gap-6 py-12">
      <h1 className="text-2xl font-semibold text-foreground">{t.notice.list.title}</h1>
      {announcements.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t.notice.list.empty}</p>
      ) : (
        <ul className="flex flex-col divide-y divide-border">
          {announcements.map((announcement) => (
            <li key={announcement.id}>
              <Link
                href={`${NOTICE_ROUTES.LIST}/${announcement.id}`}
                className="flex flex-col gap-1.5 py-4"
              >
                <div className="flex items-center gap-2">
                  <AnnouncementCategoryBadge category={announcement.category} />
                  <span className="font-medium text-foreground">{announcement.title}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {new Date(announcement.created_at).toLocaleDateString('ko-KR')}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </SiteContainer>
  );
}
