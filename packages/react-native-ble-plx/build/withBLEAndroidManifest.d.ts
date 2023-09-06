import { AndroidConfig, ConfigPlugin } from "expo/config-plugins";
type InnerManifest = AndroidConfig.Manifest.AndroidManifest["manifest"];
type ManifestPermission = InnerManifest["permission"];
type ExtraTools = {
  "tools:targetApi"?: string;
};
type ManifestUsesPermissionWithExtraTools = {
  $: AndroidConfig.Manifest.ManifestUsesPermission["$"] & ExtraTools;
};
type AndroidManifest = {
  manifest: InnerManifest & {
    permission?: ManifestPermission;
    "uses-permission"?: ManifestUsesPermissionWithExtraTools[];
    "uses-permission-sdk-23"?: ManifestUsesPermissionWithExtraTools[];
    "uses-feature"?: InnerManifest["uses-feature"];
  };
};
export declare const withBLEAndroidManifest: ConfigPlugin<{
  neverForLocation: boolean;
  isRequired: boolean;
  canDiscover: boolean;
  isDiscoverable: boolean;
  canConnect: boolean;
}>;
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
export declare function addLocationPermissionToManifest(
  androidManifest: AndroidManifest,
  neverForLocationSinceSdk31: boolean
): AndroidManifest;
export declare function addAdminBluetoothPermissionToManifest(
  androidManifest: AndroidManifest,
  canDiscover: boolean
): AndroidManifest;
export declare function addScanBluetoothPermissionToManifest(
  androidManifest: AndroidManifest,
  neverForLocation: boolean
): AndroidManifest;
/**
 * Mutates the given AndroidManifest to add the Bluetooth Low Energy (BLE) feature.
 * This is needed if the application always requires BLE.
 * More info on permissions involving BLE can be found here: https://developer.android.com/guide/topics/connectivity/bluetooth-le.html#permissions
 *
 * @param {AndroidConfig.Manifest.AndroidManifest} androidManifest - The manifest of the Android project.
 * @returns {AndroidConfig.Manifest.AndroidManifest} - The updated AndroidManifest with required BLE feature added.
 */
export declare function addBLEHardwareFeatureToManifest(
  androidManifest: AndroidConfig.Manifest.AndroidManifest
): AndroidConfig.Manifest.AndroidManifest;
export declare function addConnectBluetoothPermissionToManifest(
  androidManifest: AndroidConfig.Manifest.AndroidManifest
): AndroidConfig.Manifest.AndroidManifest;
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
export declare function addBluetoothDiscoverablePermissionToManifest(
  androidManifest: AndroidManifest
): AndroidConfig.Manifest.AndroidManifest;
export {};
