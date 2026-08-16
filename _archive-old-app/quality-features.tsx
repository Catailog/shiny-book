import { BookOpen, LayoutTemplate, PackageCheck, ScrollText } from 'lucide-react';

import { SiteContainer } from '@/components/site-container';
import { Card, CardContent } from '@/components/ui/card';
import { defaultLocale, locales } from '@/locales';

const FEATURE_ICONS = [ScrollText, BookOpen, LayoutTemplate, PackageCheck];

export function QualityFeatures() {
  const t = locales[defaultLocale];
  const features = t.site.home.features;

  return (
    <section className="w-full bg-muted">
      <SiteContainer className="flex flex-col gap-12 py-16 lg:py-24">
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="text-accent text-xs font-semibold tracking-wide uppercase">
            {features.eyebrow}
          </span>
          <h2 className="font-heading text-3xl font-medium text-foreground sm:text-4xl">
            {features.title}
          </h2>
          <p className="max-w-xl text-muted-foreground">{features.subtitle}</p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {features.items.map((feature, index) => {
            const Icon = FEATURE_ICONS[index % FEATURE_ICONS.length];
            return (
              <Card
                key={feature.title}
                className="rounded-md border border-border bg-card p-8 shadow-none ring-0"
              >
                <CardContent className="flex flex-col items-start gap-5 p-0">
                  <span className="bg-accent-soft text-accent flex size-10 items-center justify-center rounded">
                    {Icon ? (
                      <Icon aria-hidden="true" strokeWidth={1.75} className="size-5" />
                    ) : null}
                  </span>
                  <div className="flex flex-col gap-2">
                    <h3 className="font-heading text-lg font-medium text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </SiteContainer>
    </section>
  );
}
