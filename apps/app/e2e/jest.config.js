module.exports = {
  testRunner: require.resolve("jest-circus/runner"),
  testTimeout: 120000,
  rootDir: "..",
  testMatch: ["<rootDir>/**/__tests__/*"],
  transform: {
    "^.+\\.[jt]sx?$": "ts-jest",
  },
  reporters: [require.resolve("detox/runners/jest/reporter")],
  globalSetup: "detox/runners/jest/globalSetup",
  globalTeardown: "detox/runners/jest/globalTeardown",
  testEnvironment: "detox/runners/jest/testEnvironment",
  verbose: true,
};
