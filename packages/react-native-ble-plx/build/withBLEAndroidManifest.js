"use strict";
/* eslint-disable flowtype/no-types-missing-file-annotation */
Object.defineProperty(exports, "__esModule", { value: true });
exports.addBLEHardwareFeatureToManifest = exports.addFineControlPermissionToManifest = exports.withBLEAndroidManifest = void 0;
const config_plugins_1 = require("@expo/config-plugins");
const withBLEAndroidManifest = (config, { isBackgroundEnabled }) => {
    return config_plugins_1.withAndroidManifest(config, (config) => {
        config.modResults = addFineControlPermissionToManifest(config.modResults);
        if (isBackgroundEnabled) {
            config.modResults = addBLEHardwareFeatureToManifest(config.modResults);
        }
        return config;
    });
};
exports.withBLEAndroidManifest = withBLEAndroidManifest;
function addFineControlPermissionToManifest(androidManifest) {
    var _a;
    // Add `<uses-permission-sdk-23 android:name="android.permission.ACCESS_FINE_LOCATION"/>` to the AndroidManifest.xml
    if (!Array.isArray(androidManifest.manifest["uses-permission-sdk-23"])) {
        androidManifest.manifest["uses-permission-sdk-23"] = [];
    }
    if (!androidManifest.manifest["uses-permission-sdk-23"].find((item) => item.$["android:name"] === "android.permission.ACCESS_FINE_LOCATION")) {
        (_a = androidManifest.manifest["uses-permission-sdk-23"]) === null || _a === void 0 ? void 0 : _a.push({
            $: {
                "android:name": "android.permission.ACCESS_FINE_LOCATION",
            },
        });
    }
    return androidManifest;
}
exports.addFineControlPermissionToManifest = addFineControlPermissionToManifest;
// Add this line if your application always requires BLE. More info can be found on: https://developer.android.com/guide/topics/connectivity/bluetooth-le.html#permissions
function addBLEHardwareFeatureToManifest(androidManifest) {
    var _a;
    // Add `<uses-feature android:name="android.hardware.bluetooth_le" android:required="true"/>` to the AndroidManifest.xml
    if (!Array.isArray(androidManifest.manifest["uses-feature"])) {
        androidManifest.manifest["uses-feature"] = [];
    }
    if (!androidManifest.manifest["uses-feature"].find((item) => item.$["android:name"] === "android.hardware.bluetooth_le")) {
        (_a = androidManifest.manifest["uses-feature"]) === null || _a === void 0 ? void 0 : _a.push({
            $: {
                "android:name": "android.hardware.bluetooth_le",
                "android:required": "true",
            },
        });
    }
    return androidManifest;
}
exports.addBLEHardwareFeatureToManifest = addBLEHardwareFeatureToManifest;
