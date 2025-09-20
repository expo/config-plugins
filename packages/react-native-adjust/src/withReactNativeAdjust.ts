import { mergeContents } from "@expo/config-plugins/build/utils/generateCode";
import {
  type ConfigPlugin,
  AndroidConfig,
  createRunOncePlugin,
  IOSConfig,
  withAppBuildGradle,
  withXcodeProject,
} from "expo/config-plugins";

const withXcodeLinkBinaryWithLibraries: ConfigPlugin<{
  library: string;
  status?: string;
}> = (config, { library, status }) => {
  return withXcodeProject(config, (config) => {
    const options = status === "optional" ? { weak: true } : {};

    const target = IOSConfig.XcodeUtils.getApplicationNativeTarget({
      project: config.modResults,
      projectName: config.modRequest.projectName!,
    });

    config.modResults.addFramework(library, {
      target: target.uuid,
      ...options,
    });

    return config;
  });
};

const addAndroidPackagingOptions = (src: string) => {
  return mergeContents({
    tag: "react-native-play-services-analytics",
    src,
    newSrc: `
      implementation 'com.google.android.gms:play-services-ads-identifier:18.0.1'
      implementation 'com.android.installreferrer:installreferrer:2.2'
    `,
    anchor: /dependencies(?:\s+)?\{/,
    // Inside the dependencies block.
    offset: 1,
    comment: "//",
  });
};

const withGradle: ConfigPlugin = (config) => {
  return withAppBuildGradle(config, (config) => {
    if (config.modResults.language === "groovy") {
      config.modResults.contents = addAndroidPackagingOptions(
        config.modResults.contents,
      ).contents;
    } else {
      throw new Error(
        "Cannot add Play Services maven gradle because the project build.gradle is not groovy",
      );
    }
    return config;
  });
};

/**
 * Apply react-native-adjust configuration for Expo SDK +44 projects.
 */
const withAdjustPlugin: ConfigPlugin<void | { targetAndroid12?: boolean }> = (
  config,
  _props,
) => {
  const props = _props || {};

  config = withXcodeLinkBinaryWithLibraries(config, {
    library: "iAd.framework",
    status: "optional",
  });

  config = withXcodeLinkBinaryWithLibraries(config, {
    library: "AdServices.framework",
    status: "optional",
  });

  config = withXcodeLinkBinaryWithLibraries(config, {
    library: "AdSupport.framework",
    status: "optional",
  });

  config = withXcodeLinkBinaryWithLibraries(config, {
    library: "StoreKit.framework",
    status: "optional",
  });

  config = withXcodeLinkBinaryWithLibraries(config, {
    library: "AppTrackingTransparency.framework",
    status: "optional",
  });

  if (props.targetAndroid12) {
    config = AndroidConfig.Permissions.withPermissions(config, [
      "com.google.android.gms.permission.AD_ID",
    ]);
  }

  config = withGradle(config);

  // Return the modified config.
  return config;
};

const pkg = {
  // Prevent this plugin from being run more than once.
  // This pattern enables users to safely migrate off of this
  // out-of-tree `@config-plugins/react-native-adjust` to a future
  // upstream plugin in `react-native-adjust`
  name: "react-native-adjust",
  // Indicates that this plugin is dangerously linked to a module,
  // and might not work with the latest version of that module.
  version: "UNVERSIONED",
};

export default createRunOncePlugin(withAdjustPlugin, pkg.name, pkg.version);
