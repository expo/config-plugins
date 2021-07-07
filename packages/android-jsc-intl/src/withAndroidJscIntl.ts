import { ConfigPlugin, createRunOncePlugin, withAppBuildGradle } from "@expo/config-plugins";

/**
 * Apply android-jsc-intl configuration for Expo SDK 42 projects.
 * 
 * This plugin lets you access the `Intl` API in Android apps (without Hermes).
 */
const withAndroidJscIntl: ConfigPlugin = (config) => {
  // Return the modified config.
  return withAppBuildGradle(config, config => {
    if (config.modResults.language === 'groovy') {
      config.modResults.contents = config.modResults.contents.replace(
        'org.webkit:android-jsc:+',
        'org.webkit:android-jsc-intl:+'
      )
    } else {
      throw new Error('[@expo/config-plugins][withAndroidJscIntl] Cannot enable Intl in Android JSC app gradle because the build.gradle is not groovy.')
    }
    return config
  });
};

const pkg = {
  // Prevent this plugin from being run more than once.
  // This pattern enables users to safely migrate off of this
  // out-of-tree `@config-plugins/android-jsc-intl` to a future
  // upstream plugin in `android-jsc-intl`
  name: "android-jsc-intl",
  // Indicates that this plugin is dangerously linked to a module,
  // and might not work with the latest version of that module.
  version: "UNVERSIONED",
};

export default createRunOncePlugin(withAndroidJscIntl, pkg.name, pkg.version);
