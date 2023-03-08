"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addPackageName = exports.withAndroidFFMPEGPackage = void 0;
const generateCode_1 = require("@expo/config-plugins/build/utils/generateCode");
const config_plugins_1 = require("expo/config-plugins");
const withAndroidFFMPEGPackage = (config, packageName) => {
    config = (0, config_plugins_1.withProjectBuildGradle)(config, (config) => {
        if (config.modResults.language === "groovy") {
            config.modResults.contents = addPackageName(config.modResults.contents, packageName);
        }
        else {
            throw new Error("Cannot add camera maven gradle because the build.gradle is not groovy");
        }
        return config;
    });
    config = withLibCppSharedSo(config);
    return config;
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
// This is required if you have several libraries which include libc++_shared.so as a dependency.
// See https://github.com/tanersener/ffmpeg-kit/wiki/Tips#2-depending-another-android-library-containing-libc_sharedso
function withLibCppSharedSo(config) {
    return (0, config_plugins_1.withGradleProperties)(config, (config) => {
        config.modResults.push({
            type: "property",
            key: "android.packagingOptions.pickFirsts",
            value: "lib/x86/libc++_shared.so,lib/x86_64/libc++_shared.so,lib/armeabi-v7a/libc++_shared.so,lib/arm64-v8a/libc++_shared.so",
        });
        return config;
    });
}
