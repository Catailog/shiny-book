import Link from 'next/link';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ADMIN_FAQ_LIST_LIMIT } from '@/constants/faq';
import { getFaqs } from '@/lib/faqs/get-faqs';
import { defaultLocale, locales } from '@/locales';

import { createFaq } from './actions';
import { FaqForm } from './faq-form';

export default async function AdminFaqsPage() {
  const t = locales[defaultLocale];
  const faqs = await getFaqs(ADMIN_FAQ_LIST_LIMIT);

  return (
    <div className="flex flex-1 flex-col gap-6 px-6 py-8">
      <h1 className="text-2xl font-semibold text-foreground">{t.admin.faqs.title}</h1>
      <div className="max-w-md rounded-lg border border-border p-4">
        <FaqForm
          action={createFaq}
          submitLabel={t.admin.faqs.form.createButton}
          submittingLabel={t.admin.faqs.form.submitting}
        />
      </div>
      {faqs.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t.admin.faqs.empty}</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t.admin.faqs.columns.question}</TableHead>
              <TableHead>{t.admin.faqs.columns.createdAt}</TableHead>
              <TableHead>{t.admin.faqs.columns.actions}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {faqs.map((faq) => (
              <TableRow key={faq.id}>
                <TableCell className="font-medium text-foreground">{faq.question}</TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(faq.created_at).toLocaleString('ko-KR')}
                </TableCell>
                <TableCell>
                  <Link
                    href={`/admin/faqs/${faq.id}/edit`}
                    className="text-sm font-medium text-foreground underline"
                  >
                    {t.admin.faqs.editLink}
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
