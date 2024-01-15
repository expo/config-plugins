import { ConfigPlugin, withAppBuildGradle } from "expo/config-plugins";

import { PluginConfigType } from "../pluginConfig";
import { addBelowAnchorIfNotFound } from "../utils/addBelowAnchorIfNotFound";

function applyImplementation(appBuildGradle: string) {
  const codePushImplementation =
    'apply from: "../../node_modules/react-native-code-push/android/codepush.gradle"';

  // Make sure the project does not have the dependency already
  if (appBuildGradle.includes(codePushImplementation)) {
    return appBuildGradle;
  }

  // Seems to be the default on Expo 49
  const reactNative71Include = `apply from: new File(["node", "--print", "require.resolve('@react-native-community/cli-platform-android/package.json')"].execute(null, rootDir).text.trim(), "../native_modules.gradle");`;
  if (appBuildGradle.includes(reactNative71Include)) {
    return addBelowAnchorIfNotFound(
      appBuildGradle,
      reactNative71Include,
      codePushImplementation
    );
  }

  // For compatibility
  const reactNativeFileClassGradleInclude = `'apply from: new File(reactNativeRoot, "react.gradle")`;
  if (appBuildGradle.includes(reactNativeFileClassGradleInclude)) {
    return addBelowAnchorIfNotFound(
      appBuildGradle,
      reactNativeFileClassGradleInclude,
      codePushImplementation
    );
  }

  // For compatibility
  const reactNativeRawGradleInclude = `apply from: "../../node_modules/react-native/react.gradle"`;
  if (appBuildGradle.includes(reactNativeRawGradleInclude)) {
    return addBelowAnchorIfNotFound(
      appBuildGradle,
      reactNativeRawGradleInclude,
      codePushImplementation
    );
  }

  throw new Error(
    "Cannot find a suitable place to insert the CodePush buildscript dependency."
  );
}

/**
 * Update `<project>/build.gradle` by adding the codepush.gradle file
 * as an additional build task definition underneath react.gradle
 * https://github.com/microsoft/react-native-code-push/blob/master/docs/setup-android.md#plugin-installation-and-configuration-for-react-nactive-060-version-and-above-android
 */
export const withAndroidBuildscriptDependency: ConfigPlugin<
  PluginConfigType
> = (config) => {
  return withAppBuildGradle(config, (buildGradleProps) => {
    buildGradleProps.modResults.contents = applyImplementation(
      buildGradleProps.modResults.contents
    );

    return buildGradleProps;
  });
};
