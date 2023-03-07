"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withStickersPlist = void 0;
const config_plugins_1 = require("expo/config-plugins");
const plist_1 = __importDefault(require("@expo/plist"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const withStickerXcodeTarget_1 = require("./withStickerXcodeTarget");
const withStickersPlist = (config, { name }) => {
    return (0, config_plugins_1.withDangerousMod)(config, [
        "ios",
        async (config) => {
            const stickerPackName = (0, withStickerXcodeTarget_1.getProjectStickersName)(config.modRequest.projectName);
            const stickerRootPath = path.join(config.modRequest.platformProjectRoot, stickerPackName);
            const filePath = path.join(stickerRootPath, "Info.plist");
            const stickers = {
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
            stickers.CFBundleVersion = config_plugins_1.IOSConfig.Version.getBuildNumber(config);
            stickers.CFBundleShortVersionString =
                config_plugins_1.IOSConfig.Version.getVersion(config);
            await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
            await fs.promises.writeFile(filePath, plist_1.default.build(stickers));
            return config;
        },
    ]);
};
exports.withStickersPlist = withStickersPlist;
