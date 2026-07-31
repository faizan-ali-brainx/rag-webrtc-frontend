import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    // Enforced project standards (WEB_FRONTEND_PR_STANDARDS.md).
    rules: {
      '@typescript-eslint/no-explicit-any': 'error', // Rule: no `any`
      'max-lines-per-function': [
        'error',
        { max: 23, skipBlankLines: true, skipComments: true }, // Rule 6: Shy Code
      ],
      'no-console': 'error', // Rule 11: No Dead Code
    },
  },
  {
    // Test files may exceed the function-length cap.
    files: ['**/*.test.{ts,tsx}', '**/setupTests.ts'],
    rules: {
      'max-lines-per-function': 'off',
    },
  },
])
