import { redirect } from 'next/navigation';

import { LoginVisual } from '@/app/login/login-visual';
import { SimpleHeader } from '@/components/simple-header';
import { CONSUMER_ROUTES } from '@/constants/routes';
import { getCurrentConsumer } from '@/lib/auth/get-current-consumer';
import { isSafeRedirectPath } from '@/lib/auth/is-safe-redirect-path';

import { SignupForm } from './signup-form';

export default async function SignupPage(props: PageProps<'/signup'>) {
  const { redirectTo } = await props.searchParams;
  const destination =
    typeof redirectTo === 'string' && isSafeRedirectPath(redirectTo)
      ? redirectTo
      : CONSUMER_ROUTES.MYPAGE;

  const consumer = await getCurrentConsumer();
  if (consumer) {
    redirect(destination);
  }

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <div className="lg:hidden">
        <SimpleHeader />
      </div>
      <div className="flex flex-1 flex-col bg-background lg:flex-row">
        <LoginVisual />
        <div className="flex flex-1 items-center justify-center p-8 sm:p-12 xl:p-16">
          <SignupForm redirectTo={destination} />
        </div>
      </div>
    </div>
  );
}
