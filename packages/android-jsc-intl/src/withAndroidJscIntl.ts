import { ConfigPlugin, withAppBuildGradle } from "@expo/config-plugins";

/**
 * Apply android-jsc-intl native configuration.
 *
 * This plugin lets you access the `Intl` API in Android apps (without Hermes).
 */
const withAndroidJscIntl: ConfigPlugin = (config) => {
  // Return the modified config.
  return withAppBuildGradle(config, (config) => {
    if (config.modResults.language !== "groovy") {
      throw new Error(
        "[@expo/config-plugins][withAndroidJscIntl] Cannot enable Intl in Android JSC app gradle because the build.gradle is not groovy."
      );
    }

    config.modResults.contents = config.modResults.contents.replace(
      "org.webkit:android-jsc:+",
      "org.webkit:android-jsc-intl:+"
    );

    return config;
  });
};

export default withAndroidJscIntl;
