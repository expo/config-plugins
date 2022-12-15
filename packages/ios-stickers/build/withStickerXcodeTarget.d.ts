import { ConfigPlugin } from "@expo/config-plugins";
import { Props } from "./withStickerAssets";
export declare function getProjectStickersName(name: string): string;
export declare const withStickerXcodeTarget: ConfigPlugin<Pick<Props, "stickerBundleId">>;
