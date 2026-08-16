import Link from 'next/link';

import { ArrowLeft } from 'lucide-react';

import { ADMIN_ROUTES } from '@/constants/routes';
import { getLocale } from '@/lib/i18n/get-locale';
import { locales } from '@/locales';

import { AdminTopbar } from '../../admin-topbar';
import { InquiryReplyPanel } from './inquiry-reply-panel';

export default async function AdminInquiryDetailPage(props: PageProps<'/admin/inquiries/[id]'>) {
  const { id } = await props.params;
  const locale = await getLocale();
  const t = locales[locale];

  return (
    <div className="flex flex-1 flex-col">
      <AdminTopbar
        title={`Inquiry #${id}`}
        subtitle="Customer inquiry regarding silver engraving options for Custom Wedding Album"
      />
      <div className="flex flex-1 flex-col gap-4 px-10 py-8">
        <Link
          href={ADMIN_ROUTES.INQUIRIES}
          className="flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft aria-hidden="true" className="size-3.5" />
          {t.admin.inquiries.detail.backToList}
        </Link>

        <div className="flex gap-6">
          <div className="flex w-105 shrink-0 flex-col gap-6">
            <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6">
              <h2 className="font-heading text-xl font-bold text-foreground">
                {t.admin.inquiries.detail.clientProfileTitle}
              </h2>
              <div className="flex items-center gap-3">
                <div className="size-12 rounded-full bg-muted" />
                <div className="flex flex-col">
                  <span className="text-base font-semibold text-foreground">
                    한지원 (Jiwon Han)
                  </span>
                  <span className="text-sm text-muted-foreground">jiwon.han@example.com</span>
                </div>
              </div>
              <div className="flex flex-col gap-2 border-t border-border pt-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    {t.admin.inquiries.detail.membershipLabel}
                  </span>
                  <span className="font-semibold text-foreground">Premium Wedding Club</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    {t.admin.inquiries.detail.totalSpentLabel}
                  </span>
                  <span className="font-semibold text-primary">₩370,000</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    {t.admin.inquiries.detail.openTicketsLabel}
                  </span>
                  <span className="font-semibold text-destructive">1 건</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6">
              <h2 className="font-heading text-xl font-bold text-foreground">
                {t.admin.inquiries.detail.contextTitle}
              </h2>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-muted-foreground">
                  {t.admin.inquiries.detail.subjectLabel}
                </span>
                <p className="font-semibold text-foreground">
                  실크 은박 맞춤 인그레이빙 폰트 질문입니다.
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-muted-foreground">
                  {t.admin.inquiries.detail.originalMessageLabel}
                </span>
                <p className="text-sm whitespace-pre-line text-muted-foreground">
                  {
                    '안녕하세요, 지난 주말에 Wedding Album 제품을 주문하였습니다. 커버 린넨 패브릭에 은박 인그레이빙(Silver Engraving) 각인을 선택했는데요.\n\n각인될 문구 폰트의 종류와 크기 조정이 별도로 가능한지 메일로 시안을 받아볼 수 있을까요? 인생의 가장 아름다운 기록인 만큼 폰트가 잘 어울렸으면 좋겠습니다.'
                  }
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold text-muted-foreground">
                  {t.admin.inquiries.detail.attachmentsLabel} (1)
                </span>
                <div className="flex items-center gap-3 rounded-md border border-border p-3">
                  <div className="size-10 shrink-0 rounded bg-muted" />
                  <div className="flex flex-1 flex-col">
                    <span className="text-sm font-semibold text-foreground">
                      wedding_sign_mock.jpg
                    </span>
                    <span className="text-xs text-muted-foreground">1.2 MB</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <InquiryReplyPanel />
        </div>
      </div>
    </div>
  );
}
