import { FileText, LayoutGrid, ScrollText, Truck } from 'lucide-react';

import { PageSection } from '@/components/page-section';
import { getLocale } from '@/lib/i18n/get-locale';
import { locales } from '@/locales';

const FEATURE_ICONS = [FileText, ScrollText, LayoutGrid, Truck];

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
      <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {features.items.map((feature, index) => {
          const FeatureIcon = FEATURE_ICONS[index];
          return (
            <div
              key={feature.title}
              className="flex flex-col items-start gap-5 rounded-md border border-border bg-background p-8"
            >
              <div className="flex size-10 items-center justify-center rounded bg-primary-soft">
                {FeatureIcon ? (
                  <FeatureIcon aria-hidden="true" className="size-4.5 text-primary" />
                ) : null}
              </div>
              <div className="flex flex-col items-start gap-2">
                <h3 className="font-heading text-lg font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-[13px] text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </PageSection>
  );
}
