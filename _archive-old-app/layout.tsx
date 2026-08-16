import Link from 'next/link';

import { BookOpen, LogOut, User } from 'lucide-react';

import { signOutConsumer } from '@/app/(public)/mypage/(protected)/actions';
import { SiteContainer } from '@/components/site-container';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { HOME_SECTION_ANCHORS } from '@/constants/home-sections';
import {
  CONSUMER_ROUTES,
  FAQ_ROUTES,
  LEGAL_ROUTES,
  NOTICE_ROUTES,
  REVIEW_ROUTES,
} from '@/constants/routes';
import { getCurrentConsumer } from '@/lib/auth/get-current-consumer';
import { defaultLocale, locales } from '@/locales';

const PLACEHOLDER_LABEL = '::PLACE_HOLDER::';

const SOCIAL_LINKS = [
  { label: 'Instagram', href: 'https://www.instagram.com' },
  { label: 'Pinterest', href: 'https://www.pinterest.com' },
  { label: 'Twitter', href: 'https://x.com' },
];

export default async function PublicLayout(props: LayoutProps<'/'>) {
  const t = locales[defaultLocale];
  const consumer = await getCurrentConsumer();

  const navMenuItems: Array<{
    label: string;
    links: Array<{ label: string; href: string | null }>;
  }> = [
    {
      label: 'Products',
      links: [
        {
          label: t.site.home.hero.secondaryCtaLabel,
          href: `#${HOME_SECTION_ANCHORS.PRODUCT_COLLECTION}`,
        },
        { label: t.site.nav.startOrder, href: CONSUMER_ROUTES.NEW_ORDER },
        { label: t.site.nav.reviews, href: REVIEW_ROUTES.LIST },
      ],
    },
    {
      label: 'Gallery',
      links: [{ label: PLACEHOLDER_LABEL, href: null }],
    },
    {
      label: 'Pricing',
      links: [
        { label: t.site.home.products.title, href: `#${HOME_SECTION_ANCHORS.PRODUCT_COLLECTION}` },
      ],
    },
    {
      label: 'About',
      links: [{ label: PLACEHOLDER_LABEL, href: null }],
    },
  ];

  const footerColumns: Array<{
    heading: string;
    links: Array<{ label: string; href: string }>;
  }> = [
    {
      heading: t.site.footer.productsTitle,
      links: [
        {
          label: t.site.home.hero.secondaryCtaLabel,
          href: `#${HOME_SECTION_ANCHORS.PRODUCT_COLLECTION}`,
        },
        { label: t.site.nav.startOrder, href: CONSUMER_ROUTES.NEW_ORDER },
        { label: t.site.nav.reviews, href: REVIEW_ROUTES.LIST },
      ],
    },
    {
      heading: t.site.footer.customerServiceTitle,
      links: [
        { label: t.site.nav.notices, href: NOTICE_ROUTES.LIST },
        { label: t.site.nav.faq, href: FAQ_ROUTES.LIST },
        { label: t.site.footer.inquiries, href: CONSUMER_ROUTES.INQUIRIES },
      ],
    },
    {
      heading: t.site.footer.companyTitle,
      links: [
        { label: t.site.footer.terms, href: LEGAL_ROUTES.TERMS },
        { label: t.site.footer.privacy, href: LEGAL_ROUTES.PRIVACY },
      ],
    },
  ];

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="sticky top-0 z-40 flex h-20 w-full items-center border-b border-border bg-background">
        <SiteContainer className="grid grid-cols-2 items-center md:grid-cols-[1fr_auto_1fr]">
          <Link href="/" className="flex items-center gap-2 justify-self-start">
            <BookOpen aria-hidden="true" strokeWidth={1.8} className="size-5 text-foreground" />
            <span className="font-heading text-lg font-semibold text-foreground">Shiny Book</span>
          </Link>
          <NavigationMenu className="hidden max-w-none justify-self-center md:col-start-2 md:flex">
            <NavigationMenuList>
              {navMenuItems.map((item) => (
                <NavigationMenuItem key={item.label}>
                  <NavigationMenuTrigger className="text-sm font-medium text-muted-foreground data-popup-open:text-foreground data-open:text-foreground">
                    {item.label}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="flex w-48 flex-col gap-0.5">
                      {item.links.map((link) =>
                        link.href ? (
                          <li key={link.label}>
                            <NavigationMenuLink render={<Link href={link.href} />}>
                              {link.label}
                            </NavigationMenuLink>
                          </li>
                        ) : (
                          <li
                            key={link.label}
                            className="p-2 text-sm text-muted-foreground/60"
                            aria-hidden="true"
                          >
                            {link.label}
                          </li>
                        ),
                      )}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
          <nav className="col-start-2 flex items-center gap-1 justify-self-end md:col-start-3">
            {consumer ? (
              <>
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <Link
                        href={CONSUMER_ROUTES.MYPAGE}
                        aria-label={t.site.nav.mypage}
                        className="flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      />
                    }
                  >
                    <User aria-hidden="true" className="size-5" />
                  </TooltipTrigger>
                  <TooltipContent>{t.site.nav.mypage}</TooltipContent>
                </Tooltip>
                <form action={signOutConsumer}>
                  <Tooltip>
                    <TooltipTrigger
                      type="submit"
                      aria-label={t.site.nav.logout}
                      className="flex size-9 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      <LogOut aria-hidden="true" className="size-5" />
                    </TooltipTrigger>
                    <TooltipContent>{t.site.nav.logout}</TooltipContent>
                  </Tooltip>
                </form>
              </>
            ) : (
              <>
                <Link
                  href={CONSUMER_ROUTES.LOGIN}
                  className="hidden text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:inline"
                >
                  {t.site.nav.login}
                </Link>
                <Link
                  href={CONSUMER_ROUTES.SIGNUP}
                  className="hidden text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:inline"
                >
                  {t.site.nav.signup}
                </Link>
              </>
            )}
          </nav>
        </SiteContainer>
      </header>
      <main className="flex flex-1 flex-col">{props.children}</main>
      <footer className="w-full bg-primary px-6 pt-20 pb-12 text-primary-foreground sm:px-10 lg:px-20">
        <div className="flex w-full flex-col gap-16">
          <div className="flex w-full flex-col justify-between gap-12 lg:flex-row lg:gap-16">
            <div className="flex max-w-xs flex-col gap-5">
              <div className="inline-flex items-center gap-2">
                <BookOpen aria-hidden="true" strokeWidth={1.75} className="size-5" />
                <span className="font-heading text-xl font-semibold">Shiny Book</span>
              </div>
              <p className="text-sm leading-relaxed whitespace-pre-line text-primary-foreground/60">
                {t.site.footer.businessInfo}
              </p>
            </div>
            <nav
              className="grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-x-12 lg:gap-x-20"
              aria-label="Footer navigation"
            >
              {footerColumns.map((column) => (
                <div key={column.heading} className="flex flex-col items-start gap-4">
                  <h2 className="text-accent text-xs font-bold tracking-wide uppercase">
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
              <p className="text-xs text-primary-foreground/60">{t.site.footer.copyright}</p>
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
        </div>
      </footer>
    </div>
  );
}
