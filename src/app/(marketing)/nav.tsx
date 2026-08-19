import Link from 'next/link';

import { Shield } from 'lucide-react';

import { LanguageToggle } from '@/components/language-toggle';
import { SiteContainer } from '@/components/site-container';
import { ThemeToggle } from '@/components/theme-toggle';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  ADMIN_ROUTES,
  FAQ_ROUTES,
  MARKETING_ROUTES,
  NOTICE_ROUTES,
  PRODUCT_ROUTES,
  REVIEW_ROUTES,
} from '@/constants/routes';
import { getCurrentConsumer } from '@/lib/auth/get-current-consumer';
import { getLocale } from '@/lib/i18n/get-locale';
import { locales } from '@/locales';

import { NavAuthIcons } from './nav-auth-icons';
import { type NavEntry, NavLinks } from './nav-links';

export async function Nav() {
  const locale = await getLocale();
  const t = locales[locale];
  const consumer = await getCurrentConsumer();
  const isConsumer = consumer !== null;

  const navEntries: NavEntry[] = [
    {
      type: 'group',
      label: t.site.nav.products,
      items: [
        { label: t.site.footer.links.viewProducts, href: PRODUCT_ROUTES.LIST },
        { label: t.site.nav.reviews, href: REVIEW_ROUTES.LIST },
      ],
    },
    {
      type: 'group',
      label: t.site.nav.studioGroup,
      items: [
        { label: t.site.nav.about, href: MARKETING_ROUTES.ABOUT },
        { label: t.site.nav.atelier, href: MARKETING_ROUTES.ATELIER },
        { label: t.site.nav.gallery, href: MARKETING_ROUTES.GALLERY },
        { label: t.site.footer.links.sustainability, href: MARKETING_ROUTES.SUSTAINABILITY },
        { label: t.site.footer.links.press, href: MARKETING_ROUTES.PRESS },
      ],
    },
    {
      type: 'group',
      label: t.site.nav.productionGroup,
      items: [
        { label: t.site.nav.pricing, href: MARKETING_ROUTES.PRICING },
        { label: t.site.footer.links.layoutGuidelines, href: MARKETING_ROUTES.LAYOUT_GUIDELINES },
        { label: t.site.footer.links.ecoPapers, href: MARKETING_ROUTES.ECO_PAPERS },
        { label: t.site.footer.links.shippingPolicy, href: MARKETING_ROUTES.SHIPPING_POLICY },
      ],
    },
    {
      type: 'group',
      label: t.site.nav.supportGroup,
      items: [
        { label: t.site.nav.notices, href: NOTICE_ROUTES.LIST },
        { label: t.site.nav.faq, href: FAQ_ROUTES.LIST },
      ],
    },
  ];

  return (
    <header className="sticky top-0 z-40 h-20 w-full border-b border-border bg-background">
      <SiteContainer className="flex h-full items-center justify-between">
        <NavLinks brandName="Shiny Book" entries={navEntries} />
        <TooltipProvider>
          <div className="flex items-center gap-1">
            <LanguageToggle locale={locale} label={t.site.nav.changeLanguage} />
            <ThemeToggle
              switchToLightLabel={t.site.nav.switchToLightMode}
              switchToDarkLabel={t.site.nav.switchToDarkMode}
            />
            <Tooltip>
              <TooltipTrigger
                render={
                  <Link
                    href={ADMIN_ROUTES.DASHBOARD}
                    aria-label={t.site.nav.goToAdmin}
                    className="flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  />
                }
              >
                <Shield aria-hidden="true" className="size-5" />
              </TooltipTrigger>
              <TooltipContent>{t.site.nav.goToAdminTooltip}</TooltipContent>
            </Tooltip>
            <NavAuthIcons
              isConsumer={isConsumer}
              loginLabel={t.site.nav.login}
              mypageLabel={t.site.nav.mypage}
              logoutLabel={t.site.nav.logout}
            />
          </div>
        </TooltipProvider>
      </SiteContainer>
    </header>
  );
}
