export const SHIPMENT_JOB_STATUS = {
  RECEIVED: 'received',
  IN_TRANSIT: 'in_transit',
  DELIVERED: 'delivered',
} as const;

export type ShipmentJobStatus = (typeof SHIPMENT_JOB_STATUS)[keyof typeof SHIPMENT_JOB_STATUS];

const SHIPMENT_JOB_STATUS_VALUES: readonly ShipmentJobStatus[] = Object.values(SHIPMENT_JOB_STATUS);

export function isShipmentJobStatus(value: string): value is ShipmentJobStatus {
  return SHIPMENT_JOB_STATUS_VALUES.some((status) => status === value);
}
