"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addBLEHardwareFeatureToManifest = exports.addScanPermissionToManifest = exports.addLocationPermissionToManifest = exports.withBLEAndroidManifest = void 0;
const config_plugins_1 = require("expo/config-plugins");
const withBLEAndroidManifest = (config, { isBackgroundEnabled, neverForLocation }) => {
    return (0, config_plugins_1.withAndroidManifest)(config, (config) => {
        config.modResults = addLocationPermissionToManifest(config.modResults, neverForLocation);
        config.modResults = addScanPermissionToManifest(config.modResults, neverForLocation);
        if (isBackgroundEnabled) {
            config.modResults = addBLEHardwareFeatureToManifest(config.modResults);
        }
        return config;
    });
};
exports.withBLEAndroidManifest = withBLEAndroidManifest;
/**
 * Add location permissions
 *  - 'android.permission.ACCESS_COARSE_LOCATION' for Android SDK 28 (Android 9) and lower
 *  - 'android.permission.ACCESS_FINE_LOCATION' for Android SDK 29 (Android 10) and higher.
 *    From Android SDK 31 (Android 12) it might not be required if BLE is not used for location.
 */
function addLocationPermissionToManifest(androidManifest, neverForLocationSinceSdk31) {
    if (!Array.isArray(androidManifest.manifest["uses-permission-sdk-23"])) {
        androidManifest.manifest["uses-permission-sdk-23"] = [];
    }
    const optMaxSdkVersion = neverForLocationSinceSdk31
        ? {
            "android:maxSdkVersion": "30",
        }
        : {};
    if (!androidManifest.manifest["uses-permission-sdk-23"].find((item) => item.$["android:name"] === "android.permission.ACCESS_COARSE_LOCATION")) {
        androidManifest.manifest["uses-permission-sdk-23"].push({
            $: {
                "android:name": "android.permission.ACCESS_COARSE_LOCATION",
                ...optMaxSdkVersion,
            },
        });
    }
    if (!androidManifest.manifest["uses-permission-sdk-23"].find((item) => item.$["android:name"] === "android.permission.ACCESS_FINE_LOCATION")) {
        androidManifest.manifest["uses-permission-sdk-23"].push({
            $: {
                "android:name": "android.permission.ACCESS_FINE_LOCATION",
                ...optMaxSdkVersion,
            },
        });
    }
    return androidManifest;
}
exports.addLocationPermissionToManifest = addLocationPermissionToManifest;
/**
 * Add 'android.permission.BLUETOOTH_SCAN'.
 * Required since Android SDK 31 (Android 12).
 */
function addScanPermissionToManifest(androidManifest, neverForLocation) {
    if (!Array.isArray(androidManifest.manifest["uses-permission"])) {
        androidManifest.manifest["uses-permission"] = [];
    }
    if (!androidManifest.manifest["uses-permission"].find((item) => item.$["android:name"] === "android.permission.BLUETOOTH_SCAN")) {
        config_plugins_1.AndroidConfig.Manifest.ensureToolsAvailable(androidManifest);
        androidManifest.manifest["uses-permission"]?.push({
            $: {
                "android:name": "android.permission.BLUETOOTH_SCAN",
                ...(neverForLocation
                    ? {
                        "android:usesPermissionFlags": "neverForLocation",
                    }
                    : {}),
                "tools:targetApi": "31",
            },
        });
    }
    return androidManifest;
}
exports.addScanPermissionToManifest = addScanPermissionToManifest;
// Add this line if your application always requires BLE. More info can be found on: https://developer.android.com/guide/topics/connectivity/bluetooth-le.html#permissions
function addBLEHardwareFeatureToManifest(androidManifest) {
    // Add `<uses-feature android:name="android.hardware.bluetooth_le" android:required="true"/>` to the AndroidManifest.xml
    if (!Array.isArray(androidManifest.manifest["uses-feature"])) {
        androidManifest.manifest["uses-feature"] = [];
    }
    if (!androidManifest.manifest["uses-feature"].find((item) => item.$["android:name"] === "android.hardware.bluetooth_le")) {
        androidManifest.manifest["uses-feature"]?.push({
            $: {
                "android:name": "android.hardware.bluetooth_le",
                "android:required": "true",
            },
        });
    }
    return androidManifest;
}
exports.addBLEHardwareFeatureToManifest = addBLEHardwareFeatureToManifest;
