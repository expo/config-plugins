import { withBuildProperties } from "expo-build-properties";
import { ConfigPlugin, withProjectBuildGradle } from "expo/config-plugins";

const kotlinClassPath =
  "org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlinVersion";

/**
 * Lifted from [unimodules-test-core](https://github.com/expo/expo/blob/master/packages/unimodules-test-core/app.plugin.js).
 *
 * @param config Expo config
 * @param version Kotlin version to use
 */
const withKotlinGradle: ConfigPlugin<string> = (config, version) => {
  config = withBuildProperties(config, {
    android: {
      kotlinVersion: version,
    },
  });

  return withProjectBuildGradle(config, (config) => {
    // Add the classpath to the project build.gradle
    if (config.modResults.language === "groovy") {
      config.modResults.contents = setKotlinClassPath(
        config.modResults.contents
      );
    } else {
      throw new Error(
        "Cannot setup kotlin because the build.gradle is not groovy"
      );
    }
    return config;
  });
};

function setKotlinClassPath(buildGradle: string): string {
  if (buildGradle.includes(kotlinClassPath)) {
    return buildGradle;
  }

  return buildGradle.replace(
    /dependencies\s?{/,
    `dependencies {
        classpath "${kotlinClassPath}"`
  );
}

export default withKotlinGradle;
