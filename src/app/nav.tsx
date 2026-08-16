import Link from 'next/link';

import { BookOpen } from 'lucide-react';

import { SiteContainer } from '@/components/site-container';
import { Button } from '@/components/ui/button';
import { HOME_SECTION_ANCHORS } from '@/constants/home-sections';
import { CONSUMER_ROUTES, MARKETING_ROUTES } from '@/constants/routes';
import { defaultLocale, locales } from '@/locales';

export function Nav() {
  const t = locales[defaultLocale];

  const navLinks = [
    { label: t.site.nav.products, href: `#${HOME_SECTION_ANCHORS.PRODUCT_COLLECTION}` },
    { label: t.site.nav.gallery, href: MARKETING_ROUTES.GALLERY },
    { label: t.site.nav.pricing, href: MARKETING_ROUTES.PRICING },
    { label: t.site.nav.about, href: MARKETING_ROUTES.ABOUT },
  ];

  return (
    <header className="sticky top-0 z-40 h-20 w-full border-b border-border bg-background">
      <SiteContainer className="flex h-full items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <BookOpen aria-hidden="true" strokeWidth={1.8} className="size-5 text-foreground" />
          <span className="font-heading text-lg font-semibold text-foreground">Shiny Book</span>
        </Link>
        <nav className="hidden items-start gap-10 text-sm font-medium text-muted-foreground md:flex">
          {navLinks.map((link) => (
            <Link key={link.label} href={link.href} className="hover:text-foreground">
              {link.label}
            </Link>
          ))}
        </nav>
        <Button
          render={<Link href={CONSUMER_ROUTES.NEW_ORDER} />}
          nativeButton={false}
          className="h-auto rounded bg-accent px-7 py-3.5 text-xs font-semibold tracking-wide text-accent-foreground uppercase hover:bg-accent/90"
        >
          {t.site.nav.startOrder}
        </Button>
      </SiteContainer>
    </header>
  );
}
