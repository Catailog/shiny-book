'use server';

import { PHOTOBOOK_PAGE_COUNT_MAX, PHOTOBOOK_PHOTOS_PER_PAGE } from '@/constants/photobook';
import { getCurrentConsumer } from '@/lib/auth/get-current-consumer';
import { getRandomTestPhotoPath } from '@/lib/uploads/random-test-photo-path';

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

  const paths = Array.from({ length: count }, () => getRandomTestPhotoPath());

  return { success: true, paths };
}
