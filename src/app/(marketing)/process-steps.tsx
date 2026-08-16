import { Gift, Palette, UploadCloud } from 'lucide-react';

import { PageSection } from '@/components/page-section';
import { defaultLocale, locales } from '@/locales';

const STEP_ICONS = [UploadCloud, Palette, Gift];

export function ProcessSteps() {
  const t = locales[defaultLocale];
  const steps = t.site.home.steps;

  return (
    <PageSection
      sectionClassName="bg-secondary"
      className="flex flex-col items-center gap-16 py-24"
    >
      <div className="flex flex-col items-center gap-4 text-center">
        <p className="text-xs font-semibold tracking-wide text-accent uppercase">{steps.eyebrow}</p>
        <h2 className="font-heading text-4xl font-normal text-foreground">{steps.title}</h2>
      </div>
      <div className="grid w-full grid-cols-1 gap-8 sm:grid-cols-3">
        {steps.items.map((step, index) => {
          const StepIcon = STEP_ICONS[index];
          return (
            <div
              key={step.title}
              className="flex flex-col items-start gap-6 rounded-lg border border-border bg-background p-10"
            >
              <div className="flex w-full items-center justify-between">
                <div className="flex size-12 items-center justify-center rounded-full bg-accent-soft">
                  {StepIcon ? <StepIcon aria-hidden="true" className="size-5 text-accent" /> : null}
                </div>
                <p className="font-heading text-3xl font-light text-border">
                  {String(index + 1).padStart(2, '0')}
                </p>
              </div>
              <div className="flex flex-col items-start gap-2">
                <h3 className="font-heading text-xl font-semibold text-foreground">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </PageSection>
  );
}
