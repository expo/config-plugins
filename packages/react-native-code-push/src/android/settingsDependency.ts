import { ConfigPlugin, withSettingsGradle } from "expo/config-plugins";

import { PluginConfigType } from "../pluginConfig";

function applySettings(gradleSettings: string) {
  const includeCodePush = "include ':react-native-code-push'";

  // Make sure the project does not have the settings already
  if (gradleSettings.includes(includeCodePush)) {
    return gradleSettings;
  }

  const codePushSettings = `
${includeCodePush}
project(':react-native-code-push').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-code-push/android/app')`;

  return gradleSettings + codePushSettings;
}

/**
 * Update `<project>/settings.gradle` by adding react-native-code-push
 * https://github.com/microsoft/react-native-code-push/blob/master/docs/setup-android.md#plugin-installation-and-configuration-for-react-native-060-version-and-above-android
 */
export const withAndroidSettingsDependency: ConfigPlugin<PluginConfigType> = (
  config
) => {
  return withSettingsGradle(config, (gradleProps) => {
    gradleProps.modResults.contents = applySettings(
      gradleProps.modResults.contents
    );

    return gradleProps;
  });
};
