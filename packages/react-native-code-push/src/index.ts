import { ConfigPlugin, createRunOncePlugin } from "expo/config-plugins";

import { withAndroidBuildscriptDependency } from "./android/buildscriptDependency";
import { withAndroidMainApplicationDependency } from "./android/mainApplicationDependency";
import { withAndroidSettingsDependency } from "./android/settingsDependency";
import { withAndroidStringsDependency } from "./android/stringsDependency";
import { withIosAppDelegateDependency } from "./ios/appDelegateDependency";
import { withIosInfoPlistDependency } from "./ios/infoPlistDependency";
import { PluginConfigType } from "./pluginConfig";

// @todo: Is this still needed?
let pkg: { name: string; version?: string } = {
  name: "react-native-code-push",
};
try {
  pkg = require("react-native-code-push/package.json");
} catch {
  // empty catch block
}

/**
 * A config plugin for configuring `react-native-code-push`
 */
const withRnCodepush: ConfigPlugin<PluginConfigType> = (config, props) => {
  // Plugins order matter, be careful when changing the order.

  // Apply Android changes
  config = withAndroidBuildscriptDependency(config, props);
  config = withAndroidSettingsDependency(config, props);
  config = withAndroidStringsDependency(config, props);
  config = withAndroidMainApplicationDependency(config, props);

  // Apply iOS changes
  config = withIosInfoPlistDependency(config, props);
  config = withIosAppDelegateDependency(config, props);

  return config;
};

export default createRunOncePlugin(withRnCodepush, pkg.name, pkg.version);
