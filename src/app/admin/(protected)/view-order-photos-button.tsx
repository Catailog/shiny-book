'use client';

import { useState, useTransition } from 'react';

import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { defaultLocale, locales } from '@/locales';

import { type OrderPhotoUrl, getOrderPhotoUrls } from './order-photos-actions';

interface ViewOrderPhotosButtonProps {
  orderId: string;
}

export function ViewOrderPhotosButton({ orderId }: ViewOrderPhotosButtonProps) {
  const t = locales[defaultLocale];
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [photos, setPhotos] = useState<OrderPhotoUrl[] | null>(null);

  function handleOpenChange(open: boolean) {
    setIsOpen(open);
    if (open && photos === null) {
      startTransition(async () => {
        const result = await getOrderPhotoUrls(orderId);
        if (result.errorCode) {
          toast.error(t.admin.orders.fileViewError);
          setPhotos([]);
          return;
        }

        setPhotos(result.photos ?? []);
      });
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <Button type="button" variant="outline" size="sm" onClick={() => handleOpenChange(true)}>
        {t.admin.orders.viewPhotosButton}
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t.admin.orders.viewPhotosButton}</DialogTitle>
        </DialogHeader>
        {isPending ? (
          <p className="text-sm text-muted-foreground">{t.admin.orders.photosLoading}</p>
        ) : photos && photos.length > 0 ? (
          <div className="grid grid-cols-4 gap-3">
            {photos.map((photo) => (
              <a
                key={photo.id}
                href={photo.url}
                target="_blank"
                rel="noreferrer"
                className="relative aspect-square overflow-hidden rounded-md border border-border"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo.url} alt="" className="size-full object-cover" />
              </a>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">{t.admin.orders.photosEmpty}</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
