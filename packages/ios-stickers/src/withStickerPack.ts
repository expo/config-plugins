import { ConfigPlugin } from "@expo/config-plugins";
import path from "path";
import { validate } from "schema-utils";

import schema from "./options.json";
import { Props, Sticker, withStickerAssets } from "./withStickerAssets";
import { withStickersPlist } from "./withStickerInfoPlist";
import { withStickerXcodeTarget } from "./withStickerXcodeTarget";

// TODO: Maybe the name is better to use as a prop...
const sizeColumnMap: Record<number, string> = {
  4: "small",
  3: "regular",
  2: "large",
};

export function normalizeStickersProps(
  props: Props["stickers"] = []
): Sticker[] {
  const imagesObj = props.map((prop) => {
    if (typeof prop === "string") {
      return { image: prop };
    }
    return prop;
  });

  // Apply names
  return imagesObj.map((sticker) => {
    sticker.name =
      sticker.name || path.basename(sticker.image, path.extname(sticker.image));
    return sticker;
  });
}

const withStickerPack: ConfigPlugin<Props> = (config, options = {}) => {
  // Perform option validation.
  validate(schema as any, options);

  const { stickers, icon, name, stickerBundleId, columns = 3 } = options;

  const size = sizeColumnMap[columns] || "regular";
  if (!size) {
    throw new Error(
      `Column size "${columns}" is invalid. Expected one of: ${Object.keys(
        sizeColumnMap
      ).join(", ")}`
    );
  }
  const _stickers = normalizeStickersProps(stickers);

  config = withStickersPlist(config, { name });
  config = withStickerAssets(config, { stickers: _stickers, icon, size });
  config = withStickerXcodeTarget(config, { stickerBundleId });
  return config;
};

export default withStickerPack;
