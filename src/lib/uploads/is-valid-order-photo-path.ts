import { FILE_UPLOAD_KIND, TEST_PHOTO_POOL } from '@/constants/file-upload';

const TEST_PHOTO_POOL_PATH_PATTERN = new RegExp(`^${TEST_PHOTO_POOL.PREFIX}image_\\d+\\.jpg$`);

export function isValidOrderPhotoPath(path: string, consumerId: string): boolean {
  if (path.includes('..')) {
    return false;
  }

  const isOwnPhoto = path.startsWith(`${consumerId}/${FILE_UPLOAD_KIND.PHOTO}/`);
  const isTestPoolPhoto = TEST_PHOTO_POOL_PATH_PATTERN.test(path);

  return isOwnPhoto || isTestPoolPhoto;
}
