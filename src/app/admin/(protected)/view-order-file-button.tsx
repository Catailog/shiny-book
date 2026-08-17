'use client';

import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { getSignedFileUrl } from '@/lib/uploads/get-signed-file-url';
import { defaultLocale, locales } from '@/locales';

interface ViewOrderFileButtonProps {
  path: string | null;
  label: string;
}

export function ViewOrderFileButton({ path, label }: ViewOrderFileButtonProps) {
  const t = locales[defaultLocale];

  async function handleClick() {
    if (!path) {
      return;
    }

    const newTab = window.open('', '_blank');
    const result = await getSignedFileUrl(path);

    if (!result.success) {
      newTab?.close();
      toast.error(t.admin.orders.fileViewError);
      return;
    }

    if (newTab) {
      newTab.location.href = result.url;
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={!path}
      onClick={() => void handleClick()}
    >
      {label}
    </Button>
  );
}
