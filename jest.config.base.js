// Shared Jest configuration for every package under packages/.
// Packages require this file from their own jest.config.js.

/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  testRegex: '/__tests__/.*(test|spec)\\.[jt]sx?$',
  transform: {
    '^.+\\.[jt]sx?$': [
      require.resolve('@swc/jest'),
      {
        jsc: {
          parser: { syntax: 'typescript', dynamicImport: true },
          target: 'es2022',
        },
        module: { type: 'commonjs' },
      },
    ],
  },
  // Jest 29 cannot format inline snapshots with prettier 3. Skip formatting
  // instead of pinning a second prettier.
  prettierPath: null,
};
