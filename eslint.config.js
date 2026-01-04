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
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
  // Form drawers, modals, editors, panels: Allow setState in effects for form initialization from props
  // This is a legitimate pattern where props drive initial form state
  {
    files: ['**/*FormDrawer.tsx', '**/*Modal.tsx', '**/*Panel.tsx', '**/*Calculator.tsx', '**/*Editor.tsx'],
    rules: {
      'react-hooks/set-state-in-effect': 'off',
    },
  },
])
