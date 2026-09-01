// Collect every string leaf of a nested locale object/array into newline-joined
// text, so a policy locale section can be dropped into the AI knowledge base.
export function flattenLocaleSection(value: unknown): string {
  if (typeof value === 'string') {
    return value;
  }

  if (Array.isArray(value)) {
    return value
      .map(flattenLocaleSection)
      .filter((part) => part.length > 0)
      .join('\n');
  }

  if (value !== null && typeof value === 'object') {
    return Object.values(value)
      .map(flattenLocaleSection)
      .filter((part) => part.length > 0)
      .join('\n');
  }

  return '';
}
