"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeStickersProps = void 0;
const withStickerAssets_1 = require("./withStickerAssets");
const withStickerInfoPlist_1 = require("./withStickerInfoPlist");
const withStickerXcodeTarget_1 = require("./withStickerXcodeTarget");
const path_1 = __importDefault(require("path"));
// TODO: Maybe the name is better to use as a prop...
const sizeColumnMap = {
    4: "small",
    3: "regular",
    2: "large",
};
function normalizeStickersProps(props = []) {
    const imagesObj = props.map((prop) => {
        if (typeof prop === "string") {
            return { image: prop };
        }
        return prop;
    });
    // Apply names
    return imagesObj.map((sticker) => {
        sticker.name =
            sticker.name || path_1.default.basename(sticker.image, path_1.default.extname(sticker.image));
        return sticker;
    });
}
exports.normalizeStickersProps = normalizeStickersProps;
const withStickerPack = (config, { stickers, icon, name, columns } = {}) => {
    const size = sizeColumnMap[columns];
    if (!size) {
        throw new Error(`Column size "${columns}" is invalid. Expected one of: ${Object.keys(sizeColumnMap).join(", ")}`);
    }
    const _stickers = normalizeStickersProps(stickers);
    config = withStickerInfoPlist_1.withStickersPlist(config, { name });
    config = withStickerAssets_1.withStickerAssets(config, { stickers: _stickers, icon, size });
    config = withStickerXcodeTarget_1.withStickerXcodeTarget(config);
    return config;
};
exports.default = withStickerPack;
