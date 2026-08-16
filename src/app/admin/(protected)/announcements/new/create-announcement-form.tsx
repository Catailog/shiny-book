'use client';

import Link from 'next/link';

import {
  Bold,
  Image as ImageIcon,
  Italic,
  Link as LinkIcon,
  List,
  Underline,
  Upload,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { useT } from '@/hooks/use-t';

interface CreateAnnouncementFormProps {
  cancelHref: string;
}

const TOOLBAR_ICONS = [Bold, Italic, Underline, List, LinkIcon, ImageIcon];

export function CreateAnnouncementForm({ cancelHref }: CreateAnnouncementFormProps) {
  const t = useT();

  return (
    <>
      <div className="flex-1 rounded-lg border border-border bg-card p-8">
        <h2 className="mb-6 font-heading text-xl font-bold text-foreground">
          {t.admin.announcements.create.compositionTitle}
        </h2>
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="announcement-title">{t.admin.announcements.create.titleLabel}</Label>
              <Input id="announcement-title" defaultValue="추석 연휴 배송 일정 및 고사 휴무 안내" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="announcement-category">
                {t.admin.announcements.create.categoryLabel}
              </Label>
              <Input id="announcement-category" defaultValue="Service" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex flex-col rounded-md border border-border">
              <div className="flex items-center gap-4 border-b border-border bg-muted px-3 py-2">
                {TOOLBAR_ICONS.map((Icon, index) => (
                  <Icon key={index} aria-hidden="true" className="size-3.5 text-muted-foreground" />
                ))}
              </div>
              <div className="flex flex-col gap-3 p-4 text-sm text-foreground">
                <p className="font-semibold">안녕하세요. 북크래프트 스튜디오입니다.</p>
                <p className="text-muted-foreground">
                  올해 추석 한가위 연휴 동안의 제작 일정 및 배송 마감 시간을 안내 드립니다. 주문 전
                  일정 착오 없으시길 바랍니다.
                </p>
                <p className="text-muted-foreground">
                  • 연휴 배송 마감: 2025년 9월 25일 (수) 오후 6시 이전 결제 건 한정 당일 발송.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center gap-2 rounded-md border border-border bg-muted px-4 py-6">
            <Upload aria-hidden="true" className="size-4.5 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {t.admin.announcements.create.attachmentsHint}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Switch id="pin-announcement" defaultChecked />
              <Label htmlFor="pin-announcement" className="font-normal">
                {t.admin.announcements.create.pinLabel}
              </Label>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" render={<Link href={cancelHref} />} nativeButton={false}>
                {t.admin.announcements.create.saveDraftButton}
              </Button>
              <Button render={<Link href={cancelHref} />} nativeButton={false}>
                {t.admin.announcements.create.publishButton}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex w-100 shrink-0 flex-col gap-3 rounded-lg border border-border bg-card p-6">
        <span className="text-xs font-bold text-muted-foreground">
          {t.admin.announcements.create.publishingOptionsTitle}
        </span>
        <RadioGroup defaultValue="immediately" className="flex flex-col gap-4">
          <div className="flex items-start gap-3 rounded-md border border-primary bg-primary-soft p-3">
            <RadioGroupItem value="immediately" id="publish-immediately" className="mt-0.5" />
            <Label htmlFor="publish-immediately" className="flex flex-col items-start gap-0.5">
              <span className="text-sm font-semibold text-foreground">
                {t.admin.announcements.create.publishImmediately}
              </span>
              <span className="text-xs font-normal text-muted-foreground">
                {t.admin.announcements.create.publishImmediatelyHint}
              </span>
            </Label>
          </div>
          <div className="flex items-start gap-3 p-3">
            <RadioGroupItem value="scheduled" id="publish-scheduled" className="mt-0.5" />
            <Label htmlFor="publish-scheduled" className="flex flex-col items-start gap-0.5">
              <span className="text-sm text-foreground">
                {t.admin.announcements.create.schedulePublication}
              </span>
              <span className="text-xs font-normal text-muted-foreground">
                {t.admin.announcements.create.schedulePublicationHint}
              </span>
            </Label>
          </div>
        </RadioGroup>
      </div>
    </>
  );
}
