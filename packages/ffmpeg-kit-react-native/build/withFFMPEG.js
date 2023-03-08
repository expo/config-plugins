"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expo_build_properties_1 = require("expo-build-properties");
const config_plugins_1 = require("expo/config-plugins");
const withAndroidFFMPEGPackage_1 = require("./withAndroidFFMPEGPackage");
const withCocoaPodsImport_1 = require("./withCocoaPodsImport");
let pkg = {
    name: "ffmpeg-kit-react-native",
};
try {
    pkg = require("ffmpeg-kit-react-native/package.json");
}
catch {
    // empty catch block
}
const withFFMPEG = (config, _props) => {
    const props = _props || {};
    const iosPackage = props.ios?.package || props.package;
    const androidPackage = props.android?.package || props.package;
    return (0, config_plugins_1.withPlugins)(config, [
        // iOS
        [withCocoaPodsImport_1.withPodfilePropertiesPackage, iosPackage],
        withCocoaPodsImport_1.withCocoaPodsImport,
        // Android
        // Set min SDK Version to 24.
        [
            expo_build_properties_1.withBuildProperties,
            {
                android: {
                    // https://github.com/expo/expo/blob/sdk-46/templates/expo-template-bare-minimum/android/build.gradle#L8
                    minSdkVersion: 24,
                },
            },
        ],
        [withAndroidFFMPEGPackage_1.withAndroidFFMPEGPackage, androidPackage],
    ]);
};
module.exports = (0, config_plugins_1.createRunOncePlugin)(withFFMPEG, pkg.name, pkg.version);
