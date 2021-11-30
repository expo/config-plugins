import { ConfigPlugin, createRunOncePlugin } from "@expo/config-plugins";
import { withReactNativeBatchMainActivity } from "./withReactNativeBatchMainActivity";
import { withReactNativeBatchAppBuildGradle } from "./withReactNativeBatchAppBuildGradle";
import { withReactNativeBatchProjectBuildGradle } from "./withReactNativeBatchProjectBuildGradle";

/**
 * Apply react-native-batch configuration for Expo SDK 42 projects.
 */
const withReactNativeBatch: ConfigPlugin<{} | void> = (config, _props = {}) => {
  // Support passing no props to the plugin.

  let newConfig = withReactNativeBatchAppBuildGradle(config);
  newConfig = withReactNativeBatchMainActivity(newConfig);
  newConfig = withReactNativeBatchProjectBuildGradle(newConfig);
  // Return the modified config.
  return newConfig;
};

const pkg = {
  // Prevent this plugin from being run more than once.
  // This pattern enables users to safely migrate off of this
  // out-of-tree `@config-plugins/react-native-batch` to a future
  // upstream plugin in `react-native-batch`
  name: "react-native-batch",
  // Indicates that this plugin is dangerously linked to a module,
  // and might not work with the latest version of that module.
  version: "UNVERSIONED",
};

export default createRunOncePlugin(withReactNativeBatch, pkg.name, pkg.version);
