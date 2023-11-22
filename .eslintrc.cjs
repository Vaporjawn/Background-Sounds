module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    // 'plugin:prettier/recommended',
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
      'import/no-extraneous-dependencies': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-filename-extension': 'off',
      'import/extensions': 'off',
      'import/no-unresolved': 'off',
      'import/no-import-module-exports': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      'no-unused-vars': 'warn',
      'prefer-const': 'warn',
      'prefer-destructuring': 'warn',
      'semi': 'warn',
      'no-console': 'warn',
      'no-case-declarations': 'off',
      'promise/always-return': 'off',
      'jsx-a11y/interactive-supports-focus': 'off',
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
