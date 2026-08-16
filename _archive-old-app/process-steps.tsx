import { LayoutTemplate, PackageCheck, Upload } from 'lucide-react';

import { SiteContainer } from '@/components/site-container';
import { Card, CardContent } from '@/components/ui/card';
import { defaultLocale, locales } from '@/locales';

const STEP_ICONS = [Upload, LayoutTemplate, PackageCheck];

export function ProcessSteps() {
  const t = locales[defaultLocale];
  const steps = t.site.home.steps;

  return (
    <section className="w-full bg-muted">
      <SiteContainer className="flex flex-col gap-12 py-16 lg:py-24">
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="text-accent text-xs font-semibold tracking-wide uppercase">
            {steps.eyebrow}
          </span>
          <h2 className="font-heading text-3xl font-medium text-foreground sm:text-4xl">
            {steps.title}
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {steps.items.map((step, index) => {
            const Icon = STEP_ICONS[index];
            return (
              <Card
                key={step.title}
                className="rounded-lg border border-border bg-card shadow-none ring-0"
              >
                <CardContent className="flex flex-col gap-6 p-7 sm:p-10">
                  <div className="flex items-center justify-between">
                    {Icon ? (
                      <span className="bg-accent-soft text-accent flex size-12 items-center justify-center rounded-full">
                        <Icon aria-hidden="true" strokeWidth={1.6} className="size-5" />
                      </span>
                    ) : null}
                    <span className="font-heading text-3xl leading-none font-light text-border">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="font-heading text-xl font-semibold text-foreground">
                      {step.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
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
