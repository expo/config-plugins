"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withBluetoothPermissions = void 0;
const config_plugins_1 = require("expo/config-plugins");
const BLUETOOTH_ALWAYS = "Allow $(PRODUCT_NAME) to connect to bluetooth devices";
const withBluetoothPermissions = (c, { bluetoothAlwaysPermission } = {}) => {
    return (0, config_plugins_1.withInfoPlist)(c, (config) => {
        if (bluetoothAlwaysPermission !== false) {
            config.modResults.NSBluetoothAlwaysUsageDescription =
                bluetoothAlwaysPermission ||
                    config.modResults.NSBluetoothAlwaysUsageDescription ||
                    BLUETOOTH_ALWAYS;
        }
        return config;
    });
};
exports.withBluetoothPermissions = withBluetoothPermissions;
