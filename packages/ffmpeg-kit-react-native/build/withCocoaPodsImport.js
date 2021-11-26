"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addCocoaPodsImport = exports.withCocoaPodsImport = exports.withPodfilePropertiesPackage = void 0;
const config_plugins_1 = require("@expo/config-plugins");
const ios_plugins_1 = require("@expo/config-plugins/build/plugins/ios-plugins");
const generateCode_1 = require("@expo/config-plugins/build/utils/generateCode");
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const withPodfilePropertiesPackage = (config, packageName) => {
    return ios_plugins_1.withPodfileProperties(config, (config) => {
        // @ts-ignore: wrong type
        config.modResults["ffmpeg-kit-react-native.subspecs"] = [
            packageName,
        ].filter(Boolean);
        return config;
    });
};
exports.withPodfilePropertiesPackage = withPodfilePropertiesPackage;
/** Dangerously adds the custom import to the CocoaPods. */
const withCocoaPodsImport = (c) => {
    return config_plugins_1.withDangerousMod(c, [
        "ios",
        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
        async (config) => {
            const file = path_1.default.join(config.modRequest.platformProjectRoot, "Podfile");
            const contents = await fs_1.promises.readFile(file, "utf8");
            await fs_1.promises.writeFile(file, addCocoaPodsImport(contents), "utf-8");
            return config;
        },
    ]);
};
exports.withCocoaPodsImport = withCocoaPodsImport;
function addCocoaPodsImport(src) {
    return generateCode_1.mergeContents({
        tag: `ffmpeg-kit-react-native-import`,
        src,
        newSrc: `  pod 'ffmpeg-kit-react-native', :subspecs => podfile_properties['ffmpeg-kit-react-native.subspecs'] || [], :podspec => File.join(File.dirname(\`node --print "require.resolve('ffmpeg-kit-react-native/package.json')"\`), "ffmpeg-kit-react-native.podspec")`,
        anchor: /use_native_modules/,
        // We can't go after the use_native_modules block because it might have parameters, causing it to be multi-line (see react-native template).
        offset: 0,
        comment: "#",
    }).contents;
}
exports.addCocoaPodsImport = addCocoaPodsImport;
