import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getAddressesByConsumer } from '@/lib/addresses/get-addresses-by-consumer';
import { getCurrentConsumer } from '@/lib/auth/get-current-consumer';
import { getLocale } from '@/lib/i18n/get-locale';
import { getSignedFileUrl } from '@/lib/uploads/get-signed-file-url';
import { locales } from '@/locales';

import { AddressManager } from './address-manager';
import { AvatarUploadForm } from './avatar-upload-form';
import { DeleteAccountButton } from './delete-account-button';
import { DisplayNameForm } from './display-name-form';
import { NotificationPreferencesForm } from './notification-form';
import { ChangePasswordForm } from './password-form';

export default async function MypageAccountPage() {
  const locale = await getLocale();
  const t = locales[locale];
  const consumer = await getCurrentConsumer();
  const addresses = consumer ? await getAddressesByConsumer(consumer.id) : [];
  const consumerName = consumer?.displayName ?? '';
  const consumerEmail = consumer?.email ?? '';
  const consumerPhone =
    typeof consumer?.user_metadata.phone === 'string' ? consumer.user_metadata.phone : '';
  const avatarPath =
    typeof consumer?.user_metadata.avatarPath === 'string'
      ? consumer.user_metadata.avatarPath
      : null;
  const avatarUrl = avatarPath ? await getSignedFileUrl(avatarPath) : null;
  const avatarInitials = (consumerName || consumerEmail).slice(0, 1).toUpperCase();
  const notificationDefaults = {
    marketingEmailConsent: consumer?.user_metadata.marketingEmailConsent === true,
    marketingSmsConsent: consumer?.user_metadata.marketingSmsConsent === true,
  };

  return (
    <div className="flex flex-1 flex-col gap-8 px-10 py-10">
      <h1 className="font-heading text-4xl font-bold text-foreground">
        {t.consumer.account.title}
      </h1>

      <section className="flex flex-col gap-4 border-b border-border pb-8">
        <h2 className="font-heading text-xl font-bold text-foreground">
          {t.consumer.account.personalInfo.title}
        </h2>
        <AvatarUploadForm avatarUrl={avatarUrl} initials={avatarInitials} />
        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="account-name"
                className="text-xs font-semibold tracking-wide uppercase"
              >
                {t.consumer.account.personalInfo.nameLabel}
              </Label>
              <DisplayNameForm currentName={consumerName} />
            </div>
            <Input id="account-name" defaultValue={consumerName} disabled />
          </div>
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="account-email"
              className="text-xs font-semibold tracking-wide uppercase"
            >
              {t.consumer.account.personalInfo.emailLabel}
            </Label>
            <Input id="account-email" defaultValue={consumerEmail} disabled />
          </div>
          {consumerPhone ? (
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="account-phone"
                className="text-xs font-semibold tracking-wide uppercase"
              >
                {t.consumer.account.personalInfo.phoneLabel}
              </Label>
              <Input id="account-phone" defaultValue={consumerPhone} disabled />
            </div>
          ) : null}
        </div>
      </section>

      <section className="flex flex-col gap-4 border-b border-border pb-8">
        <h2 className="font-heading text-xl font-bold text-foreground">
          {t.consumer.account.changePassword.title}
        </h2>
        <ChangePasswordForm />
      </section>

      <section className="flex flex-col gap-4 border-b border-border pb-8">
        <AddressManager addresses={addresses} defaultPhone={consumerPhone} />
      </section>

      <section className="flex flex-col gap-4 border-b border-border pb-8">
        <h2 className="font-heading text-xl font-bold text-foreground">
          {t.consumer.account.notifications.title}
        </h2>
        <NotificationPreferencesForm defaultValues={notificationDefaults} />
      </section>

      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {t.consumer.account.deleteAccount.prompt}
        </span>
        <DeleteAccountButton />
      </div>
    </div>
  );
}
