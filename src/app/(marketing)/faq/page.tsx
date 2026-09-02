import Link from 'next/link';

import { PageSection } from '@/components/page-section';
import { Button } from '@/components/ui/button';
import { FAQ_LIST_LIMIT } from '@/constants/faq';
import { CONSUMER_ROUTES } from '@/constants/routes';
import { getFaqs } from '@/lib/faqs/get-faqs';
import { getLocale } from '@/lib/i18n/get-locale';
import { MOCK_FAQS } from '@/lib/mock/mock-faqs';
import { locales } from '@/locales';

import { FaqAccordion } from './faq-accordion';

export default async function FaqPage() {
  const locale = await getLocale();
  const t = locales[locale];
  const fetchedFaqs = await getFaqs(FAQ_LIST_LIMIT);
  const faqs = fetchedFaqs.length > 0 ? fetchedFaqs : MOCK_FAQS;

  return (
    <>
      <PageSection sectionClassName="bg-secondary" className="pt-20 pb-15">
        <div className="flex max-w-3xl flex-col gap-5">
          <p className="text-sm font-semibold tracking-wide text-primary uppercase">
            {t.faq.hero.eyebrow}
          </p>
          <h1 className="font-heading text-5xl font-bold text-foreground">{t.faq.title}</h1>
          <p className="text-base text-muted-foreground">{t.faq.hero.description}</p>
          <Button
            render={<Link href={CONSUMER_ROUTES.NEW_INQUIRY} />}
            nativeButton={false}
            variant="primary"
            className="h-auto w-fit p-4 text-sm font-semibold uppercase"
          >
            {t.faq.inquiryCtaLabel}
          </Button>
        </div>
      </PageSection>
      <PageSection className="py-15">
        {faqs.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t.faq.empty}</p>
        ) : (
          <FaqAccordion
            faqs={faqs.map((faq) => ({
              id: faq.id,
              question: faq.question,
              answer: faq.answer,
            }))}
          />
        )}
      </PageSection>
    </>
  );
}
