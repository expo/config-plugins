"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addAndroidPackagingOptions = void 0;
const config_plugins_1 = require("@expo/config-plugins");
const generateCode_1 = require("@expo/config-plugins/build/utils/generateCode");
const withXcodeLinkBinaryWithLibraries = (config, { library, status }) => {
    return config_plugins_1.withXcodeProject(config, (config) => {
        const options = status === "optional" ? { weak: true } : {};
        const target = config_plugins_1.IOSConfig.XcodeUtils.getApplicationNativeTarget({
            project: config.modResults,
            projectName: config.modRequest.projectName,
        });
        config.modResults.addFramework(library, {
            target: target.uuid,
            ...options,
        });
        return config;
    });
};
const addAndroidPackagingOptions = (src) => {
    return generateCode_1.mergeContents({
        tag: "react-native-play-services-analytics",
        src,
        newSrc: `
      implementation 'com.google.android.gms:play-services-analytics:18.0.0'
      implementation 'com.android.installreferrer:installreferrer:2.2'
    `,
        anchor: /dependencies(?:\s+)?\{/,
        // Inside the dependencies block.
        offset: 1,
        comment: "//",
    });
};
exports.addAndroidPackagingOptions = addAndroidPackagingOptions;
const withGradle = (config) => {
    return config_plugins_1.withAppBuildGradle(config, (config) => {
        if (config.modResults.language === "groovy") {
            config.modResults.contents = exports.addAndroidPackagingOptions(config.modResults.contents).contents;
        }
        else {
            throw new Error("Cannot add Play Services maven gradle because the project build.gradle is not groovy");
        }
        return config;
    });
};
/**
 * Apply react-native-adjust configuration for Expo SDK 42 projects.
 */
const withAdjustPlugin = (config) => {
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
    config = config_plugins_1.AndroidConfig.Permissions.withPermissions(config, [
        "com.google.android.gms.permission.AD_ID",
    ]);
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
module.exports = config_plugins_1.createRunOncePlugin(withAdjustPlugin, pkg.name, pkg.version);
