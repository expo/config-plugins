// Shared ESLint configuration for every package under packages/.
// Packages require this file from their own .eslintrc.js.

module.exports = {
  root: true,
  extends: ["universe/native"],
  overrides: [
    {
      files: ["**/__tests__/*"],
      env: { node: true },
      globals: { __DEV__: true },
    },
    {
      files: ["./*.config.js", "./.*rc.js"],
      extends: ["universe/node"],
    },
    {
      files: ["*.ts", "*.tsx", "*.d.ts"],
      rules: {
        // Handled by TypeScript.
        "no-redeclare": "off",
        "@typescript-eslint/no-redeclare": "off",
        "no-unused-expressions": "off",
        "no-unused-vars": "off",
        "no-useless-return": "off",
        "no-unreachable": "off",
        "no-undef": "off",
        "no-dupe-keys": "off",
        "no-dupe-class-members": "off",
        "no-dupe-args": "off",
        "@typescript-eslint/no-unused-expressions": "off",
        "@typescript-eslint/no-unused-vars": "off",
      },
    },
  ],
  rules: {
    "no-restricted-imports": [
      "warn",
      {
        // fbjs is a Facebook-internal package not intended to be a public API
        patterns: ["fbjs/*", "fbjs"],
      },
    ],
  },
};
