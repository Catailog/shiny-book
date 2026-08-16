import Image from 'next/image';

import { PageSection } from '@/components/page-section';
import { getLocale } from '@/lib/i18n/get-locale';
import { cn } from '@/lib/utils';
import { locales } from '@/locales';

export default async function AtelierPage() {
  const locale = await getLocale();
  const t = locales[locale];
  const atelier = t.atelier;

  return (
    <>
      <PageSection sectionClassName="bg-secondary" className="pt-20 pb-15">
        <div className="flex max-w-3xl flex-col gap-5">
          <p className="text-sm font-semibold tracking-wide text-primary uppercase">
            {atelier.hero.eyebrow}
          </p>
          <h1 className="font-heading text-5xl font-bold text-foreground">{atelier.hero.title}</h1>
          <p className="text-base text-muted-foreground">{atelier.hero.description}</p>
        </div>
      </PageSection>

      <PageSection className="flex flex-col gap-20 py-20">
        {atelier.process.map((step, index) => (
          <div
            key={step.title}
            className={cn(
              'flex flex-col items-center gap-12 lg:flex-row',
              index % 2 === 1 && 'lg:flex-row-reverse',
            )}
          >
            <div className="relative h-100 w-full shrink-0 overflow-hidden rounded-lg lg:w-135">
              <Image
                src={step.image}
                alt={step.title}
                fill
                sizes="(min-width: 1024px) 540px, 100vw"
                className="object-cover"
              />
            </div>
            <div className="flex flex-1 flex-col gap-4">
              <p className="font-heading text-5xl font-light text-border">
                {String(index + 1).padStart(2, '0')}
              </p>
              <h2 className="font-heading text-2xl font-bold text-foreground">{step.title}</h2>
              <p className="text-base leading-relaxed text-muted-foreground">{step.description}</p>
            </div>
          </div>
        ))}
      </PageSection>

      <PageSection sectionClassName="bg-secondary" className="flex flex-col gap-12 py-20">
        <h2 className="font-heading text-3xl font-bold text-foreground">
          {atelier.materials.title}
        </h2>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {atelier.materials.items.map((material) => (
            <div
              key={material.title}
              className="flex flex-col gap-4 rounded-md border border-border bg-background p-8"
            >
              <p className="text-[11px] font-semibold tracking-wide text-primary uppercase">
                {material.eyebrow}
              </p>
              <h3 className="font-heading text-xl font-semibold text-foreground">
                {material.title}
              </h3>
              <p className="text-sm text-muted-foreground">{material.description}</p>
            </div>
          ))}
        </div>
      </PageSection>
    </>
  );
}
