import Link from 'next/link';

import { Search } from 'lucide-react';

import { AnnouncementCategoryBadge } from '@/components/announcement-category-badge';
import { FilterLink } from '@/components/filter-link';
import { SiteContainer } from '@/components/site-container';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { NOTICE_LIST_LIMIT } from '@/constants/announcement';
import {
  ANNOUNCEMENT_CATEGORY,
  type AnnouncementCategory,
  isAnnouncementCategory,
} from '@/constants/announcement-category';
import { NOTICE_ROUTES } from '@/constants/routes';
import { getAnnouncements } from '@/lib/announcements/get-announcements';
import { formatDate } from '@/lib/format-date';
import { getLocale } from '@/lib/i18n/get-locale';
import { locales } from '@/locales';

const CATEGORY_TABS: Array<AnnouncementCategory | 'all'> = [
  'all',
  ANNOUNCEMENT_CATEGORY.NOTICE,
  ANNOUNCEMENT_CATEGORY.EVENT,
  ANNOUNCEMENT_CATEGORY.WINNER,
];

export default async function NoticesPage(props: PageProps<'/notices'>) {
  const searchParams = await props.searchParams;
  const locale = await getLocale();
  const t = locales[locale];

  const categoryParam = firstParam(searchParams.category);
  const activeCategory = isAnnouncementCategory(categoryParam) ? categoryParam : 'all';
  const query = firstParam(searchParams.q).trim();

  const allNotices = await getAnnouncements(NOTICE_LIST_LIMIT);
  const notices = allNotices.filter((notice) => {
    const matchesCategory = activeCategory === 'all' || notice.category === activeCategory;
    const matchesQuery =
      query.length === 0 || notice.title.toLowerCase().includes(query.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="flex flex-1 flex-col">
      <div className="bg-muted py-16">
        <SiteContainer className="text-center">
          <p className="text-sm font-semibold text-primary uppercase">{t.notice.list.eyebrow}</p>
          <h1 className="mt-2 font-heading text-5xl font-bold text-foreground">
            {t.notice.list.title}
          </h1>
        </SiteContainer>
      </div>

      <SiteContainer className="flex flex-col gap-6 border-b border-border py-6">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {CATEGORY_TABS.map((category) => (
              <FilterLink
                key={category}
                href={
                  category === 'all'
                    ? NOTICE_ROUTES.LIST
                    : `${NOTICE_ROUTES.LIST}?category=${category}`
                }
                isActive={category === activeCategory}
              >
                {category === 'all'
                  ? t.notice.list.categoryTabs.all
                  : t.announcementCategories[category]}
              </FilterLink>
            ))}
          </div>
          <form className="relative">
            <Search
              aria-hidden="true"
              className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              type="search"
              name="q"
              defaultValue={query}
              placeholder={t.notice.list.searchPlaceholder}
              className="w-70 pl-9"
            />
          </form>
        </div>
      </SiteContainer>

      <SiteContainer className="flex flex-col gap-6 py-10">
        <div className="overflow-hidden rounded-lg border border-border bg-input-background">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted hover:bg-muted">
                <TableHead className="w-32">{t.notice.list.table.category}</TableHead>
                <TableHead>{t.notice.list.table.title}</TableHead>
                <TableHead className="w-28 text-right">{t.notice.list.table.date}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notices.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={3} className="text-center text-muted-foreground">
                    {t.notice.list.empty}
                  </TableCell>
                </TableRow>
              ) : null}
              {notices.map((notice) => (
                <TableRow key={notice.id} className="hover:bg-transparent">
                  <TableCell>
                    <AnnouncementCategoryBadge category={notice.category} locale={locale} />
                  </TableCell>
                  <TableCell className="truncate font-medium text-foreground">
                    <Link href={`${NOTICE_ROUTES.LIST}/${notice.id}`} className="hover:underline">
                      {notice.title}
                    </Link>
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {formatDate(notice.created_at)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SiteContainer>
    </div>
  );
}

function firstParam(value: string | string[] | undefined): string {
  return Array.isArray(value) ? (value[0] ?? '') : (value ?? '');
}
