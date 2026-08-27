import { ID_DISPLAY_PREFIX_LENGTH } from '@/constants/id-display';

export function formatIdPrefix(id: string): string {
  return `#${id.slice(0, ID_DISPLAY_PREFIX_LENGTH)}`;
}
