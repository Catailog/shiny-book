import Image from 'next/image';

import { Leaf } from 'lucide-react';

import { defaultLocale, locales } from '@/locales';

export default function EcoPapersPage() {
  const t = locales[defaultLocale];
  const page = t.ecoPapers;

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
              src="/images/eco-papers/hero.png"
              alt=""
              fill
              sizes="(min-width: 1024px) 480px, 100vw"
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      <section className="w-full border-y border-border bg-secondary px-6 py-15 sm:px-10 lg:px-20">
        <div className="flex flex-col items-center gap-8 sm:flex-row">
          <div className="flex size-30 shrink-0 items-center justify-center rounded-full bg-accent-soft">
            <Leaf aria-hidden="true" className="size-10 text-accent" />
          </div>
          <div className="flex flex-col gap-3">
            <h2 className="font-heading text-2xl font-normal text-foreground">{page.fsc.title}</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">{page.fsc.description}</p>
          </div>
        </div>
      </section>

      <section className="w-full px-6 py-20 sm:px-10 lg:px-20">
        <div className="flex flex-col gap-12">
          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold tracking-wide text-accent uppercase">
              {page.catalog.eyebrow}
            </p>
            <h2 className="font-heading text-3xl font-normal text-foreground">
              {page.catalog.title}
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {page.catalog.items.map((paper) => (
              <div
                key={paper.name}
                className="flex flex-col gap-5 rounded-lg border border-border bg-background p-7 shadow-sm"
              >
                <div className="relative h-45 w-full overflow-hidden rounded bg-secondary">
                  <Image
                    src={paper.image}
                    alt={paper.name}
                    fill
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-heading text-lg font-semibold text-foreground">
                      {paper.name}
                    </p>
                    <p className="text-xs font-semibold text-accent">{paper.weight}</p>
                  </div>
                  <p className="text-[13px] text-muted-foreground">{paper.description}</p>
                  <div className="h-px w-full bg-border" />
                  <p className="text-[11px] font-semibold tracking-wide text-foreground uppercase">
                    {paper.bestFor}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full bg-secondary px-6 py-20 text-center sm:px-10 lg:px-20">
        <div className="flex flex-col items-center gap-12">
          <div className="flex flex-col items-center gap-3">
            <p className="text-xs font-semibold tracking-wide text-accent uppercase">
              {page.impact.eyebrow}
            </p>
            <h2 className="font-heading text-3xl font-normal text-foreground">
              {page.impact.title}
            </h2>
          </div>
          <div className="grid w-full grid-cols-1 gap-8 sm:grid-cols-3">
            {page.impact.stats.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-2">
                <p className="font-heading text-4xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm tracking-wide text-muted-foreground uppercase">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
