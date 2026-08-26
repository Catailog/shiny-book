import { toast } from 'sonner';

// A message important enough that it shouldn't auto-dismiss - the viewer has to close
// it themselves via the close button. Use sparingly; most feedback should stay on the
// regular toast.* calls, which auto-dismiss after TOAST_DURATION_MS.
export const toastImportant = {
  error: (message: string) => toast.error(message, { duration: Infinity, closeButton: true }),
  warning: (message: string) => toast.warning(message, { duration: Infinity, closeButton: true }),
  info: (message: string) => toast.info(message, { duration: Infinity, closeButton: true }),
  success: (message: string) => toast.success(message, { duration: Infinity, closeButton: true }),
};
