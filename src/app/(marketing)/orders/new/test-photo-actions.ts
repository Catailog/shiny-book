'use server';

import {
  FILE_UPLOAD_KIND,
  STORAGE_BUCKETS,
  TEST_PHOTO_TEMPLATE_PATH,
} from '@/constants/file-upload';
import { PHOTOBOOK_PAGE_COUNT_MAX, PHOTOBOOK_PHOTOS_PER_PAGE } from '@/constants/photobook';
import { getCurrentConsumer } from '@/lib/auth/get-current-consumer';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

export interface GenerateTestPhotosResult {
  success: boolean;
  paths: string[];
}

const MAX_TEST_PHOTO_COUNT = PHOTOBOOK_PAGE_COUNT_MAX * PHOTOBOOK_PHOTOS_PER_PAGE;

export async function generateTestPhotos(count: number): Promise<GenerateTestPhotosResult> {
  if (!Number.isInteger(count) || count <= 0 || count > MAX_TEST_PHOTO_COUNT) {
    return { success: false, paths: [] };
  }

  const consumer = await getCurrentConsumer();
  if (!consumer) {
    return { success: false, paths: [] };
  }

  const supabase = createServiceRoleClient();
  const paths: string[] = [];

  for (let index = 0; index < count; index += 1) {
    const destinationPath = `${consumer.id}/${FILE_UPLOAD_KIND.PHOTO}/processed-test-${crypto.randomUUID()}.webp`;
    const { error } = await supabase.storage
      .from(STORAGE_BUCKETS.ORDER_UPLOADS)
      .copy(TEST_PHOTO_TEMPLATE_PATH, destinationPath);

    if (error) {
      return { success: false, paths: [] };
    }

    paths.push(destinationPath);
  }

  return { success: true, paths };
}
