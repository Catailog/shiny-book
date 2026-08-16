import Image from 'next/image';

import { Maximize2, Palette } from 'lucide-react';

import { PageSection } from '@/components/page-section';
import { defaultLocale, locales } from '@/locales';

const SPEC_ICONS = [Maximize2, Palette];

export default function LayoutGuidelinesPage() {
  const t = locales[defaultLocale];
  const page = t.layoutGuidelines;

  return (
    <>
      <PageSection
        sectionClassName="bg-secondary"
        className="flex flex-col items-center gap-10 py-20 lg:flex-row"
      >
        <div className="flex flex-1 flex-col gap-5">
          <span className="w-fit rounded bg-accent-soft px-3 py-1.5 text-xs font-semibold tracking-wide text-accent uppercase">
            {page.hero.eyebrow}
          </span>
          <h1 className="font-heading text-4xl leading-tight font-normal text-foreground sm:text-5xl">
            {page.hero.title}
          </h1>
          <p className="text-base leading-relaxed text-muted-foreground">{page.hero.description}</p>
        </div>
        <div className="relative h-80 w-full overflow-hidden rounded-lg border border-border bg-background lg:w-120">
          <Image
            src="/images/layout-guidelines/hero.png"
            alt=""
            fill
            sizes="(min-width: 1024px) 480px, 100vw"
            className="object-cover"
            priority
          />
        </div>
      </PageSection>

      <PageSection className="flex flex-col gap-12 py-20">
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold tracking-wide text-accent uppercase">
            {page.specs.eyebrow}
          </p>
          <h2 className="font-heading text-3xl font-normal text-foreground">{page.specs.title}</h2>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          {page.specs.items.map((spec, index) => {
            const SpecIcon = SPEC_ICONS[index];
            return (
              <div
                key={spec.title}
                className="flex flex-col items-start gap-5 rounded-lg border border-border bg-secondary p-8"
              >
                {SpecIcon ? <SpecIcon aria-hidden="true" className="size-6 text-accent" /> : null}
                <h3 className="font-heading text-xl font-semibold text-foreground">{spec.title}</h3>
                <p className="text-sm text-muted-foreground">{spec.description}</p>
              </div>
            );
          })}
        </div>
      </PageSection>

      <PageSection sectionClassName="bg-secondary" className="flex flex-col gap-12 py-20">
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold tracking-wide text-accent uppercase">
            {page.templates.eyebrow}
          </p>
          <h2 className="font-heading text-3xl font-normal text-foreground">
            {page.templates.title}
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {page.templates.items.map((template) => (
            <div
              key={template.title}
              className="flex flex-col gap-5 rounded-md border border-border bg-background p-7"
            >
              <div className="relative flex h-40 w-full items-center justify-center overflow-hidden rounded bg-secondary">
                <Image
                  src={template.image}
                  alt={template.title}
                  width={120}
                  height={120}
                  className="size-30 object-cover"
                />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="font-heading text-lg font-semibold text-foreground">
                  {template.title}
                </h3>
                <p className="text-[13px] text-muted-foreground">{template.description}</p>
              </div>
            </div>
          ))}
        </div>
      </PageSection>
    </>
  );
}
