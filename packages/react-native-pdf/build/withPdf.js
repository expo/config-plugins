"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addAndroidPackagingOptions = exports.withAndroidPackagingOptions = void 0;
const generateCode_1 = require("@expo/config-plugins/build/utils/generateCode");
const config_plugins_1 = require("expo/config-plugins");
let pkg = {
    name: "react-native-pdf",
};
try {
    pkg = require("react-native-pdf/package.json");
}
catch {
    // empty catch block
}
const withAndroidPackagingOptions = (config) => {
    return (0, config_plugins_1.withAppBuildGradle)(config, (config) => {
        if (config.modResults.language === "groovy") {
            config.modResults.contents = addAndroidPackagingOptions(config.modResults.contents).contents;
        }
        else {
            config_plugins_1.WarningAggregator.addWarningAndroid("@config-plugins/react-native-pdf", `Cannot automatically configure app build.gradle if it's not groovy`);
        }
        return config;
    });
};
exports.withAndroidPackagingOptions = withAndroidPackagingOptions;
function addAndroidPackagingOptions(src) {
    return (0, generateCode_1.mergeContents)({
        tag: "react-native-pdf-packaging-options",
        src,
        newSrc: packagingOptionsContents,
        anchor: /android(?:\s+)?\{/,
        // Inside the android block.
        offset: 1,
        comment: "//",
    });
}
exports.addAndroidPackagingOptions = addAndroidPackagingOptions;
const packagingOptionsContents = `
    packagingOptions {
        pickFirst 'lib/x86/libc++_shared.so'
        pickFirst 'lib/x86_64/libjsc.so'
        pickFirst 'lib/arm64-v8a/libjsc.so'
        pickFirst 'lib/arm64-v8a/libc++_shared.so'
        pickFirst 'lib/x86_64/libc++_shared.so'
        pickFirst 'lib/armeabi-v7a/libc++_shared.so'
    }
`;
const withReactNativePdf = (config) => {
    return (0, exports.withAndroidPackagingOptions)(config);
};
exports.default = (0, config_plugins_1.createRunOncePlugin)(withReactNativePdf, pkg.name, pkg.version);
