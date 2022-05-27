import { ConfigPlugin, createRunOncePlugin } from "@expo/config-plugins";

/**
 * Apply airbridge-react-native-sdk configuration for Expo SDK 42 projects.
 */
const withAirbridgeReactNativeSdk: ConfigPlugin<{} | void> = (config, _props = {}) => {
  // Support passing no props to the plugin.
  const props = _props || {};

  // Return the modified config.
  return config;
};

const pkg = {
  // Prevent this plugin from being run more than once.
  // This pattern enables users to safely migrate off of this
  // out-of-tree `@config-plugins/airbridge-react-native-sdk` to a future
  // upstream plugin in `airbridge-react-native-sdk`
  name: "airbridge-react-native-sdk",
  // Indicates that this plugin is dangerously linked to a module,
  // and might not work with the latest version of that module.
  version: "UNVERSIONED",
};

export default createRunOncePlugin(withAirbridgeReactNativeSdk, pkg.name, pkg.version);
