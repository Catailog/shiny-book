import Link from 'next/link';

import { Plus, Search } from 'lucide-react';

import { AnnouncementCategoryBadge } from '@/components/announcement-category-badge';
import { ClickableTableRow } from '@/components/clickable-table-row';
import { FilterLink } from '@/components/filter-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ADMIN_ANNOUNCEMENT_LIST_LIMIT } from '@/constants/announcement';
import {
  ANNOUNCEMENT_CATEGORY,
  type AnnouncementCategory,
  isAnnouncementCategory,
} from '@/constants/announcement-category';
import { ADMIN_ROUTES } from '@/constants/routes';
import { getAnnouncements } from '@/lib/announcements/get-announcements';
import { formatDate } from '@/lib/format-date';
import { defaultLocale, locales } from '@/locales';

import { AdminTopbar } from '../admin-topbar';

const CATEGORY_TABS: Array<AnnouncementCategory | 'all'> = [
  'all',
  ANNOUNCEMENT_CATEGORY.NOTICE,
  ANNOUNCEMENT_CATEGORY.EVENT,
  ANNOUNCEMENT_CATEGORY.WINNER,
];

export default async function AdminAnnouncementsPage(props: PageProps<'/admin/announcements'>) {
  const t = locales[defaultLocale];
  const searchParams = await props.searchParams;
  const categoryParam = firstParam(searchParams.category);
  const activeCategory = isAnnouncementCategory(categoryParam) ? categoryParam : 'all';

  const allAnnouncements = await getAnnouncements(ADMIN_ANNOUNCEMENT_LIST_LIMIT);
  const announcements = allAnnouncements.filter(
    (announcement) => activeCategory === 'all' || announcement.category === activeCategory,
  );

  return (
    <div className="flex flex-1 flex-col">
      <AdminTopbar title={t.admin.announcements.title} />
      <div className="flex flex-1 flex-col gap-6 px-10 py-8">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {CATEGORY_TABS.map((category) => (
              <FilterLink
                key={category}
                href={
                  category === 'all'
                    ? ADMIN_ROUTES.ANNOUNCEMENTS
                    : `${ADMIN_ROUTES.ANNOUNCEMENTS}?category=${category}`
                }
                isActive={category === activeCategory}
              >
                {category === 'all'
                  ? t.admin.announcements.list.filterAllLabel
                  : t.announcementCategories[category]}
              </FilterLink>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search
                aria-hidden="true"
                className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                type="search"
                placeholder={t.admin.announcements.list.searchPlaceholder}
                className="w-60 bg-input-background pl-9"
              />
            </div>
            <Button
              render={<Link href={ADMIN_ROUTES.ANNOUNCEMENTS_NEW} />}
              nativeButton={false}
              variant="primary"
            >
              <Plus aria-hidden="true" className="size-4" />
              {t.admin.announcements.list.createButton}
            </Button>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-border bg-input-background">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted hover:bg-muted">
                <TableHead className="w-32">{t.admin.announcements.list.table.category}</TableHead>
                <TableHead>{t.admin.announcements.list.table.title}</TableHead>
                <TableHead className="w-28">{t.admin.announcements.list.table.date}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {announcements.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground">
                    {t.admin.announcements.empty}
                  </TableCell>
                </TableRow>
              ) : null}
              {announcements.map((announcement) => (
                <ClickableTableRow
                  key={announcement.id}
                  href={`${ADMIN_ROUTES.ANNOUNCEMENTS}/${announcement.id}/edit`}
                >
                  <TableCell>
                    <AnnouncementCategoryBadge category={announcement.category} />
                  </TableCell>
                  <TableCell className="truncate font-semibold text-foreground">
                    {announcement.title}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(announcement.created_at)}
                  </TableCell>
                </ClickableTableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

function firstParam(value: string | string[] | undefined): string {
  return Array.isArray(value) ? (value[0] ?? '') : (value ?? '');
}
