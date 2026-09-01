import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import { defineConfig, globalIgnores } from 'eslint/config';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // Server code logs through `@/lib/log/logger`; `console.log`/`info`/`debug`
    // are almost always stray debugging. `warn`/`error` stay allowed for
    // client components that have no logger.
    rules: {
      'no-console': ['error', { allow: ['warn', 'error'] }],
    },
  },
  {
    // One-off CLI / maintenance scripts: `console` is the intended output.
    files: ['scripts/**'],
    rules: {
      'no-console': 'off',
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    // Supabase CLI local runtime state, not our code:
    'supabase/.temp/**',
    'supabase/.branches/**',
    // Verbatim reference dump, not our code:
    '.claude/.temp/design-sample/**',
    // Figma 포팅 작업을 위해 잠시 빼둔 옛 라우트, 나중에 다시 꺼내 씀:
    '_archive-old-app/**',
  ]),
]);

export default eslintConfig;
