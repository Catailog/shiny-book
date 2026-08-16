'use client';

import { useState } from 'react';

import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Image as ImageIcon,
  Italic,
  Link as LinkIcon,
  MinusCircle,
  Underline,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useT } from '@/hooks/use-t';

const TOOLBAR_ICONS = [
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  LinkIcon,
  ImageIcon,
];

const DEFAULT_QUESTION = '친환경 FSC 보존 용지와 일반 인화지의 차이점은 무엇인가요?';
const DEFAULT_ANSWER =
  '저희 Bookcraft Studio에서 사용하는 파인아트지는 전통적인 인화지와 달리 산성을 띠지 않는(Acid-free) FSC 인증 천연 무독성 종이입니다.\n\n시간이 지나도 황변 현상이 발생하지 않고 가벼운 물방울이나 햇빛 오염으로부터 완벽에 가까운 보존력을 보여줍니다. 또한 매트한 촉감 처리가 가미되어 빛 반사 없이 은은하고 깊이 있는 인쇄 결과물을 감상할 수 있습니다.';

export function CreateFaqForm() {
  const t = useT();
  const [question, setQuestion] = useState(DEFAULT_QUESTION);
  const [answer, setAnswer] = useState(DEFAULT_ANSWER);
  const [category, setCategory] = useState('Materials & Craft');

  return (
    <div className="flex gap-6">
      <div className="flex-1 rounded-lg border border-border bg-card p-8">
        <h2 className="mb-6 font-heading text-xl font-bold text-foreground">
          {t.admin.faqs.create.detailsTitle}
        </h2>
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-3 gap-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="faq-category">{t.admin.faqs.create.categoryLabel}</Label>
              <Input
                id="faq-category"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="faq-display-order">{t.admin.faqs.create.displayOrderLabel}</Label>
              <Input id="faq-display-order" defaultValue="3" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="faq-status">{t.admin.faqs.create.statusLabel}</Label>
              <div className="flex h-9 items-center gap-2">
                <Switch id="faq-status" defaultChecked />
                <span className="text-sm font-semibold text-primary">
                  {t.admin.announcements.list.statusLabels.published}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="faq-question">{t.admin.faqs.create.questionLabel}</Label>
            <Input
              id="faq-question"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>{t.admin.faqs.create.answerLabel}</Label>
            <div className="flex flex-col rounded-md border border-border">
              <div className="flex items-center gap-4 border-b border-border bg-muted px-3 py-2">
                {TOOLBAR_ICONS.map((Icon, index) => (
                  <Icon key={index} aria-hidden="true" className="size-3.5 text-muted-foreground" />
                ))}
              </div>
              <Textarea
                value={answer}
                onChange={(event) => setAnswer(event.target.value)}
                rows={8}
                className="rounded-t-none border-none focus-visible:ring-0"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline">{t.admin.faqs.create.cancelButton}</Button>
            <Button>{t.admin.faqs.create.submitButton}</Button>
          </div>
        </div>
      </div>

      <div className="flex w-105 shrink-0 flex-col gap-3">
        <span className="text-xs font-bold text-muted-foreground">
          {t.admin.faqs.create.previewTitle}
        </span>
        <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6">
          <span className="flex items-center gap-2 text-xs font-semibold text-primary">
            <span className="size-2 rounded-full bg-primary" />
            {category} Guide
          </span>
          <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
            <p className="font-heading text-xl font-semibold text-foreground">{question}</p>
            <MinusCircle aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
          </div>
          <p className="text-sm whitespace-pre-line text-muted-foreground">{answer}</p>
          <div className="flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
            <span>{t.admin.faqs.create.helpfulQuestion}</span>
            <div className="flex gap-3 font-semibold">
              <span className="text-primary">{t.admin.faqs.create.yes}</span>
              <span>{t.admin.faqs.create.no}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
