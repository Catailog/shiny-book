import { redirect } from 'next/navigation';

import { LoginVisual } from '@/app/login/login-visual';
import { ROLE } from '@/constants/roles';
import { CONSUMER_ROUTES } from '@/constants/routes';
import { getMockSessionRole } from '@/lib/mock/mock-session';

import { SignupForm } from './signup-form';

export default async function SignupPage() {
  const role = await getMockSessionRole();
  if (role === ROLE.CONSUMER) {
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
