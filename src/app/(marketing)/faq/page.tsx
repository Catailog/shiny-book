import { FinalCta } from '@/app/(marketing)/final-cta';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { FAQ_LIST_LIMIT } from '@/constants/faq';
import { getFaqs } from '@/lib/faqs/get-faqs';
import { defaultLocale, locales } from '@/locales';

export default async function FaqPage() {
  const t = locales[defaultLocale];
  const faqs = await getFaqs(FAQ_LIST_LIMIT);

  return (
    <>
      <section className="w-full bg-secondary px-6 pt-20 pb-15 sm:px-10 lg:px-20">
        <div className="flex max-w-3xl flex-col gap-5">
          <p className="text-sm font-semibold tracking-wide text-accent uppercase">
            {t.faq.hero.eyebrow}
          </p>
          <h1 className="font-heading text-5xl font-bold text-foreground">{t.faq.title}</h1>
          <p className="text-base text-muted-foreground">{t.faq.hero.description}</p>
        </div>
      </section>
      <section className="w-full px-6 py-15 sm:px-10 lg:px-20">
        {faqs.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t.faq.empty}</p>
        ) : (
          <Accordion className="mx-auto max-w-3xl rounded-lg border border-border bg-background px-7">
            {faqs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id}>
                <AccordionTrigger className="py-6 text-base font-semibold text-foreground">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-[15px] leading-relaxed text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </section>
      <FinalCta />
    </>
  );
}
