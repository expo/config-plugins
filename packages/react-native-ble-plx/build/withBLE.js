"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BackgroundMode = void 0;
const config_plugins_1 = require("@expo/config-plugins");
const withBLEAndroidManifest_1 = require("./withBLEAndroidManifest");
const withBLEBackgroundModes_1 = require("./withBLEBackgroundModes");
Object.defineProperty(exports, "BackgroundMode", { enumerable: true, get: function () { return withBLEBackgroundModes_1.BackgroundMode; } });
const withBluetoothPermissions_1 = require("./withBluetoothPermissions");
const pkg = { name: "react-native-ble-plx", version: "UNVERSIONED" }; //require('react-native-ble-plx/package.json')
/**
 * Apply BLE configuration for Expo SDK 42 projects.
 */
const withBLE = (config, props = {}) => {
    var _a, _b;
    const _props = props || {};
    const isBackgroundEnabled = (_a = _props.isBackgroundEnabled) !== null && _a !== void 0 ? _a : false;
    const neverForLocation = (_b = _props.neverForLocation) !== null && _b !== void 0 ? _b : false;
    // iOS
    config = withBluetoothPermissions_1.withBluetoothPermissions(config, _props);
    config = withBLEBackgroundModes_1.withBLEBackgroundModes(config, _props.modes || []);
    // Android
    config = config_plugins_1.AndroidConfig.Permissions.withPermissions(config, [
        "android.permission.BLUETOOTH",
        "android.permission.BLUETOOTH_ADMIN",
        "android.permission.BLUETOOTH_CONNECT", // since Android SDK 31
    ]);
    config = withBLEAndroidManifest_1.withBLEAndroidManifest(config, {
        isBackgroundEnabled,
        neverForLocation,
    });
    return config;
};
exports.default = config_plugins_1.createRunOncePlugin(withBLE, pkg.name, pkg.version);
