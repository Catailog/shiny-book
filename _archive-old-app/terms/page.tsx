import { LegalDocument } from '@/components/legal-document';
import { defaultLocale, locales } from '@/locales';

export default function TermsPage() {
  const t = locales[defaultLocale];

  return (
    <LegalDocument
      title={t.legal.terms.title}
      lastUpdatedLabel={t.legal.lastUpdatedLabel}
      lastUpdated={t.legal.terms.lastUpdated}
      sections={t.legal.terms.sections}
    />
  );
}
