const path = require("path");
const folderName = path.basename(__dirname);
const cleanName = folderName.replace(/[_\s-]/g, "");
const appId = "dev.bacon." + cleanName;

module.exports = ({ config }) => {
  if (!config.extra) config.extra = {};
  // Expose CI env variables to the app
  config.extra.CI = process.env.CI;

  if (!config.ios) config.ios = {};
  config.ios.bundleIdentifier = appId;
  if (!config.android) config.android = {};
  config.android.package = appId;
  return config;
};
