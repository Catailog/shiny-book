'use client';

import { useTransition } from 'react';

import { Download } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { defaultLocale, locales } from '@/locales';

import { exportOrdersCsv } from './orders-csv-actions';

interface ExportOrdersCsvButtonProps {
  filterParam: string;
  searchFieldParam: string;
  query: string;
}

export function ExportOrdersCsvButton({
  filterParam,
  searchFieldParam,
  query,
}: ExportOrdersCsvButtonProps) {
  const t = locales[defaultLocale];
  const [isPending, startTransition] = useTransition();

  function handleExport() {
    startTransition(async () => {
      const result = await exportOrdersCsv(filterParam, searchFieldParam, query);
      if (result.error || result.csv === undefined) {
        toast.error(t.admin.orders.csv.exportError);
        return;
      }

      downloadCsv(result.csv);
    });
  }

  return (
    <Button type="button" variant="outline" size="sm" disabled={isPending} onClick={handleExport}>
      <Download aria-hidden="true" className="size-4" />
      {t.admin.orders.csv.exportButton}
    </Button>
  );
}

function downloadCsv(csv: string) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `orders-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
