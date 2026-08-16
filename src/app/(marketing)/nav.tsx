import { LanguageToggle } from '@/components/language-toggle';
import { SiteContainer } from '@/components/site-container';
import { ThemeToggle } from '@/components/theme-toggle';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ROLE } from '@/constants/roles';
import { FAQ_ROUTES, MARKETING_ROUTES, PRODUCT_ROUTES } from '@/constants/routes';
import { getLocale } from '@/lib/i18n/get-locale';
import { getMockSessionRole } from '@/lib/mock/mock-session';
import { locales } from '@/locales';

import { NavAuthIcons } from './nav-auth-icons';
import { NavLinks } from './nav-links';

export async function Nav() {
  const locale = await getLocale();
  const t = locales[locale];
  const role = await getMockSessionRole();
  const isConsumer = role === ROLE.CONSUMER;

  const navLinks = [
    { label: t.site.nav.products, href: PRODUCT_ROUTES.LIST },
    { label: t.site.nav.gallery, href: MARKETING_ROUTES.GALLERY },
    { label: t.site.nav.pricing, href: MARKETING_ROUTES.PRICING },
    { label: t.site.nav.about, href: MARKETING_ROUTES.ABOUT },
    { label: t.site.nav.atelier, href: MARKETING_ROUTES.ATELIER },
    { label: t.site.nav.faq, href: FAQ_ROUTES.LIST },
  ];

  return (
    <header className="sticky top-0 z-40 h-20 w-full border-b border-border bg-background">
      <SiteContainer className="flex h-full items-center justify-between">
        <NavLinks brandName="Shiny Book" links={navLinks} />
        <TooltipProvider>
          <div className="flex items-center gap-1">
            <LanguageToggle locale={locale} label={t.site.nav.changeLanguage} />
            <ThemeToggle
              switchToLightLabel={t.site.nav.switchToLightMode}
              switchToDarkLabel={t.site.nav.switchToDarkMode}
            />
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
