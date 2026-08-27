'use server';

import { FILE_UPLOAD_KIND, STORAGE_BUCKETS } from '@/constants/file-upload';
import { getCurrentConsumer } from '@/lib/auth/get-current-consumer';
import { createServerSupabaseClient } from '@/lib/supabase/server-client';
import { buildUploadPath } from '@/lib/uploads/build-upload-path';
import {
  type OrderPhotoUploadTicketsRequest,
  orderPhotoUploadTicketsRequestSchema,
} from '@/schemas/file-upload';

export interface OrderPhotoUploadTicket {
  path: string;
  token: string;
}

interface CreateOrderPhotoUploadTicketsSuccess {
  success: true;
  // Same order as the request. `null` for a file whose signed URL could not be minted.
  tickets: (OrderPhotoUploadTicket | null)[];
}

interface CreateOrderPhotoUploadTicketsFailure {
  success: false;
  errorCode: 'unauthorized' | 'validation_failed' | 'unexpected_error';
}

export type CreateOrderPhotoUploadTicketsResult =
  CreateOrderPhotoUploadTicketsSuccess | CreateOrderPhotoUploadTicketsFailure;

// Mints one signed upload URL per file in a single Server Action call, so uploading a
// full photobook costs one round trip here instead of one per photo (Next.js runs
// Server Actions sequentially and the proxy rate-limits them). The file bytes are still
// uploaded straight from the client to Supabase Storage with the returned tickets.
export async function createOrderPhotoUploadTickets(
  input: OrderPhotoUploadTicketsRequest,
): Promise<CreateOrderPhotoUploadTicketsResult> {
  try {
    const consumer = await getCurrentConsumer();
    if (!consumer) {
      return { success: false, errorCode: 'unauthorized' };
    }

    const parsed = orderPhotoUploadTicketsRequestSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, errorCode: 'validation_failed' };
    }

    const supabase = await createServerSupabaseClient();

    const tickets = await Promise.all(
      parsed.data.map(async (file) => {
        const path = buildUploadPath(consumer.id, FILE_UPLOAD_KIND.PHOTO, file.fileType);
        const { data, error } = await supabase.storage
          .from(STORAGE_BUCKETS.ORDER_UPLOADS)
          .createSignedUploadUrl(path);

        if (error || !data) {
          return null;
        }

        return { path: data.path, token: data.token };
      }),
    );

    return { success: true, tickets };
  } catch {
    return { success: false, errorCode: 'unexpected_error' };
  }
}
