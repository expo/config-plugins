import { AndroidConfig } from "@expo/config-plugins";
import type { ConfigPlugin } from "@expo/config-plugins";
import type { ExpoConfig } from "@expo/config-types";
import type { MergeResults } from "@expo/config-plugins/build/utils/generateCode";
export declare function modifyMainApplication(mainApplication: string, language: "java" | "kt"): string;
export declare function addBranchInitSession(src: string): MergeResults;
export declare function addBranchOnNewIntent(src: string): MergeResults;
export declare function getBranchApiKey(config: ExpoConfig): string | null;
export declare function setBranchApiKey(apiKey: string, androidManifest: AndroidConfig.Manifest.AndroidManifest): AndroidConfig.Manifest.AndroidManifest;
export declare const modifyMainActivity: (mainActivity: string, language: "java" | "kt") => string;
export declare const withBranchAndroid: ConfigPlugin<{
    apiKey?: string;
}>;
