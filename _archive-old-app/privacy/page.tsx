import { LegalDocument } from '@/components/legal-document';
import { defaultLocale, locales } from '@/locales';

export default function PrivacyPage() {
  const t = locales[defaultLocale];

  return (
    <LegalDocument
      title={t.legal.privacy.title}
      lastUpdatedLabel={t.legal.lastUpdatedLabel}
      lastUpdated={t.legal.privacy.lastUpdated}
      sections={t.legal.privacy.sections}
    />
  );
}
