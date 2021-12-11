import { AndroidConfig } from "@expo/config-plugins";
import type { ConfigPlugin, ExportedConfigWithProps } from "@expo/config-plugins";
import type { MergeResults } from "@expo/config-plugins/build/utils/generateCode";
export declare function editMainApplication(config: ExportedConfigWithProps, action: (mainApplication: string) => string): Promise<void>;
export declare function editProguardRules(config: ExportedConfigWithProps, action: (mainApplication: string) => string): Promise<void>;
export declare function addBranchMainApplicationImport(src: string, packageId: string): MergeResults;
export declare function addBranchGetAutoInstance(src: string): MergeResults;
export declare function addBranchMainActivityImport(src: string, packageId: string): MergeResults;
export declare function addBranchInitSession(src: string): MergeResults;
export declare function addBranchOnNewIntent(src: string): MergeResults;
export declare function setCustomConfigAsync(config: ExportedConfigWithProps<AndroidConfig.Manifest.AndroidManifest>, androidManifest: AndroidConfig.Manifest.AndroidManifest, branchApiKey: string): Promise<AndroidConfig.Manifest.AndroidManifest>;
export declare const withBranchAndroid: ConfigPlugin<{
    apiKey: string;
}>;
