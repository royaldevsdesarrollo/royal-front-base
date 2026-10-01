import js from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'
import globals from 'globals'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

const sourceFiles = ['src/**/*.{ts,tsx}']
const typescriptFiles = ['**/*.{ts,tsx}']
const scriptFiles = ['**/*.{js,mjs,cjs}']
const codeFiles = [...typescriptFiles, ...scriptFiles]

export default tseslint.config(
  {
    ignores: ['dist', 'build', 'coverage', 'node_modules', 'public', 'dev-dist'],
  },
  {
    files: scriptFiles,
    extends: [js.configs.recommended],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: globals.node,
    },
  },
  {
    files: typescriptFiles,
    extends: [js.configs.recommended, ...tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2022,
        ...globals.node,
      },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'separate-type-imports' },
      ],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      '@typescript-eslint/switch-exhaustiveness-check': 'error',
    },
  },
  {
    files: sourceFiles,
    extends: [
      react.configs.flat.recommended,
      react.configs.flat['jsx-runtime'],
      reactHooks.configs.flat['recommended-latest'],
      reactRefresh.configs.vite,
      jsxA11y.flatConfigs.recommended,
    ],
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      'react/button-has-type': 'error',
      'react/jsx-no-useless-fragment': 'error',
      'react/no-array-index-key': 'warn',
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/self-closing-comp': 'error',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
  {
    // shadcn exporta variantes cva junto al componente (badgeVariants, buttonVariants, ...).
    files: ['src/shared/components/ui/**/*.{ts,tsx}'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
  {
    files: codeFiles,
    rules: {
      'curly': ['error', 'all'],
      'eqeqeq': ['error', 'always'],
      'no-alert': 'warn',
      'no-debugger': 'error',
      'no-duplicate-imports': ['error', { allowSeparateTypeImports: true }],
      'no-var': 'error',
      'object-shorthand': 'error',
      'prefer-const': 'error',
    },
  },
  {
    ...stylistic.configs.customize({
      indent: 2,
      quotes: 'single',
      semi: false,
      jsx: true,
    }),
    files: codeFiles,
  },
)
