'use client';

import type { ChangeEvent } from 'react';
import { useRef, useState, useTransition } from 'react';

import { toast } from 'sonner';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { FILE_UPLOAD_KIND, FILE_UPLOAD_RULES, STORAGE_BUCKETS } from '@/constants/file-upload';
import { useT } from '@/hooks/use-t';
import { createBrowserSupabaseClient } from '@/lib/supabase/browser-client';
import { createSignedUploadUrl } from '@/lib/uploads/create-signed-upload-url';

import { deleteProfileImage, updateProfileImage } from './actions';

interface AvatarUploadFormProps {
  avatarUrl: string | null;
  initials: string;
}

export function AvatarUploadForm({ avatarUrl, initials }: AvatarUploadFormProps) {
  const t = useT();
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState(avatarUrl);
  const [isPending, startTransition] = useTransition();
  const [isDeletePending, startDeleteTransition] = useTransition();

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) {
      return;
    }

    const rule = FILE_UPLOAD_RULES[FILE_UPLOAD_KIND.AVATAR];
    if (!rule.allowedMimeTypes.includes(file.type) || file.size > rule.maxSizeBytes) {
      toast.error(t.consumer.account.profileImage.errors.validation_failed);
      return;
    }

    startTransition(async () => {
      const signed = await createSignedUploadUrl({
        kind: FILE_UPLOAD_KIND.AVATAR,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
      });
      if (!signed.success) {
        toast.error(t.consumer.account.profileImage.errors.unexpected_error);
        return;
      }

      const supabase = createBrowserSupabaseClient();
      const { error } = await supabase.storage
        .from(STORAGE_BUCKETS.ORDER_UPLOADS)
        .uploadToSignedUrl(signed.path, signed.token, file);
      if (error) {
        toast.error(t.consumer.account.profileImage.errors.unexpected_error);
        return;
      }

      const result = await updateProfileImage(signed.path);
      if (result) {
        toast.error(t.consumer.account.profileImage.errors[result.errorCode]);
        return;
      }

      setPreviewUrl(URL.createObjectURL(file));
      toast.success(t.consumer.account.profileImage.updateSuccess);
    });
  }

  function handleDelete() {
    startDeleteTransition(async () => {
      const result = await deleteProfileImage();
      if (result) {
        toast.error(t.consumer.account.profileImage.errors[result.errorCode]);
        return;
      }

      setPreviewUrl(null);
      toast.success(t.consumer.account.profileImage.deleteSuccess);
    });
  }

  return (
    <div className="flex items-center gap-4">
      <Avatar size="lg">
        <AvatarImage src={previewUrl ?? undefined} alt="" />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-1">
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isPending}
            onClick={() => inputRef.current?.click()}
          >
            {isPending
              ? t.consumer.account.profileImage.uploading
              : t.consumer.account.profileImage.changeButton}
          </Button>
          {previewUrl ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isDeletePending}
              onClick={handleDelete}
            >
              {isDeletePending
                ? t.consumer.account.profileImage.deleting
                : t.consumer.account.profileImage.deleteButton}
            </Button>
          ) : null}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}
