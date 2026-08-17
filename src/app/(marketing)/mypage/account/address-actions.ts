'use server';

import { revalidatePath } from 'next/cache';

import { CONSUMER_ROUTES } from '@/constants/routes';
import { getCurrentConsumer } from '@/lib/auth/get-current-consumer';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

import { type AddressFormInput, addressFormSchema } from './address-schema';

export interface AddressActionResult {
  errorCode: 'unauthorized' | 'validation_failed' | 'not_found' | 'unexpected_error';
}

async function clearDefaultAddress(consumerId: string): Promise<void> {
  const supabase = createServiceRoleClient();
  await supabase
    .from('addresses')
    .update({ is_default: false })
    .eq('consumer_id', consumerId)
    .eq('is_default', true);
}

export async function createAddress(
  input: AddressFormInput,
): Promise<AddressActionResult | undefined> {
  const consumer = await getCurrentConsumer();
  if (!consumer) {
    return { errorCode: 'unauthorized' };
  }

  const parsed = addressFormSchema.safeParse(input);
  if (!parsed.success) {
    return { errorCode: 'validation_failed' };
  }

  if (parsed.data.isDefault) {
    await clearDefaultAddress(consumer.id);
  }

  const supabase = createServiceRoleClient();
  const { error } = await supabase.from('addresses').insert({
    consumer_id: consumer.id,
    label: parsed.data.label,
    recipient_name: parsed.data.recipientName,
    phone: parsed.data.phone,
    postal_code: parsed.data.postalCode,
    address_line1: parsed.data.addressLine1,
    address_line2: parsed.data.addressLine2 || null,
    is_default: parsed.data.isDefault,
  });

  if (error) {
    return { errorCode: 'unexpected_error' };
  }

  revalidatePath(CONSUMER_ROUTES.ACCOUNT);
  return undefined;
}

export async function updateAddress(
  id: string,
  input: AddressFormInput,
): Promise<AddressActionResult | undefined> {
  const consumer = await getCurrentConsumer();
  if (!consumer) {
    return { errorCode: 'unauthorized' };
  }

  const parsed = addressFormSchema.safeParse(input);
  if (!parsed.success) {
    return { errorCode: 'validation_failed' };
  }

  const supabase = createServiceRoleClient();
  const { data: existing } = await supabase
    .from('addresses')
    .select('consumer_id')
    .eq('id', id)
    .maybeSingle();

  if (!existing || existing.consumer_id !== consumer.id) {
    return { errorCode: 'not_found' };
  }

  if (parsed.data.isDefault) {
    await clearDefaultAddress(consumer.id);
  }

  const { error } = await supabase
    .from('addresses')
    .update({
      label: parsed.data.label,
      recipient_name: parsed.data.recipientName,
      phone: parsed.data.phone,
      postal_code: parsed.data.postalCode,
      address_line1: parsed.data.addressLine1,
      address_line2: parsed.data.addressLine2 || null,
      is_default: parsed.data.isDefault,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) {
    return { errorCode: 'unexpected_error' };
  }

  revalidatePath(CONSUMER_ROUTES.ACCOUNT);
  return undefined;
}

export async function deleteAddress(id: string): Promise<AddressActionResult | undefined> {
  const consumer = await getCurrentConsumer();
  if (!consumer) {
    return { errorCode: 'unauthorized' };
  }

  const supabase = createServiceRoleClient();
  const { data: existing } = await supabase
    .from('addresses')
    .select('consumer_id')
    .eq('id', id)
    .maybeSingle();

  if (!existing || existing.consumer_id !== consumer.id) {
    return { errorCode: 'not_found' };
  }

  const { error } = await supabase.from('addresses').delete().eq('id', id);
  if (error) {
    return { errorCode: 'unexpected_error' };
  }

  revalidatePath(CONSUMER_ROUTES.ACCOUNT);
  return undefined;
}
