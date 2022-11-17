"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addPackageName = exports.withAndroidFFMPEGPackage = void 0;
const config_plugins_1 = require("@expo/config-plugins");
const generateCode_1 = require("@expo/config-plugins/build/utils/generateCode");
const withAndroidFFMPEGPackage = (config, packageName) => {
    return (0, config_plugins_1.withProjectBuildGradle)(config, (config) => {
        if (config.modResults.language === "groovy") {
            config.modResults.contents = addPackageName(config.modResults.contents, packageName);
        }
        else {
            throw new Error("Cannot add camera maven gradle because the build.gradle is not groovy");
        }
        return config;
    });
};
exports.withAndroidFFMPEGPackage = withAndroidFFMPEGPackage;
function addPackageName(src, packageName) {
    const tag = "ffmpeg-kit-react-native-package";
    const gradleMaven = packageName
        ? `ext { ffmpegKitPackage = "${packageName}" }`
        : "";
    return appendContents({
        tag,
        src,
        newSrc: gradleMaven,
        comment: "//",
    }).contents;
}
exports.addPackageName = addPackageName;
// Fork of config-plugins mergeContents, but appends the contents to the end of the file.
function appendContents({ src, newSrc, tag, comment, }) {
    const header = (0, generateCode_1.createGeneratedHeaderComment)(newSrc, tag, comment);
    if (!src.includes(header)) {
        // Ensure the old generated contents are removed.
        let sanitizedTarget = (0, generateCode_1.removeGeneratedContents)(src, tag);
        if (sanitizedTarget)
            sanitizedTarget += "\n";
        const contentsToAdd = [
            // @something
            header,
            // contents
            newSrc,
            // @end
            `${comment} @generated end ${tag}`,
        ].join("\n");
        return {
            contents: (sanitizedTarget ?? src) + contentsToAdd,
            didMerge: true,
            didClear: !!sanitizedTarget,
        };
    }
    return { contents: src, didClear: false, didMerge: false };
}
