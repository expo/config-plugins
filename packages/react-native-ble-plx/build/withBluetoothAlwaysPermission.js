"use strict";
/* eslint-disable flowtype/no-types-missing-file-annotation */
Object.defineProperty(exports, "__esModule", { value: true });
exports.withBluetoothAlwaysPermission = void 0;
const config_plugins_1 = require("@expo/config-plugins");
const BLUETOOTH_ALWAYS = 'Allow $(PRODUCT_NAME) to connect to bluetooth devices';
exports.withBluetoothAlwaysPermission = (c, { bluetoothAlwaysPermission } = {}) => {
    if (bluetoothAlwaysPermission === false) {
        return c;
    }
    return config_plugins_1.withInfoPlist(c, config => {
        config.modResults.NSBluetoothAlwaysUsageDescription =
            bluetoothAlwaysPermission || config.modResults.NSBluetoothAlwaysUsageDescription || BLUETOOTH_ALWAYS;
        return config;
    });
};
