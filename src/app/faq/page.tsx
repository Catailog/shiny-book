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
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-12">
      <h1 className="text-2xl font-semibold text-foreground">{t.faq.title}</h1>
      {faqs.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t.faq.empty}</p>
      ) : (
        <Accordion>
          {faqs.map((faq) => (
            <AccordionItem key={faq.id} value={faq.id}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>
                <p className="whitespace-pre-wrap text-muted-foreground">{faq.answer}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </main>
  );
}
