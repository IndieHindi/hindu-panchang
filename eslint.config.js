import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

// Create a clean copy of browser globals to fix the "AudioWorkletGlobalScope " trailing whitespace issue
const browserGlobals = { ...globals.browser }
// Delete problematic entry if it exists (with trailing space)
delete browserGlobals['AudioWorkletGlobalScope ']
// Add the correct entry without trailing space if needed
if (!browserGlobals.AudioWorkletGlobalScope) {
  browserGlobals.AudioWorkletGlobalScope = false
}

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: browserGlobals,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { 
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_' 
        }
      ],
    },
  },
)
