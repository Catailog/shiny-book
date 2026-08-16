import Link from 'next/link';

import { BookOpen } from 'lucide-react';

import { SiteContainer } from '@/components/site-container';
import { HOME_SECTION_ANCHORS } from '@/constants/home-sections';
import { CONSUMER_ROUTES, FAQ_ROUTES, MARKETING_ROUTES, REVIEW_ROUTES } from '@/constants/routes';
import { defaultLocale, locales } from '@/locales';

const SOCIAL_LINKS = [
  { label: 'Instagram', href: 'https://www.instagram.com' },
  { label: 'Pinterest', href: 'https://www.pinterest.com' },
  { label: 'Twitter', href: 'https://x.com' },
];

export function Footer() {
  const t = locales[defaultLocale];
  const footer = t.site.footer;

  const columns: Array<{ heading: string; links: Array<{ label: string; href: string }> }> = [
    {
      heading: footer.productsTitle,
      links: [
        { label: footer.links.viewProducts, href: `#${HOME_SECTION_ANCHORS.PRODUCT_COLLECTION}` },
        { label: t.site.nav.startOrder, href: CONSUMER_ROUTES.NEW_ORDER },
        { label: t.site.nav.reviews, href: REVIEW_ROUTES.LIST },
      ],
    },
    {
      heading: footer.customerServiceTitle,
      links: [
        { label: footer.links.layoutGuidelines, href: MARKETING_ROUTES.LAYOUT_GUIDELINES },
        { label: footer.links.ecoPapers, href: MARKETING_ROUTES.ECO_PAPERS },
        { label: footer.links.shippingPolicy, href: MARKETING_ROUTES.SHIPPING_POLICY },
        { label: t.site.nav.faq, href: FAQ_ROUTES.LIST },
      ],
    },
    {
      heading: footer.companyTitle,
      links: [
        { label: footer.links.ourStory, href: MARKETING_ROUTES.ABOUT },
        { label: footer.links.atelier, href: MARKETING_ROUTES.ATELIER },
        { label: footer.links.sustainability, href: MARKETING_ROUTES.SUSTAINABILITY },
        { label: footer.links.press, href: MARKETING_ROUTES.PRESS },
      ],
    },
  ];

  return (
    <footer className="w-full bg-primary text-primary-foreground">
      <SiteContainer className="flex flex-col gap-16 pt-20 pb-12">
        <div className="flex w-full flex-col justify-between gap-12 lg:flex-row lg:gap-16">
          <div className="flex max-w-xs flex-col gap-5">
            <div className="inline-flex items-center gap-2">
              <BookOpen aria-hidden="true" strokeWidth={1.75} className="size-5" />
              <span className="font-heading text-xl font-semibold">Shiny Book</span>
            </div>
            <p className="text-sm leading-relaxed whitespace-pre-line text-primary-foreground/60">
              {footer.businessInfo}
            </p>
          </div>
          <nav
            className="grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-x-12 lg:gap-x-20"
            aria-label="Footer navigation"
          >
            {columns.map((column) => (
              <div key={column.heading} className="flex flex-col items-start gap-4">
                <h2 className="text-xs font-bold tracking-wide text-accent uppercase">
                  {column.heading}
                </h2>
                <ul className="flex flex-col items-start gap-4">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-primary-foreground/80 transition-opacity hover:text-primary-foreground"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
        <div className="flex w-full flex-col gap-6">
          <div className="h-px w-full bg-primary-foreground/20" />
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <p className="text-xs text-primary-foreground/60">{footer.copyright}</p>
            <ul className="flex items-center gap-6">
              {SOCIAL_LINKS.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary-foreground/60 transition-opacity hover:text-primary-foreground"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </SiteContainer>
    </footer>
  );
}
