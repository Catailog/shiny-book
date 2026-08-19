'use server';

import { revalidatePath } from 'next/cache';

import { ADMIN_ROUTES } from '@/constants/routes';
import { getCurrentAdmin } from '@/lib/auth/get-current-admin';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

import { type CreateCouponInput, createCouponSchema } from './coupon-schema';

const UNIQUE_VIOLATION_CODE = '23505';

export interface CreateCouponResult {
  errorCode: 'unauthorized' | 'validation_failed' | 'code_taken' | 'unexpected_error';
}

export async function createCoupon(
  input: CreateCouponInput,
): Promise<CreateCouponResult | undefined> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return { errorCode: 'unauthorized' };
  }

  const parsed = createCouponSchema.safeParse(input);
  if (!parsed.success) {
    return { errorCode: 'validation_failed' };
  }

  const startsAt = parsed.data.startsAt ? new Date(parsed.data.startsAt) : null;
  if (startsAt && Number.isNaN(startsAt.getTime())) {
    return { errorCode: 'validation_failed' };
  }

  const expiresAt = parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : null;
  if (expiresAt && Number.isNaN(expiresAt.getTime())) {
    return { errorCode: 'validation_failed' };
  }

  const supabase = createServiceRoleClient();
  const { error } = await supabase.from('coupons').insert({
    code: parsed.data.code.trim().toUpperCase(),
    discount_type: parsed.data.discountType,
    discount_value: parsed.data.discountValue,
    max_uses: parsed.data.maxUses ?? null,
    starts_at: startsAt ? startsAt.toISOString() : null,
    expires_at: expiresAt ? expiresAt.toISOString() : null,
  });

  if (error) {
    return { errorCode: error.code === UNIQUE_VIOLATION_CODE ? 'code_taken' : 'unexpected_error' };
  }

  revalidatePath(ADMIN_ROUTES.COUPONS);
  return undefined;
}

export interface ToggleCouponState {
  error: 'unauthorized' | 'expired' | 'conflict' | null;
}

export async function toggleCouponActive(
  couponId: string,
  currentlyActive: boolean,
): Promise<ToggleCouponState> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return { error: 'unauthorized' };
  }

  const supabase = createServiceRoleClient();
  const { data: coupon } = await supabase
    .from('coupons')
    .select('expires_at')
    .eq('id', couponId)
    .maybeSingle();

  if (coupon?.expires_at && new Date(coupon.expires_at) <= new Date()) {
    return { error: 'expired' };
  }

  const { data } = await supabase
    .from('coupons')
    .update({ is_active: !currentlyActive })
    .eq('id', couponId)
    .eq('is_active', currentlyActive)
    .select()
    .maybeSingle();

  if (!data) {
    return { error: 'conflict' };
  }

  revalidatePath(ADMIN_ROUTES.COUPONS);
  return { error: null };
}
