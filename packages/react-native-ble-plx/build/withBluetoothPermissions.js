"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withBluetoothPermissions = void 0;
const config_plugins_1 = require("@expo/config-plugins");
const BLUETOOTH_ALWAYS = "Allow $(PRODUCT_NAME) to connect to bluetooth devices";
const BLUETOOTH_PERIPHERAL_USAGE = "Allow $(PRODUCT_NAME) to connect to bluetooth devices";
const withBluetoothPermissions = (c, { bluetoothAlwaysPermission, bluetoothPeripheralPermission } = {}) => {
    return (0, config_plugins_1.withInfoPlist)(c, (config) => {
        if (bluetoothAlwaysPermission !== false) {
            config.modResults.NSBluetoothAlwaysUsageDescription =
                bluetoothAlwaysPermission ||
                    config.modResults.NSBluetoothAlwaysUsageDescription ||
                    BLUETOOTH_ALWAYS;
        }
        if (bluetoothPeripheralPermission !== false) {
            config.modResults.NSBluetoothPeripheralUsageDescription =
                bluetoothPeripheralPermission ||
                    config.modResults.NSBluetoothPeripheralUsageDescription ||
                    BLUETOOTH_PERIPHERAL_USAGE;
        }
        return config;
    });
};
exports.withBluetoothPermissions = withBluetoothPermissions;
