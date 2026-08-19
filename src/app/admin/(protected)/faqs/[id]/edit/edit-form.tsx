'use client';

import { useRouter } from 'next/navigation';

import { ADMIN_ROUTES } from '@/constants/routes';
import { defaultLocale, locales } from '@/locales';

import { updateFaq } from '../../actions';
import { FaqForm } from '../../faq-form';
import type { FaqFormInput } from '../../faq-schema';

interface EditFaqFormProps {
  id: string;
  defaultValues: FaqFormInput;
}

export function EditFaqForm({ id, defaultValues }: EditFaqFormProps) {
  const t = locales[defaultLocale];
  const router = useRouter();

  return (
    <FaqForm
      defaultValues={defaultValues}
      action={(values) => updateFaq(id, values)}
      submitLabel={t.admin.faqs.form.saveButton}
      submittingLabel={t.admin.faqs.form.submitting}
      onSuccess={() => router.push(ADMIN_ROUTES.FAQS)}
    />
  );
}
