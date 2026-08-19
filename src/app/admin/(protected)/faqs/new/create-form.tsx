'use client';

import { useRouter } from 'next/navigation';

import { ADMIN_ROUTES } from '@/constants/routes';
import { defaultLocale, locales } from '@/locales';

import { createFaq } from '../actions';
import { FaqForm } from '../faq-form';

export function CreateFaqForm() {
  const t = locales[defaultLocale];
  const router = useRouter();

  return (
    <FaqForm
      action={createFaq}
      submitLabel={t.admin.faqs.form.createButton}
      submittingLabel={t.admin.faqs.form.submitting}
      onSuccess={() => router.push(ADMIN_ROUTES.FAQS)}
    />
  );
}
