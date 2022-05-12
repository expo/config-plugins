"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_plugins_1 = require("@expo/config-plugins");
const image_utils_1 = require("@expo/image-utils");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// @ts-ignore
const pbxFile_1 = __importDefault(require("xcode/lib/pbxFile"));
const folderName = "DynamicAppIcons";
const size = 60;
const scales = [2, 3];
function arrayToImages(images) {
    return images.reduce((prev, curr, i) => ({ ...prev, [i]: { image: curr } }), {});
}
const withDynamicIcon = (config, props = {}) => {
    const _props = props || {};
    let prepped = {};
    if (Array.isArray(_props)) {
        prepped = arrayToImages(_props);
    }
    else if (_props) {
        prepped = _props;
    }
    config = withIconXcodeProject(config, { icons: prepped });
    config = withIconInfoPlist(config, { icons: prepped });
    config = withIconImages(config, { icons: prepped });
    return config;
};
function getIconName(name, size, scale) {
    const fileName = `${name}-Icon-${size}x${size}`;
    if (scale != null) {
        return `${fileName}@${scale}x.png`;
    }
    return fileName;
}
const withIconXcodeProject = (config, { icons }) => {
    return config_plugins_1.withXcodeProject(config, async (config) => {
        const groupPath = `${config.modRequest.projectName}/${folderName}`;
        const group = config_plugins_1.IOSConfig.XcodeUtils.ensureGroupRecursively(config.modResults, groupPath);
        const project = config.modResults;
        const opt = {};
        // Unlink old assets
        const groupId = Object.keys(project.hash.project.objects["PBXGroup"]).find((id) => {
            const _group = project.hash.project.objects["PBXGroup"][id];
            return _group.name === group.name;
        });
        if (!project.hash.project.objects["PBXVariantGroup"]) {
            project.hash.project.objects["PBXVariantGroup"] = {};
        }
        const variantGroupId = Object.keys(project.hash.project.objects["PBXVariantGroup"]).find((id) => {
            const _group = project.hash.project.objects["PBXVariantGroup"][id];
            return _group.name === group.name;
        });
        const children = [...(group.children || [])];
        for (const child of children) {
            const file = new pbxFile_1.default(path_1.default.join(group.name, child.comment), opt);
            file.target = opt ? opt.target : undefined;
            project.removeFromPbxBuildFileSection(file); // PBXBuildFile
            project.removeFromPbxFileReferenceSection(file); // PBXFileReference
            if (group) {
                if (groupId) {
                    project.removeFromPbxGroup(file, groupId); //Group other than Resources (i.e. 'splash')
                }
                else if (variantGroupId) {
                    project.removeFromPbxVariantGroup(file, variantGroupId); // PBXVariantGroup
                }
            }
            project.removeFromPbxResourcesBuildPhase(file); // PBXResourcesBuildPhase
        }
        // Link new assets
        await iterateIconsAsync({ icons }, async (key, icon, index) => {
            for (const scale of scales) {
                const iconFileName = getIconName(key, size, scale);
                if (!(group === null || group === void 0 ? void 0 : group.children.some(({ comment }) => comment === iconFileName))) {
                    // Only write the file if it doesn't already exist.
                    config.modResults = config_plugins_1.IOSConfig.XcodeUtils.addResourceFileToGroup({
                        filepath: path_1.default.join(groupPath, iconFileName),
                        groupName: groupPath,
                        project: config.modResults,
                        isBuildFile: true,
                        verbose: true,
                    });
                }
                else {
                    console.log("Skipping duplicate: ", iconFileName);
                }
            }
        });
        return config;
    });
};
const withIconInfoPlist = (config, { icons }) => {
    return config_plugins_1.withInfoPlist(config, async (config) => {
        const altIcons = {};
        await iterateIconsAsync({ icons }, async (key, icon) => {
            altIcons[key] = {
                CFBundleIconFiles: [
                    // Must be a file path relative to the source root (not a icon set it seems).
                    // i.e. `Bacon-Icon-60x60` when the image is `ios/somn/appIcons/Bacon-Icon-60x60@2x.png`
                    getIconName(key, size),
                ],
                UIPrerenderedIcon: !!icon.prerendered,
            };
        });
        function applyToPlist(key) {
            if (typeof config.modResults[key] !== "object" ||
                Array.isArray(config.modResults[key]) ||
                !config.modResults[key]) {
                config.modResults[key] = {};
            }
            // @ts-expect-error
            config.modResults[key].CFBundleAlternateIcons = altIcons;
            // @ts-expect-error
            config.modResults[key].CFBundlePrimaryIcon = {
                CFBundleIconFiles: ["AppIcon"],
            };
        }
        // Apply for both tablet and phone support
        applyToPlist("CFBundleIcons");
        applyToPlist("CFBundleIcons~ipad");
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
async function createIconsAsync(config, { icons }) {
    const iosRoot = path_1.default.join(config.modRequest.platformProjectRoot, config.modRequest.projectName);
    // Delete all existing assets
    await fs_1.default.promises
        .rmdir(path_1.default.join(iosRoot, folderName), { recursive: true })
        .catch(() => null);
    // Ensure directory exists
    await fs_1.default.promises.mkdir(path_1.default.join(iosRoot, folderName), { recursive: true });
    // Generate new assets
    await iterateIconsAsync({ icons }, async (key, icon) => {
        for (const scale of scales) {
            const iconFileName = getIconName(key, size, scale);
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
//# sourceMappingURL=index.js.map