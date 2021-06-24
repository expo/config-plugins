import { ConfigPlugin, AndroidConfig } from "@expo/config-plugins";
declare type InnerManifest = AndroidConfig.Manifest.AndroidManifest['manifest'];
declare type ManifestPermission = InnerManifest["permission"];
declare type AndroidManifest = {
    manifest: InnerManifest & {
        permission?: ManifestPermission;
        "uses-permission"?: InnerManifest["uses-permission"];
        "uses-permission-sdk-23"?: InnerManifest["uses-permission"];
        "uses-feature"?: InnerManifest["uses-feature"];
    };
};
export declare const withBLEAndroidManifest: ConfigPlugin<{
    isBackgroundEnabled: boolean;
}>;
export declare function addFineControlPermissionToManifest(androidManifest: AndroidManifest): AndroidManifest;
export declare function addBLEHardwareFeatureToManifest(androidManifest: AndroidConfig.Manifest.AndroidManifest): AndroidConfig.Manifest.AndroidManifest;
export {};
