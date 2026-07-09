import js from '@eslint/js';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import importPlugin from 'eslint-plugin-import';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default [
  {
    ignores: [
      '**/node_modules/**',
      'coverage/**',
      'dist/**',
      '*.log',
      'logs/**',
      '.eslintcache',
      '**/*.eslintrc.cjs',
      '**/jest.config.cjs',
    ],
  },
  js.configs.recommended,
  ...tsPlugin.configs['flat/recommended'],
  reactPlugin.configs.flat.recommended,
  reactPlugin.configs.flat['jsx-runtime'],
  jsxA11y.flatConfigs.recommended,
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.typescript,
  reactHooks.configs.flat.recommended,
  prettierConfig,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parser: tsParser,
    },
    plugins: {
      'react-refresh': reactRefresh,
      prettier: prettierPlugin,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      'prettier/prettier': 'error',
      // This project has no separate resolver installed (e.g.
      // eslint-import-resolver-typescript) - `tsc` already catches
      // unresolved imports via type-checking, so this rule would just be a
      // slower, less accurate duplicate of that.
      'import/no-unresolved': 'off',
      // TypeScript + Vite's bundler module resolution expects extensionless
      // imports (`./footer`, not `./footer.tsx`); this rule would fight
      // that convention.
      'import/extensions': 'off',
      // This is a CommonJS/ESM-interop rule for projects that mix
      // `module.exports` with `export`. This project's "type": "module"
      // + `export default` convention throughout means it doesn't apply.
      'import/no-import-module-exports': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-filename-extension': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      // Disabled in favor of @typescript-eslint/no-unused-vars (already
      // enabled as an error via tsPlugin.configs['flat/recommended']
      // above). The base rule doesn't understand TypeScript-only syntax
      // and false-positives on things like named parameters in function
      // type literals (e.g. `(state: Foo) => void`), flagging valid code
      // as an unused variable.
      'no-unused-vars': 'off',
      'prefer-const': 'warn',
      'prefer-destructuring': 'warn',
      semi: 'warn',
      'no-console': 'warn',
      'no-case-declarations': 'off',
      quotes: ['error', 'single'],
      'react/function-component-definition': [
        2,
        {
          namedComponents: 'arrow-function',
          unnamedComponents: 'arrow-function',
        },
      ],
      'react-refresh/only-export-components': 'warn',
    },
  },
];
