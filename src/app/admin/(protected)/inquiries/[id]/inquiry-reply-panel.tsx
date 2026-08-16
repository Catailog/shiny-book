'use client';

import { useState } from 'react';

import {
  Bold,
  Image as ImageIcon,
  Italic,
  Link as LinkIcon,
  Paperclip,
  Send,
  Underline,
  User,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useT } from '@/hooks/use-t';

const TOOLBAR_ICONS = [Bold, Italic, Underline, LinkIcon, ImageIcon];

const DEFAULT_REPLY =
  '안녕하세요 한지원 고객님, 평생을 간직할 웨딩 앨범의 아름다운 기록을 남기기 위해 인그레이빙 옵션 폰트 문의를 주셨군요.\n\n현재 실버 전용 서체로 가장 인기가 높은 필기체 스타일 3종과 정통 로만 서체 2종의 가이드 시안 파일(PDF)을 준비해 동봉해 드립니다. 확인해보시고 원하시는 타입 번호와 문구를 답장해 주시면 즉시 맞춤 디자인 작업에 착수하겠습니다.';

export function InquiryReplyPanel() {
  const t = useT();
  const [replyTab, setReplyTab] = useState<'public' | 'internal'>('public');
  const [reply, setReply] = useState(DEFAULT_REPLY);

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex flex-col gap-5 rounded-lg border border-border bg-card p-6">
        <h2 className="font-heading text-2xl font-bold text-foreground">
          {t.admin.inquiries.detail.conversationTitle}
        </h2>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-bold text-foreground">
              한지원{' '}
              <span className="font-normal text-muted-foreground">
                {t.admin.inquiries.detail.customerLabel}
              </span>
            </span>
            <span className="text-xs text-muted-foreground">10 min ago</span>
          </div>
          <div className="rounded-md bg-muted p-4 text-sm text-foreground">
            안녕하세요, 실크 은박 맞춤 인그레이빙 폰트 종류와 크기 조정을 직접 볼 수 있는 방법이
            따로 없을까요?
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 font-bold text-primary">
              Master Artisan
              <span className="rounded bg-primary-soft px-2 py-0.5 text-[10px] font-semibold text-primary">
                {t.admin.inquiries.detail.internalNoteLabel}
              </span>
            </span>
            <span className="text-xs text-muted-foreground">5 min ago</span>
          </div>
          <div className="rounded-xl border border-border bg-primary-soft p-4 text-sm text-foreground">
            어제 기획팀과 정리한 웨딩 전용 실버 스페셜 각인 서체 템플릿
            파일(wedding_silver_font_set_2025)을 찾아서 첨부해 답변할 것.
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              variant={replyTab === 'public' ? 'default' : 'secondary'}
              onClick={() => setReplyTab('public')}
            >
              {t.admin.inquiries.detail.publicReplyTab}
            </Button>
            <Button
              type="button"
              size="sm"
              variant={replyTab === 'internal' ? 'default' : 'secondary'}
              onClick={() => setReplyTab('internal')}
            >
              {t.admin.inquiries.detail.internalNoteTab}
            </Button>
          </div>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <User aria-hidden="true" className="size-3.5" />
            {t.admin.inquiries.detail.toLabel}: Han Jiwon (jiwon.han@example.com)
          </span>
        </div>

        <div className="flex flex-col rounded-md border border-border">
          <div className="flex items-center gap-4 border-b border-border bg-muted px-3 py-2">
            {TOOLBAR_ICONS.map((Icon, index) => (
              <Icon key={index} aria-hidden="true" className="size-3.5 text-muted-foreground" />
            ))}
          </div>
          <Textarea
            value={reply}
            onChange={(event) => setReply(event.target.value)}
            rows={7}
            className="rounded-t-none border-none bg-input-background focus-visible:ring-0"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button type="button" variant="secondary" size="sm">
              <Paperclip aria-hidden="true" className="size-3.5" />
              {t.admin.inquiries.detail.attachFileButton}
            </Button>
            <span className="text-xs text-muted-foreground">
              silver_engraving_guide.pdf (2.4 MB)
            </span>
          </div>
          <div className="flex gap-3">
            <Button type="button" variant="outline">
              {t.admin.inquiries.detail.closeInquiryButton}
            </Button>
            <Button
              type="button"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {t.admin.inquiries.detail.sendReplyButton}
              <Send aria-hidden="true" className="size-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
