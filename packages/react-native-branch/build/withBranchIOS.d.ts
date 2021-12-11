import { MergeResults } from "@expo/config-plugins/build/utils/generateCode";
import type { ConfigPlugin } from "@expo/config-plugins";
import type { ConfigData } from "./types";
export declare function addBranchAppDelegateImport(src: string): MergeResults;
export declare function addBranchAppDelegateInit(src: string): MergeResults;
export declare function addBranchAppDelegateOpenURL(src: string): MergeResults;
export declare function addBranchAppDelegateContinueUserActivity(src: string): MergeResults;
export declare const withBranchIos: ConfigPlugin<ConfigData>;
