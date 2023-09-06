"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addBluetoothDiscoverablePermissionToManifest = exports.addConnectBluetoothPermissionToManifest = exports.addBLEHardwareFeatureToManifest = exports.addScanBluetoothPermissionToManifest = exports.addAdminBluetoothPermissionToManifest = exports.addLocationPermissionToManifest = exports.withBLEAndroidManifest = void 0;
const config_plugins_1 = require("expo/config-plugins");
/**
 * Check if a certain permission exists on the manifest
 * @param {AndroidManifest} androidManifest - The AndroidManifest object
 * @param {string} permissionName - The permission to look for
 * @return {boolean}
 */
function isPermissionInManifest(androidManifest, permissionName) {
    if (Array.isArray(androidManifest.manifest["uses-permission"])) {
        const foundInUsesPermission = androidManifest.manifest["uses-permission"].find((item) => item.$["android:name"] === permissionName);
        if (foundInUsesPermission) {
            return true;
        }
    }
    if (Array.isArray(androidManifest.manifest["uses-permission-sdk-23"])) {
        const foundInUsesPermissionSDK23 = androidManifest.manifest["uses-permission-sdk-23"].find((item) => item.$["android:name"] === permissionName);
        if (foundInUsesPermissionSDK23) {
            return true;
        }
    }
    return false;
}
/**
 * Check if a certain permission exists on the manifest, add if not
 * @param {AndroidManifest} androidManifest - The AndroidManifest object
 * @param {string} permissionName - The permission to look for
 * @param {ManifestUsesPermissionWithExtraTools} permissions - Permissions details
 * @return {AndroidManifest}
 */
function addPermissionToManifestIfNotExists(androidManifest, permissionName, permissions) {
    const doesPermissionExist = isPermissionInManifest(androidManifest, permissionName);
    if (!doesPermissionExist) {
        androidManifest.manifest["uses-permission"] =
            androidManifest.manifest["uses-permission"] || [];
        androidManifest.manifest["uses-permission"].push({ $: permissions });
    }
    return androidManifest;
}
const withBLEAndroidManifest = (config, { neverForLocation, canDiscover, isRequired, isDiscoverable, canConnect }) => {
    return (0, config_plugins_1.withAndroidManifest)(config, (config) => {
        config.modResults = addLocationPermissionToManifest(config.modResults, neverForLocation);
        config.modResults = addScanBluetoothPermissionToManifest(config.modResults, neverForLocation);
        config.modResults = addAdminBluetoothPermissionToManifest(config.modResults, canDiscover);
        if (isRequired) {
            config.modResults = addBLEHardwareFeatureToManifest(config.modResults);
        }
        if (canConnect) {
            config.modResults = addConnectBluetoothPermissionToManifest(config.modResults);
        }
        if (isDiscoverable) {
            config.modResults = addBluetoothDiscoverablePermissionToManifest(config.modResults);
        }
        // Add 'android.permission.BLUETOOTH' to the AndroidManifest if it doesn't exist
        // This permission is required for compatibility with older Android devices
        config.modResults = addPermissionToManifestIfNotExists(config.modResults, "android.permission.BLUETOOTH", {
            "android:name": "android.permission.BLUETOOTH",
            ...{ "android:maxSdkVersion": "30" },
        });
        return config;
    });
};
exports.withBLEAndroidManifest = withBLEAndroidManifest;
/**
 * Mutates the given AndroidManifest to add necessary location permissions.
 *
 * @param {AndroidManifest} androidManifest - The manifest of the Android project.
 * @param {boolean} neverForLocationSinceSdk31 - Flag to control if location permission is required for Android SDK 31 and higher.
 *                                               If flag is set, 'ACCESS_FINE_LOCATION' only applies to SDK 30 and lower, else it applies to all.
 *
 * 'android.permission.ACCESS_FINE_LOCATION' is included for Android SDK 29 (Android 10) and higher.
 * However, from Android SDK 31 (Android 12) onwards, it might not be necessary if BLE is not used for location.
 * More details can be found on: https://developer.android.com/guide/topics/connectivity/bluetooth/permissions#declare-android11-or-lower
 *
 * @returns {AndroidManifest} - The updated AndroidManifest with the necessary location permissions added.
 */
