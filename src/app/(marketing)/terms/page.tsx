import { LegalTocDocument } from '@/components/legal-toc-document';
import { getLocale } from '@/lib/i18n/get-locale';
import { locales } from '@/locales';

export default async function TermsPage() {
  const locale = await getLocale();
  const t = locales[locale];

  return (
    <LegalTocDocument
      title={t.legal.terms.title}
      lastUpdatedLabel={t.legal.lastUpdatedLabel}
      lastUpdated={t.legal.terms.lastUpdated}
      sections={t.legal.terms.sections}
    />
  );
}
