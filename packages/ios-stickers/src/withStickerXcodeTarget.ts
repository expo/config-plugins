import { ConfigPlugin, withXcodeProject } from "@expo/config-plugins";

import {
  addStickerResourceFile,
  addStickersTarget,
  getMainPBXGroup,
} from "./xcodeSticker";

const STICKERS_ROOT_PATH = "Stickers.xcassets";

export function getProjectStickersName(name: string) {
  return `${name} Stickers`;
}

export const withStickerXcodeTarget: ConfigPlugin = (config) => {
  return withXcodeProject(config, (config) => {
    const stickerPackName = getProjectStickersName(
      config.modRequest.projectName!
    );

    addStickersTarget(
      config.modResults,
      stickerPackName,
      config.ios!.bundleIdentifier!,
      stickerPackName
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
