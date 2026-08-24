'use server';

import { PHOTOBOOK_PAGE_COUNT_MAX, PHOTOBOOK_PHOTOS_PER_PAGE } from '@/constants/photobook';
import { getCurrentConsumer } from '@/lib/auth/get-current-consumer';
import { getSignedOrderPhotoUrl } from '@/lib/uploads/get-signed-order-photo-url';
import { getRandomTestPhotoPath } from '@/lib/uploads/random-test-photo-path';

export interface GeneratedTestPhoto {
  path: string;
  previewUrl: string | null;
}

export interface GenerateTestPhotosResult {
  success: boolean;
  photos: GeneratedTestPhoto[];
}

const MAX_TEST_PHOTO_COUNT = PHOTOBOOK_PAGE_COUNT_MAX * PHOTOBOOK_PHOTOS_PER_PAGE;

export async function generateTestPhotos(count: number): Promise<GenerateTestPhotosResult> {
  if (!Number.isInteger(count) || count <= 0 || count > MAX_TEST_PHOTO_COUNT) {
    return { success: false, photos: [] };
  }

  const consumer = await getCurrentConsumer();
  if (!consumer) {
    return { success: false, photos: [] };
  }

  const paths = Array.from({ length: count }, () => getRandomTestPhotoPath());

  const photos = await Promise.all(
    paths.map(async (path) => ({ path, previewUrl: await getSignedOrderPhotoUrl(path) })),
  );

  return { success: true, photos };
}
