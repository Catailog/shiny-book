import Link from 'next/link';

import { Plus, Search } from 'lucide-react';

import { ClickableTableRow } from '@/components/clickable-table-row';
import { ListPagination } from '@/components/list-pagination';
import { RelativeDate } from '@/components/relative-date';
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
import { ADMIN_FAQ_LIST_LIMIT } from '@/constants/faq';
import { ADMIN_PAGE_SIZE_OPTIONS, DEFAULT_LIST_PAGE_SIZE } from '@/constants/pagination';
import { ADMIN_ROUTES } from '@/constants/routes';
import { getFaqs } from '@/lib/faqs/get-faqs';
import { paginate, parsePageParam, parsePageSizeParam } from '@/lib/pagination';
import { defaultLocale, locales } from '@/locales';

import { AdminPageSizeSelect } from '../admin-page-size-select';
import { AdminTopbar } from '../admin-topbar';

export default async function AdminFaqsPage(props: PageProps<'/admin/faqs'>) {
  const t = locales[defaultLocale];
  const searchParams = await props.searchParams;
  const allFaqs = await getFaqs(ADMIN_FAQ_LIST_LIMIT);
  const pageSize = parsePageSizeParam(
    searchParams.pageSize,
    ADMIN_PAGE_SIZE_OPTIONS,
    DEFAULT_LIST_PAGE_SIZE,
  );
  const {
    items: faqs,
    page,
    totalPages,
    totalItems,
  } = paginate(allFaqs, parsePageParam(searchParams.page), pageSize);

  return (
    <div className="flex flex-1 flex-col">
      <AdminTopbar title={t.admin.faqs.title} actions={<AdminPageSizeSelect />} />
      <div className="flex flex-1 flex-col gap-6 px-10 py-8">
        <div className="flex items-center justify-between">
          <div className="relative">
            <Search
              aria-hidden="true"
              className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              type="search"
              placeholder={t.admin.faqs.list.searchPlaceholder}
              className="w-70 pl-9"
            />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">
              {t.admin.faqs.list.showingCount.replace('{shown}', String(totalItems))}
            </span>
            <Button
              render={<Link href={ADMIN_ROUTES.FAQS_NEW} />}
              nativeButton={false}
              variant="primary"
            >
              <Plus aria-hidden="true" className="size-4" />
              {t.admin.faqs.writeButton}
            </Button>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-border bg-input-background">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted hover:bg-muted">
                <TableHead>{t.admin.faqs.list.table.title}</TableHead>
                <TableHead className="w-32">{t.admin.faqs.list.table.lastEdited}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {faqs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-center text-muted-foreground">
                    {t.admin.faqs.empty}
                  </TableCell>
                </TableRow>
              ) : null}
              {faqs.map((faq) => (
                <ClickableTableRow key={faq.id} href={`${ADMIN_ROUTES.FAQS}/${faq.id}/edit`}>
                  <TableCell className="truncate font-medium text-foreground">
                    {faq.question}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    <RelativeDate value={faq.updated_at} locale={defaultLocale} />
                  </TableCell>
                </ClickableTableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <ListPagination
          basePath={ADMIN_ROUTES.FAQS}
          searchParams={searchParams}
          page={page}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
}
