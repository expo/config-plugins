import { ConfigPlugin } from "expo/config-plugins";
/** Dangerously applies sticker assets to the iOS project. */
export declare const withStickerAssets: ConfigPlugin<{
    icon?: string;
    size: string;
    stickers: Sticker[];
}>;
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
