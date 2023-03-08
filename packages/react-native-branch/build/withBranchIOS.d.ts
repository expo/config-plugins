import { ExpoConfig } from "expo/config";
import { ConfigPlugin, InfoPlist } from "expo/config-plugins";
import { ConfigData } from "./types";
export declare function getBranchApiKey(config: Pick<ExpoConfig, "ios">): string | null;
export declare function setBranchApiKey(apiKey: string | null, infoPlist: InfoPlist): InfoPlist;
export declare const withBranchIOS: ConfigPlugin<ConfigData>;
