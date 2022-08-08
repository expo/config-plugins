"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addDetoxImport = void 0;
const config_plugins_1 = require("@expo/config-plugins");
const generateCode_1 = require("@expo/config-plugins/build/utils/generateCode");
// Because we need the package to be added AFTER the React and Google maven packages, we create a new allprojects.
// It's ok to have multiple allprojects.repositories, so we create a new one since it's cheaper than tokenizing
// the existing block to find the correct place to insert our camera maven.
const gradleMaven = [
    `def detoxMavenPath = new File(["node", "--print", "require.resolve('detox/package.json')"].execute(null, rootDir).text.trim(), "../Detox-android")`,
    `allprojects { repositories { maven { url(detoxMavenPath) } } }`,
].join("\n");
/**
 * [Step 3](https://github.com/wix/Detox/blob/master/docs/Introduction.Android.md#3-add-the-native-detox-dependency) Add detox to the project build.gradle.
 * @param config
 */
const withDetoxProjectGradle = (config) => {
    return (0, config_plugins_1.withProjectBuildGradle)(config, (config) => {
        if (config.modResults.language === "groovy") {
            config.modResults.contents = addDetoxImport(config.modResults.contents).contents;
        }
        else {
            throw new Error("Cannot add Detox maven gradle because the project build.gradle is not groovy");
        }
        return config;
    });
};
function addDetoxImport(src) {
    return appendContents({
        tag: "detox-import",
        src,
        newSrc: gradleMaven,
        comment: "//",
    });
}
exports.addDetoxImport = addDetoxImport;
// Fork of config-plugins mergeContents, but appends the contents to the end of the file.
function appendContents({ src, newSrc, tag, comment, }) {
    const header = (0, generateCode_1.createGeneratedHeaderComment)(newSrc, tag, comment);
    if (!src.includes(header)) {
        // Ensure the old generated contents are removed.
        const sanitizedTarget = (0, generateCode_1.removeGeneratedContents)(src, tag);
        const contentsToAdd = [
            // @something
            header,
            // contents
            newSrc,
            // @end
            `${comment} @generated end ${tag}`,
        ].join("\n");
        return {
            contents: sanitizedTarget !== null && sanitizedTarget !== void 0 ? sanitizedTarget : src + contentsToAdd,
            didMerge: true,
            didClear: !!sanitizedTarget,
        };
    }
    return { contents: src, didClear: false, didMerge: false };
}
exports.default = withDetoxProjectGradle;
