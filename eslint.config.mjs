import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import tailwindCanonicalClasses from 'eslint-plugin-tailwind-canonical-classes';
import { defineConfig, globalIgnores } from 'eslint/config';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  ...tailwindCanonicalClasses.configs['flat/recommended'],
  {
    rules: {
      'tailwind-canonical-classes/tailwind-canonical-classes': [
        'warn',
        {
          cssPath: './src/app/globals.css',
        },
      ],
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
