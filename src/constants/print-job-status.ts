export const PRINT_JOB_STATUS = {
  RECEIVED: 'received',
  PRINTING: 'printing',
  DONE: 'done',
} as const;

export type PrintJobStatus = (typeof PRINT_JOB_STATUS)[keyof typeof PRINT_JOB_STATUS];

const PRINT_JOB_STATUS_VALUES: readonly PrintJobStatus[] = Object.values(PRINT_JOB_STATUS);

export function isPrintJobStatus(value: string): value is PrintJobStatus {
  return PRINT_JOB_STATUS_VALUES.some((status) => status === value);
}
