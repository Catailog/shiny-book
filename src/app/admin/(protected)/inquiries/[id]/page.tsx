import { notFound } from 'next/navigation';

import { getInquiryById } from '@/lib/inquiries/get-inquiry-by-id';
import { defaultLocale, locales } from '@/locales';

import { AnswerInquiryForm } from './answer-form';

export default async function AdminInquiryDetailPage(props: PageProps<'/admin/inquiries/[id]'>) {
  const { id } = await props.params;
  const inquiry = await getInquiryById(id);
  const t = locales[defaultLocale];

  if (!inquiry) {
    notFound();
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-6 py-8">
      <div className="flex flex-col gap-2 border-b border-border pb-4">
        <h1 className="text-2xl font-semibold text-foreground">{inquiry.title}</h1>
        <span className="text-sm text-muted-foreground">
          {new Date(inquiry.created_at).toLocaleString('ko-KR')}
        </span>
      </div>
      <p className="whitespace-pre-wrap text-foreground">{inquiry.content}</p>
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-medium text-foreground">{t.admin.inquiries.answerLabel}</h2>
        <AnswerInquiryForm id={inquiry.id} defaultAnswer={inquiry.answer ?? ''} />
      </div>
    </div>
  );
}
