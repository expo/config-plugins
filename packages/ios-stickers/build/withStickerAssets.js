"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withStickerAssets = void 0;
const config_plugins_1 = require("@expo/config-plugins");
const image_utils_1 = require("@expo/image-utils");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const withStickerIcon_1 = require("./withStickerIcon");
const withStickerXcodeTarget_1 = require("./withStickerXcodeTarget");
const STICKERS_ROOT_PATH = "Stickers.xcassets";
const IMESSAGE_APP_ICON_PATH = "Stickers.xcassets/iMessage App Icon.stickersiconset";
const STICKER_PACK_PATH = "Stickers.xcassets/Sticker Pack.stickerpack";
const defaultInfo = {
    author: "expo",
    version: 1,
};
const stickersRootContents = {
    info: defaultInfo,
};
function createSticker({ stickerpackPath, name, imageBuffer, extension, accessibilityLabel, }) {
    const stickerName = `${name}.sticker`;
    const stickerPath = path_1.default.join(stickerpackPath, stickerName);
    fs_1.default.mkdirSync(stickerPath, { recursive: true });
    // TODO: support other mime types
    const imageName = `image${extension || ".png"}`;
    const contents = {
        info: defaultInfo,
        properties: {
            filename: imageName,
        },
    };
    // If undefined, defaults to the name of the sticker
    if (accessibilityLabel) {
        contents.properties["accessibility-label"] = accessibilityLabel;
    }
    fs_1.default.writeFileSync(path_1.default.join(stickerPath, imageName), imageBuffer);
    // Persist contents
    const contentsPath = path_1.default.join(stickerPath, "Contents.json");
    fs_1.default.writeFileSync(contentsPath, JSON.stringify(contents, null, 2));
    return {
        name: stickerName,
    };
}
/** Dangerously applies sticker assets to the iOS project. */
const withStickerAssets = (config, { stickers, icon, size }) => {
    // Default to using the app icon
    if (!icon) {
        icon = (config.ios || {}).icon || config.icon;
    }
    return config_plugins_1.withDangerousMod(config, [
        "ios",
        async (config) => {
            const stickerPackName = withStickerXcodeTarget_1.getProjectStickersName(config.modRequest.projectName);
            const stickerRootPath = path_1.default.join(config.modRequest.platformProjectRoot, stickerPackName);
            const stickersAssetsPath = path_1.default.join(stickerRootPath, STICKERS_ROOT_PATH);
            // Delete all assets...
            await fs_1.default.promises
                .rmdir(stickersAssetsPath, { recursive: true })
                .catch(() => null);
            const stickersRootContentsJsonPath = path_1.default.join(stickersAssetsPath, "Contents.json");
            fs_1.default.mkdirSync(stickersAssetsPath, {
                recursive: true,
            });
            // Xcode has trouble with the Contents.json for marketing images
            fs_1.default.writeFileSync(stickersRootContentsJsonPath, JSON.stringify(stickersRootContents, null, 2));
            // iMessage icon
            const iMessageAppIconsPath = path_1.default.join(stickerRootPath, IMESSAGE_APP_ICON_PATH);
            // Only generate icons if an icon is defined
            const imessageIconContents = icon
                ? await withStickerIcon_1.generateImessageIconsAsync(config.modRequest.projectRoot, icon, iMessageAppIconsPath)
                : [];
            const iMessageAppIconContentsJsonPath = path_1.default.join(iMessageAppIconsPath, "Contents.json");
            fs_1.default.mkdirSync(iMessageAppIconsPath, {
                recursive: true,
            });
            fs_1.default.writeFileSync(iMessageAppIconContentsJsonPath, JSON.stringify({ info: defaultInfo, images: imessageIconContents }, null, 2));
            const stickerPackContentsPath = path_1.default.join(stickerRootPath, STICKER_PACK_PATH);
            const stickersContents = {
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
                    const { source, name: _name } = await image_utils_1.generateImageAsync({
                        projectRoot: config.modRequest.projectRoot,
                        cacheType: "ios-stickers",
                    }, {
                        src,
                    });
                    // let results;
                    const results = createSticker({
                        stickerpackPath: stickerPackContentsPath,
                        name: sticker.name || _name,
                        imageBuffer: source,
                        extension: path_1.default.extname(_name),
                        accessibilityLabel: sticker.accessibilityLabel,
                    });
                    stickersContents.stickers.push({
                        filename: results.name,
                    });
                }
            }
            const stickerPackContentsJsonPath = path_1.default.join(stickerPackContentsPath, "Contents.json");
            fs_1.default.mkdirSync(stickerPackContentsPath, {
                recursive: true,
            });
            // TODO
            fs_1.default.writeFileSync(stickerPackContentsJsonPath, JSON.stringify(stickersContents, null, 2));
            return config;
        },
    ]);
};
exports.withStickerAssets = withStickerAssets;
