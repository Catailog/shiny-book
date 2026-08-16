import Image from 'next/image';

import { Gem, Hammer, Leaf } from 'lucide-react';

import { PageSection } from '@/components/page-section';
import { defaultLocale, locales } from '@/locales';

const VALUE_ICONS = [Hammer, Leaf, Gem];

export default function AboutPage() {
  const t = locales[defaultLocale];
  const about = t.about;

  return (
    <>
      <PageSection className="flex flex-col items-center gap-10 py-20 lg:flex-row">
        <div className="flex flex-1 flex-col gap-5">
          <span className="w-fit rounded bg-accent-soft px-3 py-1.5 text-xs font-semibold tracking-wide text-accent uppercase">
            {about.hero.eyebrow}
          </span>
          <h1 className="font-heading text-4xl leading-tight font-normal text-foreground sm:text-5xl">
            {about.hero.title}
          </h1>
          <p className="text-base leading-relaxed text-muted-foreground">
            {about.hero.description}
          </p>
        </div>
        <div className="relative h-100 w-full overflow-hidden rounded-lg lg:w-135">
          <Image
            src="/images/about/hero.png"
            alt=""
            fill
            sizes="(min-width: 1024px) 540px, 100vw"
            className="object-cover"
            priority
          />
        </div>
      </PageSection>

      <PageSection sectionClassName="bg-secondary" className="flex flex-col gap-12 py-20">
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-xs font-semibold tracking-wide text-accent uppercase">
            {about.values.eyebrow}
          </p>
          <h2 className="font-heading text-4xl font-normal text-foreground">
            {about.values.title}
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {about.values.items.map((value, index) => {
            const ValueIcon = VALUE_ICONS[index];
            return (
              <div
                key={value.title}
                className="flex flex-col items-start gap-5 rounded-lg border border-border bg-background p-10"
              >
                {ValueIcon ? (
                  <ValueIcon aria-hidden="true" className="size-12 text-accent" />
                ) : null}
                <h3 className="font-heading text-xl font-semibold text-foreground">
                  {value.title}
                </h3>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </div>
            );
          })}
        </div>
      </PageSection>

      <PageSection className="flex flex-col gap-12 py-20">
        <h2 className="font-heading text-3xl font-bold text-foreground">
          {about.milestones.title}
        </h2>
        <div className="flex flex-col gap-8">
          {about.milestones.items.map((milestone) => (
            <div key={milestone.year} className="flex gap-10">
              <p className="w-24 shrink-0 font-heading text-3xl font-light text-accent">
                {milestone.year}
              </p>
              <div className="flex flex-col gap-2">
                <h3 className="font-heading text-lg font-semibold text-foreground">
                  {milestone.title}
                </h3>
                <p className="text-sm text-muted-foreground">{milestone.description}</p>
              </div>
            </div>
          ))}
        </div>
      </PageSection>

      <PageSection sectionClassName="bg-secondary" className="flex flex-col gap-12 py-20">
        <h2 className="font-heading text-3xl font-bold text-foreground">{about.team.title}</h2>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {about.team.members.map((member) => (
            <div
              key={member.name}
              className="flex flex-col gap-5 rounded-lg border border-border bg-background p-8"
            >
              <div className="relative h-60 w-full overflow-hidden rounded-md">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  sizes="(min-width: 640px) 33vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col gap-1">
                <p className="font-heading text-xl font-semibold text-foreground">{member.name}</p>
                <p className="text-sm font-semibold text-accent">{member.role}</p>
              </div>
              <p className="text-sm text-muted-foreground">{member.description}</p>
            </div>
          ))}
        </div>
      </PageSection>
    </>
  );
}
