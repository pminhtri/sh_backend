import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
  {
    ignores: ['eslint.config.js', 'dist', 'node_modules'],
  },

  // Base ESLint recommended
  eslint.configs.recommended,

  // Prettier integration
  eslintPluginPrettierRecommended,

  // TypeScript configs (type-aware)
  ...tseslint.configs.recommendedTypeChecked,

  {
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'warn',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      'prettier/prettier': [
        'error',
        {
          semi: true,
          trailingComma: 'none',
          singleQuote: true,
          endOfLine: 'auto',
        },
      ],
    },
  },
];
