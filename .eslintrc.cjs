module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:jsx-a11y/recommended',
    // 'plugin:prettier/recommended',
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
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
      // enabled as an error via plugin:@typescript-eslint/recommended
      // above). The base rule doesn't understand TypeScript-only syntax
      // and false-positives on things like named parameters in function
      // type literals (e.g. `(state: Foo) => void`), flagging valid code
      // as an unused variable.
      'no-unused-vars': 'off',
      'prefer-const': 'warn',
      'prefer-destructuring': 'warn',
      'semi': 'warn',
      'no-console': 'warn',
      'no-case-declarations': 'off',
      'quotes': ['error', 'single'],
      'react/function-component-definition': [
        2,
        {
          namedComponents: 'arrow-function',
          unnamedComponents: 'arrow-function',
        },
      ],
    },
};
