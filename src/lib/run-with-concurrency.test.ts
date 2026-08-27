import { describe, expect, it } from 'vitest';

import { runWithConcurrency } from '@/lib/run-with-concurrency';

describe('runWithConcurrency', () => {
  it('processes every item exactly once', async () => {
    const seen: number[] = [];
    await runWithConcurrency([1, 2, 3, 4, 5], 2, async (item) => {
      seen.push(item);
    });
    expect(seen.sort((a, b) => a - b)).toEqual([1, 2, 3, 4, 5]);
  });

  it('never runs more than `limit` workers at once', async () => {
    let inFlight = 0;
    let peak = 0;
    const items = Array.from({ length: 20 }, (_, i) => i);

    await runWithConcurrency(items, 3, async () => {
      inFlight += 1;
      peak = Math.max(peak, inFlight);
      await new Promise((resolve) => setTimeout(resolve, 5));
      inFlight -= 1;
    });

    expect(peak).toBeLessThanOrEqual(3);
  });

  it('passes the item index to the worker', async () => {
    const pairs: Array<[string, number]> = [];
    await runWithConcurrency(['a', 'b', 'c'], 5, async (item, index) => {
      pairs.push([item, index]);
    });
    expect(pairs.sort((a, b) => a[1] - b[1])).toEqual([
      ['a', 0],
      ['b', 1],
      ['c', 2],
    ]);
  });

  it('rejects if a worker throws', async () => {
    await expect(
      runWithConcurrency([1, 2, 3], 2, async (item) => {
        if (item === 2) {
          throw new Error('boom');
        }
      }),
    ).rejects.toThrow('boom');
  });

  it('handles an empty list', async () => {
    await expect(runWithConcurrency([], 4, async () => {})).resolves.toBeUndefined();
  });
});
