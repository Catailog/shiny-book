import { notFound } from 'next/navigation';

import { getFaqById } from '@/lib/faqs/get-faq-by-id';
import { defaultLocale, locales } from '@/locales';

import { EditFaqForm } from './edit-form';

export default async function EditFaqPage(props: PageProps<'/admin/faqs/[id]/edit'>) {
  const { id } = await props.params;
  const faq = await getFaqById(id);
  const t = locales[defaultLocale];

  if (!faq) {
    notFound();
  }

  return (
    <div className="flex flex-1 flex-col gap-6 px-6 py-8">
      <h1 className="text-2xl font-semibold text-foreground">{t.admin.faqs.editTitle}</h1>
      <div className="max-w-md rounded-lg border border-border p-4">
        <EditFaqForm id={faq.id} defaultValues={{ question: faq.question, answer: faq.answer }} />
      </div>
    </div>
  );
}
