export function pick<T>(items: readonly T[]): T {
  const item = items[Math.floor(Math.random() * items.length)];
  if (item === undefined) {
    throw new Error('pick() called with an empty array');
  }
  return item;
}

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function sampleUnique<T>(items: readonly T[], count: number): T[] {
  const pool = [...items];
  const result: T[] = [];

  for (let i = 0; i < count && pool.length > 0; i++) {
    const index = Math.floor(Math.random() * pool.length);
    const [picked] = pool.splice(index, 1);
    if (picked !== undefined) {
      result.push(picked);
    }
  }

  return result;
}
