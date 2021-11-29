module.exports = ({ config }) => {
  if (!config.extra) config.extra = {};
  // Expose CI env variables to the app
  config.extra.CI = process.env.CI;
  return config;
};
