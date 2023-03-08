import { ConfigPlugin, AndroidConfig } from "expo/config-plugins";
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
    isBackgroundEnabled: boolean;
    neverForLocation: boolean;
}>;
/**
 * Add location permissions
 *  - 'android.permission.ACCESS_COARSE_LOCATION' for Android SDK 28 (Android 9) and lower
 *  - 'android.permission.ACCESS_FINE_LOCATION' for Android SDK 29 (Android 10) and higher.
 *    From Android SDK 31 (Android 12) it might not be required if BLE is not used for location.
 */
export declare function addLocationPermissionToManifest(androidManifest: AndroidManifest, neverForLocationSinceSdk31: boolean): AndroidManifest;
/**
 * Add 'android.permission.BLUETOOTH_SCAN'.
 * Required since Android SDK 31 (Android 12).
 */
export declare function addScanPermissionToManifest(androidManifest: AndroidManifest, neverForLocation: boolean): AndroidManifest;
export declare function addBLEHardwareFeatureToManifest(androidManifest: AndroidConfig.Manifest.AndroidManifest): AndroidConfig.Manifest.AndroidManifest;
export {};
