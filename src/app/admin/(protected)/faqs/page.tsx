import Link from 'next/link';

import { Plus, Search } from 'lucide-react';

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
      <AdminTopbar
        title={t.admin.faqs.title}
        subtitle={t.admin.faqs.list.subtitle}
        actions={
          <Button
            render={<Link href={ADMIN_ROUTES.FAQS_NEW} />}
            nativeButton={false}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus aria-hidden="true" className="size-4" />
            {t.admin.faqs.writeButton}
          </Button>
        }
      />
      <div className="flex flex-1 flex-col gap-6 px-10 py-8">
        <div className="flex items-center justify-between rounded-lg border border-border bg-card px-6 py-4">
          <div className="relative">
            <Search
              aria-hidden="true"
              className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              type="search"
              placeholder={t.admin.faqs.list.searchPlaceholder}
              className="w-70 bg-input-background pl-9"
            />
          </div>
          <span className="text-sm text-muted-foreground">
            {t.admin.faqs.list.showingCount.replace('{shown}', String(faqs.length))}
          </span>
        </div>

        <div className="rounded-lg border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
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
                <TableRow key={faq.id}>
                  <TableCell className="font-medium text-foreground">
                    <Link href={`${ADMIN_ROUTES.FAQS}/${faq.id}/edit`} className="hover:underline">
                      {faq.question}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(faq.updated_at)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
