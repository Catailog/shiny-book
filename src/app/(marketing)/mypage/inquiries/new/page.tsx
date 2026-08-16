import Link from 'next/link';

import { Upload } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CONSUMER_ROUTES } from '@/constants/routes';
import { getLocale } from '@/lib/i18n/get-locale';
import { locales } from '@/locales';

export default async function MypageNewInquiryPage() {
  const locale = await getLocale();
  const t = locales[locale];

  return (
    <div className="flex flex-1 flex-col gap-8 px-10 py-10">
      <h1 className="font-heading text-4xl font-bold text-foreground">
        {t.consumer.inquiries.newTitle}
      </h1>

      <div className="flex max-w-3xl flex-col gap-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="inquiry-category">{t.consumer.inquiries.form.categoryLabel}</Label>
            <Input
              id="inquiry-category"
              placeholder={t.consumer.inquiries.form.categoryPlaceholder}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="inquiry-order">{t.consumer.inquiries.form.relatedOrderLabel}</Label>
            <Input
              id="inquiry-order"
              placeholder={t.consumer.inquiries.form.relatedOrderPlaceholder}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="inquiry-title">{t.consumer.inquiries.form.titleLabel}</Label>
          <Input id="inquiry-title" placeholder={t.consumer.inquiries.form.titlePlaceholder} />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="inquiry-content">{t.consumer.inquiries.form.contentLabel}</Label>
          <Textarea
            id="inquiry-content"
            rows={8}
            placeholder={t.consumer.inquiries.form.contentPlaceholder}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label>{t.consumer.inquiries.form.attachmentsLabel}</Label>
          <div className="flex items-center justify-between rounded-md border border-border bg-muted px-4 py-4">
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
              <Upload aria-hidden="true" className="size-4" />
              {t.consumer.inquiries.form.attachmentsHint}
            </span>
            <Button type="button" variant="outline" size="sm">
              {t.consumer.inquiries.form.chooseFileButton}
            </Button>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            render={<Link href={CONSUMER_ROUTES.INQUIRIES} />}
            nativeButton={false}
          >
            {t.consumer.inquiries.form.cancelButton}
          </Button>
          <Button
            render={<Link href={CONSUMER_ROUTES.INQUIRIES} />}
            nativeButton={false}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {t.consumer.inquiries.form.submitButton}
          </Button>
        </div>
      </div>
    </div>
  );
}
