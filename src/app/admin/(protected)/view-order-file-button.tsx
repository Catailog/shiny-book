'use client';

import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { useT } from '@/hooks/use-t';
import { getSignedFileUrl } from '@/lib/uploads/get-signed-file-url';

interface ViewOrderFileButtonProps {
  path: string;
  label: string;
}

export function ViewOrderFileButton({ path, label }: ViewOrderFileButtonProps) {
  const t = useT();

  async function handleClick() {
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
    <Button type="button" variant="outline" size="sm" onClick={() => void handleClick()}>
      {label}
    </Button>
  );
}
