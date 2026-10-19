import { defineConfig } from 'oxlint';
import node from 'oxlint-config-universe/node';

// Shared oxlint configuration for every package under packages/ and for scripts/.
// Derived from the base config in expo/expo's @expo/internal-scripts, trimmed to
// the rules that apply to plain Node TypeScript.
export default defineConfig({
  extends: [node],
  // NOTE: oxlint does not inherit `ignorePatterns` through `extends`, so packages
  // re-export this whole config instead of extending it.
  ignorePatterns: ['**/node_modules/**', '**/build/**', '**/.expo/**'],
  overrides: [
    {
      files: ['**/__tests__/**', '**/__mocks__/**', '**/jest/**'],
      env: { jest: true, node: true },
      rules: {
        // Tests need to re-assign imported bindings to install mocks and spies.
        'no-import-assign': 'off',
      },
    },
    {
      files: ['*.config.js', '*.config.mjs', '.*rc.js'],
      env: { node: true },
    },
    {
      files: ['**/*.ts', '**/*.d.ts'],
      rules: {
        // Handled by TypeScript.
        'no-unused-expressions': 'off',
        'no-unused-vars': 'off',
        'no-useless-return': 'off',
        // Enabling it blocks legitimate type overloads, which TypeScript already validates.
        'no-dupe-class-members': 'off',
      },
    },
  ],
  rules: {
    // Handled by TypeScript.
    'no-unsafe-optional-chaining': 'off',
    // Kept off to match expo/expo, where it was suppressed by eslint-config-prettier.
    curly: 'off',
  },
});
