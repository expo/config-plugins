"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withStickerXcodeTarget = exports.getProjectStickersName = void 0;
const config_plugins_1 = require("@expo/config-plugins");
const xcodeSticker_1 = require("./xcodeSticker");
const STICKERS_ROOT_PATH = "Stickers.xcassets";
function getProjectStickersName(name) {
    return `${name} Stickers`;
}
exports.getProjectStickersName = getProjectStickersName;
const withStickerXcodeTarget = (config) => {
    return (0, config_plugins_1.withXcodeProject)(config, (config) => {
        const stickerPackName = getProjectStickersName(config.modRequest.projectName);
        (0, xcodeSticker_1.addStickersTarget)(config.modResults, stickerPackName, config.ios.bundleIdentifier, stickerPackName);
        const stickersKey = (0, xcodeSticker_1.addStickerResourceFile)(config.modResults, STICKERS_ROOT_PATH, stickerPackName);
        if (stickersKey) {
            const mainGroup = (0, xcodeSticker_1.getMainPBXGroup)(config.modResults);
            if (mainGroup) {
                config.modResults.addToPbxGroup(stickersKey, mainGroup.id);
            }
        }
        return config;
    });
};
exports.withStickerXcodeTarget = withStickerXcodeTarget;
