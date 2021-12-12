import { AndroidConfig } from "@expo/config-plugins";
import type { ConfigPlugin, ExportedConfigWithProps } from "@expo/config-plugins";
import type { ExpoConfig } from "@expo/config-types";
import type { MergeResults } from "@expo/config-plugins/build/utils/generateCode";
export declare function editMainApplication(config: ExportedConfigWithProps, action: (mainApplication: string) => string): Promise<void>;
export declare function editProguardRules(config: ExportedConfigWithProps, action: (mainApplication: string) => string): Promise<void>;
export declare function addBranchMainApplicationImport(src: string, packageId: string): MergeResults;
export declare function addBranchGetAutoInstance(src: string): MergeResults;
export declare function addBranchMainActivityImport(src: string, packageId: string): MergeResults;
export declare function addBranchInitSession(src: string): MergeResults;
export declare function addBranchOnNewIntent(src: string): MergeResults;
export declare function getBranchApiKey(config: ExpoConfig): string | null;
export declare function setBranchApiKey(apiKey: string, androidManifest: AndroidConfig.Manifest.AndroidManifest): AndroidConfig.Manifest.AndroidManifest;
export declare const withBranchAndroid: ConfigPlugin<{
    apiKey?: string;
}>;
