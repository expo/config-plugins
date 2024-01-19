"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_plugins_1 = require("expo/config-plugins");
const expo_build_properties_1 = require("expo-build-properties");
const withBitcodeDisabled_1 = require("./withBitcodeDisabled");
const withDesugaring_1 = require("./withDesugaring");
const withPermissions_1 = require("./withPermissions");
const pkg = { name: "react-native-webrtc", version: "UNVERSIONED" }; //require("react-native-webrtc/package.json");
const withWebRTC = (config, props = {}) => {
    const _props = props || {};
    // iOS
    config = (0, withPermissions_1.withPermissions)(config, _props);
    config = (0, withBitcodeDisabled_1.withBitcodeDisabled)(config);
    // Android
    config = config_plugins_1.AndroidConfig.Permissions.withPermissions(config, [
        "android.permission.ACCESS_NETWORK_STATE",
        "android.permission.BLUETOOTH",
        "android.permission.CAMERA",
        "android.permission.INTERNET",
        "android.permission.MODIFY_AUDIO_SETTINGS",
        "android.permission.RECORD_AUDIO",
        "android.permission.SYSTEM_ALERT_WINDOW",
        "android.permission.WAKE_LOCK",
    ]);
    config = (0, expo_build_properties_1.withBuildProperties)(config, {
        android: {
            // https://github.com/expo/expo/blob/sdk-46/templates/expo-template-bare-minimum/android/build.gradle#L8
            minSdkVersion: 24,
        },
    });
    config = (0, withDesugaring_1.withDesugaring)(config, true);
    return config;
};
exports.default = (0, config_plugins_1.createRunOncePlugin)(withWebRTC, pkg.name, pkg.version);
