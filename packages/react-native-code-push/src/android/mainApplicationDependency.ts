import { ConfigPlugin, withMainApplication } from "expo/config-plugins";

import { PluginConfigType } from "../pluginConfig";
import { addBelowAnchorIfNotFound } from "../utils/addBelowAnchorIfNotFound";

/**
 * Updates the `MainApplication.java` by adding the CodePush runtime initialization code
 * https://github.com/microsoft/react-native-code-push/blob/master/docs/setup-android.md#plugin-installation-and-configuration-for-react-native-060-version-and-above-android
 */
export const withAndroidMainApplicationDependency: ConfigPlugin<
  PluginConfigType
> = (config) => {
  return withMainApplication(config, (mainApplicationProps) => {
    // Import the plugin class.
    mainApplicationProps.modResults.contents = addBelowAnchorIfNotFound(
      mainApplicationProps.modResults.contents,
      "import expo.modules.ReactNativeHostWrapper;",
      "import com.microsoft.codepush.react.CodePush;"
    );

    /**
     * Override the getJSBundleFile method in order to let
     * the CodePush runtime determine where to get the JS
     * bundle location from on each app start
     */
    const getJSBundleFileOverride = `
      @Override
      protected String getJSBundleFile() {
        return CodePush.getJSBundleFile();
      }\n`;

    // This seems to be the default on Expo 49
    if (
      mainApplicationProps.modResults.contents.includes(
        "new DefaultReactNativeHost(this) {"
      )
    ) {
      mainApplicationProps.modResults.contents = addBelowAnchorIfNotFound(
        mainApplicationProps.modResults.contents,
        `new DefaultReactNativeHost(this) {`,
        getJSBundleFileOverride
      );

      return mainApplicationProps;
    }

    // This is for compatibility, as it follows the Codepush instructions up-to-spec.
    if (
      mainApplicationProps.modResults.contents.includes(
        "new ReactNativeHost(this) {"
      )
    ) {
      mainApplicationProps.modResults.contents = addBelowAnchorIfNotFound(
        mainApplicationProps.modResults.contents,
        `new ReactNativeHost(this) {`,
        getJSBundleFileOverride
      );

      return mainApplicationProps;
    }

    throw new Error(
      "Cannot find a suitable place to insert the CodePush getJSBundleFile code."
    );
  });
};
