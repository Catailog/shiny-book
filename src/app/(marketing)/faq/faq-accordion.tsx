'use client';

import { useEffect, useState } from 'react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export interface FaqAccordionItem {
  id: string;
  question: string;
  answer: string;
}

// Opens (and scrolls to) the item named by the URL hash, e.g. /faq#<id>, so the
// AI assistant's "관련 FAQ" links land on the relevant answer already expanded.
export function FaqAccordion({ faqs }: { faqs: FaqAccordionItem[] }) {
  const [value, setValue] = useState<string[]>([]);

  useEffect(() => {
    const hash = decodeURIComponent(window.location.hash.replace(/^#/, ''));
    if (hash.length === 0 || !faqs.some((faq) => faq.id === hash)) {
      return;
    }

    // Sync the open item to the URL hash, which is client-only external state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setValue([hash]);
    requestAnimationFrame(() => {
      document.getElementById(hash)?.scrollIntoView({ block: 'center' });
    });
  }, [faqs]);

  return (
    <Accordion
      value={value}
      onValueChange={(next: string[]) => setValue(next)}
      className="mx-auto max-w-3xl rounded-lg border border-border bg-background px-7"
    >
      {faqs.map((faq) => (
        <AccordionItem key={faq.id} id={faq.id} value={faq.id} className="scroll-mt-24">
          <AccordionTrigger className="py-6 text-base font-semibold text-foreground">
            {faq.question}
          </AccordionTrigger>
          <AccordionContent className="text-[15px] leading-relaxed text-muted-foreground">
            {faq.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
