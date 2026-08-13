#!/usr/bin/env node
import { spawnSync } from 'node:child_process';

const result = spawnSync('npm', ['run', 'type-check'], {
  shell: true,
  encoding: 'utf-8',
});

if (result.status !== 0) {
  const output = `${result.stdout ?? ''}${result.stderr ?? ''}`.trim();
  process.stdout.write(
    JSON.stringify({
      decision: 'block',
      reason: `npm run type-check failed:\n\n${output}`,
    }),
  );
}
