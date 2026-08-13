#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';

const PRETTIER_EXTS = [
  '.ts',
  '.tsx',
  '.js',
  '.jsx',
  '.mjs',
  '.cjs',
  '.mts',
  '.cts',
  '.json',
  '.css',
  '.md',
  '.mdx',
  '.yml',
  '.yaml',
];
const ESLINT_EXTS = ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.mts', '.cts'];

function run(cmd, args) {
  try {
    execFileSync(cmd, args, { stdio: 'ignore', shell: true });
  } catch {
    // best-effort formatter hook: never block on formatter/linter failures
  }
}

let raw = '';
process.stdin.on('data', (chunk) => (raw += chunk));
process.stdin.on('end', () => {
  let filePath;
  try {
    const input = JSON.parse(raw);
    filePath = input.tool_input?.file_path;
  } catch {
    return;
  }
  if (!filePath || !existsSync(filePath)) return;

  if (PRETTIER_EXTS.some((ext) => filePath.endsWith(ext))) {
    run('npx', ['prettier', '--write', filePath]);
  }
  if (ESLINT_EXTS.some((ext) => filePath.endsWith(ext))) {
    run('npx', ['eslint', '--fix', filePath]);
  }
});
