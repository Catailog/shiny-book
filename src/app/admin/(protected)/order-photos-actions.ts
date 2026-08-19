'use server';

import { SIGNED_FILE_URL_EXPIRY_SECONDS, STORAGE_BUCKETS } from '@/constants/file-upload';
import { getCurrentAdmin } from '@/lib/auth/get-current-admin';
import { getOrderPhotosByOrder } from '@/lib/order-photos/get-order-photos-by-order';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

export interface OrderPhotoUrl {
  id: string;
  url: string;
}

export interface GetOrderPhotoUrlsResult {
  errorCode?: 'unauthorized' | 'unexpected_error';
  photos?: OrderPhotoUrl[];
}

export async function getOrderPhotoUrls(orderId: string): Promise<GetOrderPhotoUrlsResult> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return { errorCode: 'unauthorized' };
  }

  const photos = await getOrderPhotosByOrder(orderId);
  const supabase = createServiceRoleClient();

  const urls = await Promise.all(
    photos.map(async (photo) => {
      const { data } = await supabase.storage
        .from(STORAGE_BUCKETS.ORDER_UPLOADS)
        .createSignedUrl(photo.storage_path, SIGNED_FILE_URL_EXPIRY_SECONDS);

      return data ? { id: photo.id, url: data.signedUrl } : null;
    }),
  );

  return { photos: urls.filter((url): url is OrderPhotoUrl => url !== null) };
}
