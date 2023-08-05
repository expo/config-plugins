const path = require("path");

const roots = ["__mocks__", "src"];

module.exports = {
  ...require("expo-module-scripts/jest-preset-plugin"),
  rootDir: path.resolve(__dirname),
  displayName: require("./package").name,
  roots,
  setupFiles: ["<rootDir>/jest/setup.js"],
  clearMocks: true,
};
