import { ConfigPlugin, withInfoPlist } from "expo/config-plugins";

import { PluginConfigType } from "../pluginConfig";

/**
 * Sets the CodePushDeploymentKey in the iOS Info.plist
 * https://github.com/microsoft/react-native-code-push/blob/master/docs/setup-ios.md
 */
export const withIosInfoPlistDependency: ConfigPlugin<PluginConfigType> = (
  config,
  props
) => {
  if (!props.ios.CodePushDeploymentKey) return config;

  return withInfoPlist(config, (infoPlistProps) => {
    infoPlistProps.modResults.CodePushDeploymentKey =
      props.ios.CodePushDeploymentKey;

    return infoPlistProps;
  });
};
