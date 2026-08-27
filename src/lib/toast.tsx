import { toast } from 'sonner';

import { ImportantToastIcon } from '@/components/important-toast-icon';

const IMPORTANT_OPTIONS = { duration: Infinity, closeButton: true } as const;

// A message important enough that it shouldn't auto-dismiss - the viewer has to close
// it themselves via the close button, and it carries a labelled icon so it reads as
// more than a passing toast. Use sparingly; most feedback should stay on the regular
// toast.* calls, which auto-dismiss after TOAST_DURATION_MS. `label` is the localized
// "important" caption, passed in by the caller since this module has no locale context.
export const toastImportant = {
  error: (message: string, label: string) =>
    toast.error(message, {
      ...IMPORTANT_OPTIONS,
      icon: <ImportantToastIcon variant="error" label={label} />,
    }),
  warning: (message: string, label: string) =>
    toast.warning(message, {
      ...IMPORTANT_OPTIONS,
      icon: <ImportantToastIcon variant="warning" label={label} />,
    }),
  info: (message: string, label: string) =>
    toast.info(message, {
      ...IMPORTANT_OPTIONS,
      icon: <ImportantToastIcon variant="info" label={label} />,
    }),
  success: (message: string, label: string) =>
    toast.success(message, {
      ...IMPORTANT_OPTIONS,
      icon: <ImportantToastIcon variant="success" label={label} />,
    }),
};
