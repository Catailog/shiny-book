import Link from 'next/link';

import { Plus, Search } from 'lucide-react';

import { ClickableTableRow } from '@/components/clickable-table-row';
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
import { ADMIN_ROUTES } from '@/constants/routes';
import { getFaqs } from '@/lib/faqs/get-faqs';
import { formatDate } from '@/lib/format-date';
import { defaultLocale, locales } from '@/locales';

import { AdminTopbar } from '../admin-topbar';

export default async function AdminFaqsPage() {
  const t = locales[defaultLocale];
  const faqs = await getFaqs(ADMIN_FAQ_LIST_LIMIT);

  return (
    <div className="flex flex-1 flex-col">
      <AdminTopbar title={t.admin.faqs.title} />
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
              {t.admin.faqs.list.showingCount.replace('{shown}', String(faqs.length))}
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
                <TableHead>{t.admin.faqs.list.table.lastEdited}</TableHead>
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
                  <TableCell className="font-medium text-foreground">{faq.question}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(faq.updated_at)}
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
