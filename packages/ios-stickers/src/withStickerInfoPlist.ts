import {
  ConfigPlugin,
  InfoPlist,
  IOSConfig,
  withDangerousMod,
} from "@expo/config-plugins";
import plist from "@expo/plist";
import * as fs from "fs";
import * as path from "path";

import { Props } from "./withStickerAssets";
import { getProjectStickersName } from "./withStickerXcodeTarget";

export const withStickersPlist: ConfigPlugin<Pick<Props, "name">> = (
  config,
  { name }
) => {
  return withDangerousMod(config, [
    "ios",
    async (config) => {
      const stickerPackName = getProjectStickersName(
        config.modRequest.projectName!
      );
      const stickerRootPath = path.join(
        config.modRequest.platformProjectRoot,
        stickerPackName
      );
      const filePath = path.join(stickerRootPath, "Info.plist");

      const stickers: InfoPlist = {
        CFBundleDevelopmentRegion: "$(DEVELOPMENT_LANGUAGE)",
        CFBundleExecutable: "$(EXECUTABLE_NAME)",
        CFBundleIdentifier: "$(PRODUCT_BUNDLE_IDENTIFIER)",
        CFBundleInfoDictionaryVersion: "6.0",
        CFBundleName: "$(PRODUCT_NAME)",
        CFBundlePackageType: "$(PRODUCT_BUNDLE_PACKAGE_TYPE)",
        NSExtension: {
          NSExtensionPointIdentifier: "com.apple.message-payload-provider",
          NSExtensionPrincipalClass: "StickerBrowserViewController",
        },
      };

      stickers.CFBundleDisplayName = name || stickerPackName;

      // The version numbers must match the main Info.plist
      stickers.CFBundleVersion = IOSConfig.Version.getBuildNumber(config);
      stickers.CFBundleShortVersionString =
        IOSConfig.Version.getVersion(config);

      await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
      await fs.promises.writeFile(filePath, plist.build(stickers));

      return config;
    },
  ]);
};
