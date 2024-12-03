import { type ConfigPlugin, withAppBuildGradle } from "expo/config-plugins";

/**
 * [Step 3](https://github.com/wix/Detox/blob/master/docs/Introduction.Android.md#3-add-the-native-detox-dependency). Add the Native Detox dependency.
 *
 * 1. Add `androidTestImplementation` to the app/build.gradle
 * 2. Add `testInstrumentationRunner` to the app/build.gradle
 * @param config
 */
const withDetoxTestAppGradle: ConfigPlugin = (config) => {
  return withAppBuildGradle(config, (config) => {
    if (config.modResults.language === "groovy") {
      config.modResults.contents = setGradleAndroidTestImplementation(
        config.modResults.contents,
      );
      config.modResults.contents = addDetoxDefaultConfigBlock(
        config.modResults.contents,
      );
    } else {
      throw new Error(
        "Cannot add Detox maven gradle because the project build.gradle is not groovy",
      );
    }
    return config;
  });
};

export function setGradleAndroidTestImplementation(
  buildGradle: string,
): string {
  buildGradle = pushGradleDependency(
    buildGradle,
    // SDK 50 https://github.com/wix/Detox/blob/700b750e8a09b2eff2d26c0dbf3c50b70130fc9b/examples/demo-react-native/android/app/build.gradle#L61
    "implementation 'androidx.appcompat:appcompat:1.6.1'",
  );
  buildGradle = pushGradleDependency(
    buildGradle,
    "androidTestImplementation('com.wix:detox:+')",
  );
  return buildGradle;
}

function escapeStringRegexp(str: string) {
  return str.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&");
}

export function pushGradleDependency(
  buildGradle: string,
  dependency: string,
): string {
  const pattern = new RegExp(escapeStringRegexp(dependency), "g");
  if (buildGradle.match(pattern)) {
    return buildGradle;
  }
  return buildGradle.replace(
    /dependencies\s?{/,
    `dependencies {
    ${dependency}`,
  );
}

export function addDetoxDefaultConfigBlock(buildGradle: string): string {
  const pattern = /detox-plugin-default-config/g;
  if (buildGradle.match(pattern)) {
    return buildGradle;
  }

  return buildGradle.replace(
    /defaultConfig\s?{/,
    `defaultConfig {
        // detox-plugin-default-config
        testBuildType System.getProperty('testBuildType', 'debug')
        testInstrumentationRunner 'androidx.test.runner.AndroidJUnitRunner'`,
  );
}

export default withDetoxTestAppGradle;
