import { ConfigPlugin } from "@expo/config-plugins";

import { Props, Sticker, withStickerAssets } from "./withStickerAssets";
import { withStickersPlist } from "./withStickerInfoPlist";
import { withStickerXcodeTarget } from "./withStickerXcodeTarget";
import path from "path";

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

const withStickerPack: ConfigPlugin<Props> = (
  config,
  { stickers, icon, name, columns } = {}
) => {
  const size = sizeColumnMap[columns ?? 3];
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
  config = withStickerXcodeTarget(config);
  return config;
};

export default withStickerPack;
