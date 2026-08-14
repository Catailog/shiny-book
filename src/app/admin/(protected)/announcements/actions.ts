'use server';

import { revalidatePath } from 'next/cache';

import { ADMIN_ROUTES } from '@/constants/routes';
import { getCurrentAdmin } from '@/lib/auth/get-current-admin';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

import { type AnnouncementFormInput, announcementFormSchema } from './announcement-schema';

export interface AnnouncementActionResult {
  errorCode: 'unauthorized' | 'validation_failed' | 'unexpected_error';
}

export async function createAnnouncement(
  input: AnnouncementFormInput,
): Promise<AnnouncementActionResult | undefined> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return { errorCode: 'unauthorized' };
  }

  const parsed = announcementFormSchema.safeParse(input);
  if (!parsed.success) {
    return { errorCode: 'validation_failed' };
  }

  const supabase = createServiceRoleClient();
  const { error } = await supabase.from('announcements').insert({
    title: parsed.data.title,
    content: parsed.data.content,
  });

  if (error) {
    return { errorCode: 'unexpected_error' };
  }

  revalidatePath(ADMIN_ROUTES.ANNOUNCEMENTS);
  return undefined;
}

export async function updateAnnouncement(
  id: string,
  input: AnnouncementFormInput,
): Promise<AnnouncementActionResult | undefined> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return { errorCode: 'unauthorized' };
  }

  const parsed = announcementFormSchema.safeParse(input);
  if (!parsed.success) {
    return { errorCode: 'validation_failed' };
  }

  const supabase = createServiceRoleClient();
  const { error } = await supabase
    .from('announcements')
    .update({
      title: parsed.data.title,
      content: parsed.data.content,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) {
    return { errorCode: 'unexpected_error' };
  }

  revalidatePath(ADMIN_ROUTES.ANNOUNCEMENTS);
  return undefined;
}
