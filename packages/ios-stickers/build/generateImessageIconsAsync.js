"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateImessageIconsAsync = void 0;
const image_utils_1 = require("@expo/image-utils");
const fs_1 = __importDefault(require("fs"));
const path_1 = require("path");
const IMAGE_CACHE_NAME = "ios-stickers-icons";
// Hard-coding seemed like the clearest and safest way to implement the sizes.
const ICON_CONTENTS = [
    {
        idiom: "iphone",
        sizes: [
            {
                size: 29,
                scales: [2, 3],
            },
            {
                size: [60, 45],
                scales: [2, 3],
            },
        ],
    },
    {
        idiom: "ipad",
        sizes: [
            {
                size: 29,
                scales: [2],
            },
            {
                size: [67, 50],
                scales: [2],
            },
            {
                size: [74, 55],
                scales: [2],
            },
        ],
    },
    {
        idiom: "universal",
        sizes: [
            {
                platform: "ios",
                size: [27, 20],
                scales: [2, 3],
            },
            {
                platform: "ios",
                size: [32, 24],
                scales: [2, 3],
            },
        ],
    },
    {
        idiom: "ios-marketing",
        sizes: [
            {
                size: 1024,
                scales: [1],
            },
            {
                platform: "ios",
                size: [1024, 768],
                scales: [1],
            },
        ],
    },
];
async function generateImessageIconsAsync(projectRoot, icon, iconsPath) {
    // Ensure the Images.xcassets/AppIcon.appiconset path exists
    fs_1.default.mkdirSync(iconsPath, { recursive: true });
    // Store the image JSON data for assigning via the Contents.json
    const imagesJson = [];
    // keep track of icons that have been generated so we can reuse them in the Contents.json
    const generatedIcons = {};
    for (const platform of ICON_CONTENTS) {
        // const isMarketing = platform.idiom === 'ios-marketing';
        for (const { size, scales, ...rest } of platform.sizes) {
            for (const scale of scales) {
                // The marketing icon is special because it makes no sense.
                const filename = getAppleIconName(size, scale, platform.idiom);
                // Only create an image that hasn't already been generated.
                const [width, height] = Array.isArray(size) ? size : [size, size];
                if (!(filename in generatedIcons)) {
                    const iconWSizePx = width * scale;
                    const iconHSizePx = height * scale;
                    // Using this method will cache the images in `.expo` based on the properties used to generate them.
                    // this method also supports remote URLs and using the global sharp instance.
                    const { source } = await (0, image_utils_1.generateImageAsync)({ projectRoot, cacheType: IMAGE_CACHE_NAME }, {
                        src: icon,
                        name: filename,
                        width: iconWSizePx,
                        height: iconHSizePx,
                        removeTransparency: true,
                        // The icon should be square, but if it's not then it will be cropped.
                        resizeMode: "cover",
                        // Force the background color to solid white to prevent any transparency.
                        // TODO: Maybe use a more adaptive option based on the icon color?
                        backgroundColor: "#ffffff",
                    });
                    // Write image buffer to the file system.
                    const assetPath = (0, path_1.join)(iconsPath, filename);
                    await fs_1.default.promises.writeFile(assetPath, source);
                    // Save a reference to the generated image so we don't create a duplicate.
                    generatedIcons[filename] = true;
                }
                const imgJson = {
                    filename,
                    idiom: platform.idiom,
                    scale: `${scale}x`,
                    size: `${width}x${height}`,
                };
                // This order closely matches Xcode formatting.
                imagesJson.push(imgJson);
                if (rest.platform) {
                    imgJson.platform = rest.platform;
                }
            }
        }
    }
    return imagesJson;
}
exports.generateImessageIconsAsync = generateImessageIconsAsync;
function getAppleIconName(size, scale, idiom) {
    const [width, height] = Array.isArray(size) ? size : [size, size];
    return `App-Icon-${idiom}-${width}x${height}@${scale}x.png`;
}