function addLocationPermissionToManifest(androidManifest, neverForLocationSinceSdk31) {
    // The 'ACCESS_FINE_LOCATION' permission is optional from Android SDK 31 (Android 12) onwards when BLE is not used for location
    const optionalMaxVersion = neverForLocationSinceSdk31
        ? { "android:maxSdkVersion": "30" }
        : {};
    // Add 'android.permission.ACCESS_FINE_LOCATION' to the AndroidManifest if it doesn't exist
    return addPermissionToManifestIfNotExists(androidManifest, "android.permission.ACCESS_FINE_LOCATION", {
        "android:name": "android.permission.ACCESS_FINE_LOCATION",
        ...optionalMaxVersion,
    });
}
exports.addLocationPermissionToManifest = addLocationPermissionToManifest;
function addAdminBluetoothPermissionToManifest(androidManifest, canDiscover) {
    // Add 'android.permission.BLUETOOTH_ADMIN' to the manifest.
    // If 'canDiscover' is true, this permission is not restricted to older devices
    // Need to add permission to support older devices
    return addPermissionToManifestIfNotExists(androidManifest, "android.permission.BLUETOOTH_ADMIN", {
        "android:name": "android.permission.BLUETOOTH_ADMIN",
        ...(canDiscover ? {} : { "android:maxSdkVersion": "30" }),
    });
}
exports.addAdminBluetoothPermissionToManifest = addAdminBluetoothPermissionToManifest;
function addScanBluetoothPermissionToManifest(androidManifest, neverForLocation) {
    // Add 'android.permission.BLUETOOTH_SCAN' to the AndroidManifest if it doesn't exist
    return addPermissionToManifestIfNotExists(androidManifest, "android.permission.BLUETOOTH_SCAN", {
        "android:name": "android.permission.BLUETOOTH_SCAN",
        ...(neverForLocation
            ? { "android:usesPermissionFlags": "neverForLocation" }
            : {}),
        "tools:targetApi": "31",
    });
}
exports.addScanBluetoothPermissionToManifest = addScanBluetoothPermissionToManifest;
/**
 * Mutates the given AndroidManifest to add the Bluetooth Low Energy (BLE) feature.
 * This is needed if the application always requires BLE.
 * More info on permissions involving BLE can be found here: https://developer.android.com/guide/topics/connectivity/bluetooth-le.html#permissions
 *
 * @param {AndroidConfig.Manifest.AndroidManifest} androidManifest - The manifest of the Android project.
 * @returns {AndroidConfig.Manifest.AndroidManifest} - The updated AndroidManifest with required BLE feature added.
 */
function addBLEHardwareFeatureToManifest(androidManifest) {
    // Check if 'uses-feature' array exists in the AndroidManifest, if not, initialize it
    if (!Array.isArray(androidManifest.manifest["uses-feature"])) {
        androidManifest.manifest["uses-feature"] = [];
    }
    // Check if the 'uses-feature' for "android.hardware.bluetooth_le" has already been declared, if not, declare it
    const isBleFeatureDeclared = androidManifest.manifest["uses-feature"].find((item) => item.$["android:name"] === "android.hardware.bluetooth_le");
    // If 'android.hardware.bluetooth_le' feature is not declared, we add it into the AndroidManifest
    if (!isBleFeatureDeclared) {
        androidManifest.manifest["uses-feature"].push({
            $: {
                "android:name": "android.hardware.bluetooth_le",
                "android:required": "true", // Set as a required feature
            },
        });
    }
    // Return the updated AndroidManifest
    return androidManifest;
}
exports.addBLEHardwareFeatureToManifest = addBLEHardwareFeatureToManifest;
function addConnectBluetoothPermissionToManifest(androidManifest) {
    return addPermissionToManifestIfNotExists(androidManifest, "android.permission.BLUETOOTH_CONNECT", {
        "android:name": "android.permission.BLUETOOTH_CONNECT",
    });
}
exports.addConnectBluetoothPermissionToManifest = addConnectBluetoothPermissionToManifest;
/**
 * Mutates the given AndroidManifest to add the 'BLUETOOTH_ADVERTISE' permission.
 *
 * @param {AndroidManifest} androidManifest - The manifest of the Android project.
 *
 * This function adds 'android.permission.BLUETOOTH_ADVERTISE' to the AndroidManifest if it doesn't exist.
 * This permission is needed if your app makes the device discoverable to other Bluetooth devices. It allows the app
 * to broadcast that it's open for connections to other devices that are scanning for advertisements.
 *
 * @returns {AndroidConfig.Manifest.AndroidManifest} - The updated AndroidManifest with the Bluetooth advertise permissions added.
 */
function addBluetoothDiscoverablePermissionToManifest(androidManifest) {
    // Add 'android.permission.BLUETOOTH_ADVERTISE' to the AndroidManifest if it doesn't exist
    return addPermissionToManifestIfNotExists(androidManifest, "android.permission.BLUETOOTH_ADVERTISE", {
        "android:name": "android.permission.BLUETOOTH_ADVERTISE",
    });
}
exports.addBluetoothDiscoverablePermissionToManifest = addBluetoothDiscoverablePermissionToManifest;
