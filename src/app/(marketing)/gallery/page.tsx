import { FinalCta } from '@/app/(marketing)/final-cta';
import { PageSection } from '@/components/page-section';
import { defaultLocale, locales } from '@/locales';

import { GalleryGrid } from './gallery-grid';

export default function GalleryPage() {
  const t = locales[defaultLocale];
  const gallery = t.gallery;

  return (
    <>
      <PageSection sectionClassName="bg-secondary" className="pt-20 pb-15">
        <div className="flex max-w-3xl flex-col gap-5">
          <p className="text-sm font-semibold tracking-wide text-accent uppercase">
            {gallery.hero.eyebrow}
          </p>
          <h1 className="font-heading text-5xl font-bold text-foreground">{gallery.hero.title}</h1>
          <p className="text-base text-muted-foreground">{gallery.hero.description}</p>
        </div>
      </PageSection>
      <PageSection className="py-15">
        <GalleryGrid items={gallery.items} filters={gallery.filters} />
      </PageSection>
      <FinalCta />
    </>
  );
}
