"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_plugins_1 = require("@expo/config-plugins");
const withBitcodeDisabled_1 = require("./withBitcodeDisabled");
const withDesugaring_1 = require("./withDesugaring");
const withPermissions_1 = require("./withPermissions");
const pkg = { name: "react-native-webrtc", version: "UNVERSIONED" }; //require("react-native-webrtc/package.json");
const withWebRTC = (config, props = {}) => {
    const _props = props || {};
    // iOS
    config = withPermissions_1.withPermissions(config, _props);
    config = withBitcodeDisabled_1.withBitcodeDisabled(config);
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
    config = config_plugins_1.AndroidConfig.Version.withBuildScriptExtMinimumVersion(config, {
        name: "minSdkVersion",
        minVersion: 24,
    });
    config = withDesugaring_1.withDesugaring(config, true);
    return config;
};
exports.default = config_plugins_1.createRunOncePlugin(withWebRTC, pkg.name, pkg.version);
