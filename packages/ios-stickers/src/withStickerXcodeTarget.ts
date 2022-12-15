import { ConfigPlugin, withXcodeProject } from "@expo/config-plugins";

import { Props } from "./withStickerAssets";
import {
  addStickerResourceFile,
  addStickersTarget,
  getMainPBXGroup,
} from "./xcodeSticker";

const STICKERS_ROOT_PATH = "Stickers.xcassets";

export function getProjectStickersName(name: string) {
  return `${name} Stickers`;
}

export const withStickerXcodeTarget: ConfigPlugin<
  Pick<Props, "stickerBundleId">
> = (config, { stickerBundleId }) => {
  return withXcodeProject(config, (config) => {
    const stickerPackName = getProjectStickersName(
      config.modRequest.projectName!
    );

    addStickersTarget(
      config.modResults,
      stickerPackName,
      config.ios!.bundleIdentifier!,
      stickerPackName,
      stickerBundleId
    );

    const stickersKey = addStickerResourceFile(
      config.modResults,
      STICKERS_ROOT_PATH,
      stickerPackName
    );

    if (stickersKey) {
      const mainGroup = getMainPBXGroup(config.modResults);
      if (mainGroup) {
        config.modResults.addToPbxGroup(stickersKey, mainGroup.id);
      }
    }

    return config;
  });
};
