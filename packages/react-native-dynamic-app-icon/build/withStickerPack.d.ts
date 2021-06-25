import { ConfigPlugin } from "@expo/config-plugins";
import { Props, Sticker } from "./withStickerAssets";
export declare function normalizeStickersProps(props?: Props["stickers"]): Sticker[];
declare const withStickerPack: ConfigPlugin<Props>;
export default withStickerPack;
