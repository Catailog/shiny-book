// Runs `worker` over `items` with at most `limit` promises in flight at once.
// Order of completion is not guaranteed; the returned promise resolves once every
// item has been processed. A worker that throws rejects the whole run, matching
// Promise.all semantics.
export async function runWithConcurrency<T>(
  items: readonly T[],
  limit: number,
  worker: (item: T, index: number) => Promise<void>,
): Promise<void> {
  const effectiveLimit = Math.max(1, Math.min(limit, items.length));
  let cursor = 0;

  async function runNext(): Promise<void> {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      await worker(items[index] as T, index);
    }
  }

  await Promise.all(Array.from({ length: effectiveLimit }, () => runNext()));
}
