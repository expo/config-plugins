import { generateImageAsync } from "@expo/image-utils";
import { type ConfigPlugin, withDangerousMod } from "expo/config-plugins";
import fs from "fs";
import path from "path";

import { generateImessageIconsAsync } from "./generateImessageIconsAsync";
import { getProjectStickersName } from "./withStickerXcodeTarget";

const STICKERS_ROOT_PATH = "Stickers.xcassets";

const IMESSAGE_APP_ICON_PATH =
  "Stickers.xcassets/iMessage App Icon.stickersiconset";

const STICKER_PACK_PATH = "Stickers.xcassets/Sticker Pack.stickerpack";

const defaultInfo = {
  author: "expo",
  version: 1,
};

const stickersRootContents = {
  info: defaultInfo,
};

function createSticker({
  stickerpackPath,
  name,
  imageBuffer,
  extension,
  accessibilityLabel,
}: {
  stickerpackPath: string;
  name: string;
  imageBuffer: Buffer;
  extension?: string;
  accessibilityLabel?: string;
}) {
  const stickerName = `${name}.sticker`;
  const stickerPath = path.join(stickerpackPath, stickerName);
  fs.mkdirSync(stickerPath, { recursive: true });

  // TODO: support other mime types
  const imageName = `image${extension || ".png"}`;

  const contents: {
    info: any;
    properties: { filename?: string; "accessibility-label"?: string };
  } = {
    info: defaultInfo,
    properties: {
      filename: imageName,
    },
  };

  // If undefined, defaults to the name of the sticker
  if (accessibilityLabel) {
    contents.properties["accessibility-label"] = accessibilityLabel;
  }

  fs.writeFileSync(path.join(stickerPath, imageName), imageBuffer);

  // Persist contents
  const contentsPath = path.join(stickerPath, "Contents.json");
  fs.writeFileSync(contentsPath, JSON.stringify(contents, null, 2));

  return {
    name: stickerName,
  };
}

/** Dangerously applies sticker assets to the iOS project. */
export const withStickerAssets: ConfigPlugin<{
  icon?: string;
  size: string;
  stickers: Sticker[];
}> = (config, { stickers, icon, size }) => {
  // Default to using the app icon
  if (!icon) {
    if (config.ios?.icon) {
      icon ??=
        typeof config.ios.icon === "string"
          ? config.ios.icon
          : (config.ios.icon.light ??
            config.ios.icon.dark ??
            config.ios.icon.tinted);
    }
    icon ||= config.icon;
  }

  return withDangerousMod(config, [
    "ios",
    async (config) => {
      const stickerPackName = getProjectStickersName(
        config.modRequest.projectName!,
      );

      const stickerRootPath = path.join(
        config.modRequest.platformProjectRoot,
        stickerPackName,
      );

      const stickersAssetsPath = path.join(stickerRootPath, STICKERS_ROOT_PATH);

      // Delete all assets...
      await fs.promises
        .rm(stickersAssetsPath, { recursive: true, force: true })
        .catch(() => null);

      const stickersRootContentsJsonPath = path.join(
        stickersAssetsPath,
        "Contents.json",
      );
      fs.mkdirSync(stickersAssetsPath, {
        recursive: true,
      });
      // Xcode has trouble with the Contents.json for marketing images
      fs.writeFileSync(
        stickersRootContentsJsonPath,
        JSON.stringify(stickersRootContents, null, 2),
      );

      // iMessage icon

      const iMessageAppIconsPath = path.join(
        stickerRootPath,
        IMESSAGE_APP_ICON_PATH,
      );
      // Only generate icons if an icon is defined
      const imessageIconContents = icon
        ? await generateImessageIconsAsync(
            config.modRequest.projectRoot,
            icon,
            iMessageAppIconsPath,
          )
        : [];
      const iMessageAppIconContentsJsonPath = path.join(
        iMessageAppIconsPath,
        "Contents.json",
      );
      fs.mkdirSync(iMessageAppIconsPath, {
        recursive: true,
      });

      fs.writeFileSync(
        iMessageAppIconContentsJsonPath,
        JSON.stringify(
          { images: imessageIconContents, info: defaultInfo },
          null,
          2,
        ),
      );

      const stickerPackContentsPath = path.join(
        stickerRootPath,
        STICKER_PACK_PATH,
      );

      const stickersContents: {
        info: any;
        properties: { "grid-size"?: string };
        stickers: { filename: string }[];
      } = {
        info: defaultInfo,
        properties: {
          "grid-size": size,
        },
        stickers: [],
      };

      if (Array.isArray(stickers)) {
        for (const sticker of stickers) {
          const src = typeof sticker === "string" ? sticker : sticker.image;

          // TODO: warn when image is bigger than 512000 bytes...

          // Using this method will cache the images in `.expo` based on the properties used to generate them.
          // this method also supports remote URLs and using the global sharp instance.
          // TODO: Support GIFs
          const { source, name: _name } = await generateImageAsync(
            {
              projectRoot: config.modRequest.projectRoot,
              cacheType: "ios-stickers",
            },
            {
              src,
            } as any,
          );

          // let results;
          const results = createSticker({
            stickerpackPath: stickerPackContentsPath,
            name: sticker.name || _name,
            imageBuffer: source,
            extension: path.extname(_name),
            accessibilityLabel: sticker.accessibilityLabel,
          });

          stickersContents.stickers.push({
            filename: results.name,
          });
        }
      }

      const stickerPackContentsJsonPath = path.join(
        stickerPackContentsPath,
        "Contents.json",
      );
      fs.mkdirSync(stickerPackContentsPath, {
        recursive: true,
      });
      // TODO
      fs.writeFileSync(
        stickerPackContentsJsonPath,
        JSON.stringify(stickersContents, null, 2),
      );

      return config;
    },
  ]);
};

export type Sticker = {
  image: string;
  name?: string;
  accessibilityLabel?: string;
};

export type Props = {
  stickers?: (string | Sticker)[];
  icon?: string;
  name?: string;
  stickerBundleId?: string;
  columns?: 2 | 3 | 4;
};
