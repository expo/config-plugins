"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addIconFileToXcode = void 0;
const config_plugins_1 = require("@expo/config-plugins");
const image_utils_1 = require("@expo/image-utils");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const withDynamicIcon = (config, { icons } = {}) => {
    const prepped = Array.isArray(icons)
        ? icons.reduce((prev, curr, i) => ({ ...prev, [i]: { image: curr } }), {})
        : icons || {};
    config = withIconXcodeProject(config, { icons: prepped });
    config = withIconInfoPlist(config, { icons: prepped });
    config = withIconImages(config, { icons: prepped });
    return config;
};
const folderName = "dynamic-app-icons";
function getIconName(name, size, scale) {
    const fileName = `${name}-Icon-${size}x${size}`;
    if (scale != null) {
        return `${fileName}@${scale}x.png`;
    }
    return fileName;
}
function addIconFileToXcode({ projectRoot, project, projectName, fileName, }) {
    // const googleServiceFilePath = path.resolve(projectRoot, googleServicesFileRelativePath);
    // fs.copyFileSync(
    //   googleServiceFilePath,
    //   path.join(getSourceRoot(projectRoot), 'GoogleService-Info.plist')
    // );
    const plistFilePath = fileName; // `GoogleService-Info.plist`;
    if (!project.hasFile(plistFilePath)) {
        project = config_plugins_1.IOSConfig.XcodeUtils.addResourceFileToGroup({
            filepath: plistFilePath,
            groupName: `${projectName}/${folderName}`,
            project,
            isBuildFile: false,
            verbose: true,
        });
    }
    return project;
}
exports.addIconFileToXcode = addIconFileToXcode;
const withIconXcodeProject = (config, { icons }) => {
    return config_plugins_1.withXcodeProject(config, async (config) => {
        await iterateIconsAsync({ icons }, async (key, icon, index) => {
            for (const scale of scales) {
                const iconFileName = getIconName(String(index), size, scale);
                addIconFileToXcode({
                    projectRoot: config.modRequest.projectRoot,
                    projectName: config.modRequest.projectName,
                    project: config.modResults,
                    fileName: iconFileName,
                });
            }
        });
        return config;
    });
};
const withIconInfoPlist = (config, { icons }) => {
    return config_plugins_1.withInfoPlist(config, async (config) => {
        const altIcons = {};
        // 'CFBundleIcons~ipad'
        await iterateIconsAsync({ icons }, async (key, icon, index) => {
            const refFileName = `${folderName}/${getIconName(String(index), size)}`;
            altIcons[key] = {
                CFBundleIconFiles: [
                    // Must be a file path relative to the source root (not a icon set it seems).
                    // i.e. `appIcons/Bacon-Icon-60x60` when the image is `ios/somn/appIcons/Bacon-Icon-60x60@2x.png`
                    refFileName,
                ],
                UIPrerenderedIcon: !!icon.prerendered,
            };
        });
        if (typeof config.modResults.CFBundleIcons !== "object" ||
            Array.isArray(config.modResults.CFBundleIcons) ||
            !config.modResults.CFBundleIcons) {
            config.modResults.CFBundleIcons = {};
        }
        config.modResults.CFBundleIcons.CFBundleAlternateIcons = altIcons;
        config.modResults.CFBundleIcons.CFBundlePrimaryIcon = {
            CFBundleIconFiles: ["AppIcon"],
        };
        return config;
    });
};
const withIconImages = (config, props) => {
    return config_plugins_1.withDangerousMod(config, [
        "ios",
        async (config) => {
            await createIconsAsync(config, props);
            return config;
        },
    ]);
};
const size = 60;
const scales = [2, 3];
async function createIconsAsync(config, { icons }) {
    const iosRoot = path_1.default.join(config.modRequest.platformProjectRoot, config.modRequest.projectName);
    // Delete all existing assets...
    await fs_1.default.promises.rmdir(path_1.default.join(iosRoot, folderName), { recursive: true });
    await fs_1.default.promises.mkdir(path_1.default.join(iosRoot, folderName), { recursive: true });
    // Generate new assets...
    await iterateIconsAsync({ icons }, async (key, icon, index) => {
        for (const scale of scales) {
            const iconFileName = getIconName(String(index), size, scale);
            const fileName = path_1.default.join(folderName, iconFileName);
            const outputPath = path_1.default.join(iosRoot, fileName);
            const scaledSize = scale * size;
            const { source } = await image_utils_1.generateImageAsync({
                projectRoot: config.modRequest.projectRoot,
                cacheType: "react-native-dynamic-app-icon",
            }, {
                name: iconFileName,
                src: icon.image,
                removeTransparency: true,
                backgroundColor: "#ffffff",
                resizeMode: "cover",
                width: scaledSize,
                height: scaledSize,
            });
            await fs_1.default.promises.writeFile(outputPath, source);
        }
    });
}
async function iterateIconsAsync({ icons }, callback) {
    const entries = Object.entries(icons);
    for (let i = 0; i < entries.length; i++) {
        const [key, val] = entries[i];
        await callback(key, val, i);
    }
}
exports.default = withDynamicIcon;
