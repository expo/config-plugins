// Copied from https://github.com/expo/expo-cli/blob/main/packages/config-plugins/src/android/Version.ts

import {
  ConfigPlugin,
  WarningAggregator,
  withProjectBuildGradle,
} from "@expo/config-plugins";

/** Sets a numeric version for a value in the project.gradle buildscript.ext object to be at least the provided props.minVersion, if the existing value is greater then no change will be made. */
export const withBuildScriptExtMinimumVersion: ConfigPlugin<{
  name: string;
  minVersion: number;
}> = (config, props) => {
  return withProjectBuildGradle(config, (config) => {
    if (config.modResults.language === "groovy") {
      config.modResults.contents = setMinBuildScriptExtVersion(
        config.modResults.contents,
        props
      );
    } else {
      WarningAggregator.addWarningAndroid(
        "withBuildScriptExtVersion",
        `Cannot automatically configure project build.gradle if it's not groovy`
      );
    }
    return config;
  });
};

export function setMinBuildScriptExtVersion(
  buildGradle: string,
  { name, minVersion }: { name: string; minVersion: number }
) {
  const regex = new RegExp(`(${name}\\s?=\\s?)(\\d+(?:\\.\\d+)?)`);
  const currentVersion = buildGradle.match(regex)?.[2];
  if (!currentVersion) {
    WarningAggregator.addWarningAndroid(
      "withBuildScriptExtVersion",
      `Cannot set minimum buildscript.ext.${name} version because the property "${name}" cannot be found or does not have a numeric value.`
    );
    // TODO: Maybe just add the property...
    return buildGradle;
  }

  const currentVersionNum = Number(currentVersion);
  return buildGradle.replace(
    regex,
    `$1${Math.max(minVersion, currentVersionNum)}`
  );
}
