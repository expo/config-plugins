"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BackgroundMode = void 0;
const config_plugins_1 = require("expo/config-plugins");
const withBLEAndroidManifest_1 = require("./withBLEAndroidManifest");
const withBLEBackgroundModes_1 = require("./withBLEBackgroundModes");
Object.defineProperty(exports, "BackgroundMode", { enumerable: true, get: function () { return withBLEBackgroundModes_1.BackgroundMode; } });
const withBluetoothPermissions_1 = require("./withBluetoothPermissions");
const pkg = { name: "react-native-ble-plx", version: "UNVERSIONED" }; //require('react-native-ble-plx/package.json')
/**
 * Apply BLE native configuration.
 */
const withBLE = (config, props = {}) => {
    const _props = props || {};
    const neverForLocation = _props.neverForLocation ?? false;
    const isRequired = _props.isRequired ?? false;
    const canDiscover = _props.canDiscover ?? true;
    const isDiscoverable = _props.isDiscoverable ?? false;
    const canConnect = _props.canConnect ?? true;
    if ("bluetoothPeripheralPermission" in _props) {
        config_plugins_1.WarningAggregator.addWarningIOS("bluetoothPeripheralPermission", `The iOS permission \`NSBluetoothPeripheralUsageDescription\` is fully deprecated as of iOS 13 (lowest iOS version in Expo SDK 47+). Remove the \`bluetoothPeripheralPermission\` property from the \`@config-plugins/react-native-ble-plx\` config plugin.`);
    }
    if ("isBackgroundEnabled" in _props) {
        config_plugins_1.WarningAggregator.addWarningAndroid("isBackgroundEnabled", "This propery name has changed. You should use isRequired, as better matches the behavior.");
    }
    // iOS
    config = (0, withBluetoothPermissions_1.withBluetoothPermissions)(config, _props);
    config = (0, withBLEBackgroundModes_1.withBLEBackgroundModes)(config, _props.modes || []);
    config = (0, withBLEAndroidManifest_1.withBLEAndroidManifest)(config, {
        neverForLocation,
        isRequired,
        canDiscover,
        isDiscoverable,
        canConnect,
    });
    return config;
};
exports.default = (0, config_plugins_1.createRunOncePlugin)(withBLE, pkg.name, pkg.version);
