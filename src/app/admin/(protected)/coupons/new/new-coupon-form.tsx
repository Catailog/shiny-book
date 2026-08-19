'use client';

import { useRouter } from 'next/navigation';

import { ADMIN_ROUTES } from '@/constants/routes';

import { CouponForm } from '../coupon-form';

export function NewCouponForm() {
  const router = useRouter();

  return <CouponForm onSuccess={() => router.push(ADMIN_ROUTES.COUPONS)} />;
}
