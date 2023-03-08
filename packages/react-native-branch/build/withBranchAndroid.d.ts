import { ExpoConfig } from "expo/config";
import { AndroidConfig, ConfigPlugin } from "expo/config-plugins";
export declare function getBranchApiKey(config: ExpoConfig): string | null;
export declare function setBranchApiKey(apiKey: string, androidManifest: AndroidConfig.Manifest.AndroidManifest): AndroidConfig.Manifest.AndroidManifest;
export declare const withBranchAndroid: ConfigPlugin<{
    apiKey?: string;
}>;
