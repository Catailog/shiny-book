import { PageSection } from '@/components/page-section';
import { getLocale } from '@/lib/i18n/get-locale';
import { locales } from '@/locales';

import { FeatureBentoGrid } from './feature-bento-grid';

export async function QualityFeatures() {
  const locale = await getLocale();
  const t = locales[locale];
  const features = t.site.home.features;

  return (
    <PageSection
      sectionClassName="bg-secondary"
      className="flex flex-col items-center gap-16 py-24"
    >
      <div className="flex flex-col items-center gap-4 text-center">
        <p className="text-xs font-semibold tracking-wide text-primary uppercase">
          {features.eyebrow}
        </p>
        <h2 className="font-heading text-4xl font-normal text-foreground">{features.title}</h2>
      </div>
      <FeatureBentoGrid items={features.items} />
    </PageSection>
  );
}
