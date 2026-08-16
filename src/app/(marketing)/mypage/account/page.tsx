import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getLocale } from '@/lib/i18n/get-locale';
import { MOCK_CONSUMER } from '@/lib/mock/mock-accounts';
import { locales } from '@/locales';

export default async function MypageAccountPage() {
  const locale = await getLocale();
  const t = locales[locale];

  return (
    <div className="flex flex-1 flex-col gap-8 px-10 py-10">
      <h1 className="font-heading text-4xl font-bold text-foreground">
        {t.consumer.account.title}
      </h1>

      <section className="flex flex-col gap-4 border-b border-border pb-8">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-xl font-bold text-foreground">
            {t.consumer.account.personalInfo.title}
          </h2>
          <button type="button" className="text-sm font-semibold text-primary">
            {t.consumer.account.personalInfo.editLink}
          </button>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="account-name">{t.consumer.account.personalInfo.nameLabel}</Label>
            <Input id="account-name" defaultValue={MOCK_CONSUMER.name} readOnly />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="account-email">{t.consumer.account.personalInfo.emailLabel}</Label>
            <Input id="account-email" defaultValue={MOCK_CONSUMER.email} readOnly />
          </div>
        </div>
        <div className="w-80">
          <div className="flex flex-col gap-2">
            <Label htmlFor="account-phone">{t.consumer.account.personalInfo.phoneLabel}</Label>
            <Input id="account-phone" defaultValue="010-1234-5678" readOnly />
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4 border-b border-border pb-8">
        <h2 className="font-heading text-xl font-bold text-foreground">
          {t.consumer.account.changePassword.title}
        </h2>
        <div className="grid grid-cols-3 gap-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="current-password">
              {t.consumer.account.changePassword.currentPasswordLabel}
            </Label>
            <Input id="current-password" type="password" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="new-password">
              {t.consumer.account.changePassword.newPasswordLabel}
            </Label>
            <Input id="new-password" type="password" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="new-password-confirm">
              {t.consumer.account.changePassword.newPasswordConfirmLabel}
            </Label>
            <Input id="new-password-confirm" type="password" />
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4 border-b border-border pb-8">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-xl font-bold text-foreground">
            {t.consumer.account.shippingAddress.title}
          </h2>
          <button type="button" className="text-sm font-semibold text-primary">
            {t.consumer.account.shippingAddress.addButton}
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1 rounded-md border border-border bg-muted p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">
                {t.consumer.account.shippingAddress.defaultLabel} (우리집)
              </span>
              <span className="flex gap-3 text-xs">
                <button type="button" className="text-muted-foreground">
                  {t.consumer.account.shippingAddress.editLink}
                </button>
                <button type="button" className="text-destructive">
                  {t.consumer.account.shippingAddress.deleteLink}
                </button>
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              [06140] 서울특별시 강남구 테헤란로 123, 401호
            </p>
          </div>
          <div className="flex flex-col gap-1 rounded-md border border-border p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">회사</span>
              <span className="flex gap-3 text-xs">
                <button type="button" className="text-muted-foreground">
                  {t.consumer.account.shippingAddress.editLink}
                </button>
                <button type="button" className="text-destructive">
                  {t.consumer.account.shippingAddress.deleteLink}
                </button>
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              [04030] 서울특별시 마포구 어울림마당로 45, 2층
            </p>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4 border-b border-border pb-8">
        <h2 className="font-heading text-xl font-bold text-foreground">
          {t.consumer.account.notifications.title}
        </h2>
        <div className="flex gap-8">
          <div className="flex items-center gap-2">
            <Checkbox id="notify-email" defaultChecked />
            <Label htmlFor="notify-email" className="font-normal">
              {t.consumer.account.notifications.emailMarketing}
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="notify-sms" defaultChecked />
            <Label htmlFor="notify-sms" className="font-normal">
              {t.consumer.account.notifications.smsUpdates}
            </Label>
          </div>
        </div>
      </section>

      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {t.consumer.account.deleteAccount.prompt}
        </span>
        <button type="button" className="text-sm font-semibold text-destructive">
          {t.consumer.account.deleteAccount.button}
        </button>
      </div>
    </div>
  );
}
