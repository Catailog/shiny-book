import Image from 'next/image';

import { Mail } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { defaultLocale, locales } from '@/locales';

export default function PressPage() {
  const t = locales[defaultLocale];
  const page = t.press;

  return (
    <>
      <section className="w-full bg-secondary px-6 py-20 sm:px-10 lg:px-20">
        <div className="flex flex-col items-center gap-10 lg:flex-row">
          <div className="flex flex-1 flex-col gap-5">
            <span className="w-fit rounded bg-accent-soft px-3 py-1.5 text-xs font-semibold tracking-wide text-accent uppercase">
              {page.hero.eyebrow}
            </span>
            <h1 className="font-heading text-4xl leading-tight font-normal text-foreground sm:text-5xl">
              {page.hero.title}
            </h1>
            <p className="text-base leading-relaxed text-muted-foreground">
              {page.hero.description}
            </p>
          </div>
          <div className="relative h-80 w-full overflow-hidden rounded-lg border border-border bg-background lg:w-120">
            <Image
              src="/images/press/hero.png"
              alt=""
              fill
              sizes="(min-width: 1024px) 480px, 100vw"
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      <section className="w-full px-6 py-20 sm:px-10 lg:px-20">
        <div className="flex flex-col gap-16 lg:flex-row">
          <div className="flex flex-1 flex-col gap-16">
            <div className="flex flex-col gap-6">
              <h2 className="font-heading text-2xl font-normal text-foreground">
                {page.features.title}
              </h2>
              <div className="flex flex-col gap-4">
                {page.features.items.map((feature) => (
                  <div
                    key={feature.headline}
                    className="flex flex-col gap-2 rounded-md border border-border p-5"
                  >
                    <div className="flex items-center gap-3 text-xs">
                      <span className="font-semibold text-accent">{feature.date}</span>
                      <span className="text-muted-foreground">·</span>
                      <span className="font-semibold text-foreground">{feature.outlet}</span>
                    </div>
                    <p className="font-heading text-lg font-semibold text-foreground">
                      {feature.headline}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4 rounded-lg border border-border bg-secondary p-8">
              <h2 className="font-heading text-2xl font-normal text-foreground">
                {page.contact.title}
              </h2>
              <p className="text-sm text-muted-foreground">{page.contact.description}</p>
              <Button
                render={<a href="mailto:example@example.com" />}
                nativeButton={false}
                variant="outline"
                className="h-auto w-fit gap-2 rounded px-6 py-3 text-sm font-semibold"
              >
                <Mail aria-hidden="true" className="size-4" />
                {page.contact.buttonLabel}
              </Button>
            </div>
          </div>

          <div className="flex w-full flex-col gap-6 rounded-xl border border-border bg-secondary p-8 lg:w-105">
            <h2 className="font-heading text-xl font-semibold text-foreground">
              {page.factSheet.title}
            </h2>
            <div className="flex flex-col gap-5">
              {page.factSheet.items.map((item, index) => (
                <div key={item.label} className="flex flex-col gap-4">
                  {index > 0 ? <div className="h-px w-full bg-border" /> : null}
                  <div className="flex flex-col gap-1">
                    <p className="text-[11px] font-semibold tracking-wide text-accent uppercase">
                      {item.label}
                    </p>
                    <p className="font-heading text-base font-semibold text-foreground">
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
