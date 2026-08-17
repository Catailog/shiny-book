import { redirect } from 'next/navigation';

import { LoginVisual } from '@/app/login/login-visual';
import { CONSUMER_ROUTES } from '@/constants/routes';
import { getCurrentConsumer } from '@/lib/auth/get-current-consumer';

import { SignupForm } from './signup-form';

export default async function SignupPage() {
  const consumer = await getCurrentConsumer();
  if (consumer) {
    redirect(CONSUMER_ROUTES.MYPAGE);
  }

  return (
    <div className="flex min-h-full flex-1 flex-col bg-background lg:flex-row">
      <LoginVisual />
      <div className="flex flex-1 items-center justify-center p-8 sm:p-12 xl:p-16">
        <SignupForm />
      </div>
    </div>
  );
}
