import { LegalTocDocument } from '@/components/legal-toc-document';
import { getLocale } from '@/lib/i18n/get-locale';
import { locales } from '@/locales';

export default async function PrivacyPage() {
  const locale = await getLocale();
  const t = locales[locale];

  return (
    <LegalTocDocument
      title={t.legal.privacy.title}
      lastUpdatedLabel={t.legal.lastUpdatedLabel}
      lastUpdated={t.legal.privacy.lastUpdated}
      sections={t.legal.privacy.sections}
    />
  );
}
