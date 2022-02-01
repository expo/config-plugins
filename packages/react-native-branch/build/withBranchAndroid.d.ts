import { AndroidConfig } from "@expo/config-plugins";
import type { ConfigPlugin } from "@expo/config-plugins";
import type { ExpoConfig } from "@expo/config-types";
export declare function getBranchApiKey(config: ExpoConfig): string | null;
export declare function setBranchApiKey(apiKey: string, androidManifest: AndroidConfig.Manifest.AndroidManifest): AndroidConfig.Manifest.AndroidManifest;
export declare const withBranchAndroid: ConfigPlugin<{
    apiKey?: string;
}>;
