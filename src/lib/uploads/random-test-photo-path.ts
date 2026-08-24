import { TEST_PHOTO_POOL } from '@/constants/file-upload';

export function getRandomTestPhotoPath(): string {
  const index = Math.floor(Math.random() * TEST_PHOTO_POOL.SIZE) + 1;
  return `${TEST_PHOTO_POOL.PREFIX}image_${index}.jpg`;
}
