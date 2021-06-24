"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withAndroidGoogleCast = void 0;
const config_plugins_1 = require("@expo/config-plugins");
const generateCode_1 = require("@expo/config-plugins/build/utils/generateCode");
const fs_1 = __importDefault(require("fs"));
const { addMetaDataItemToMainApplication, getMainApplicationOrThrow } = config_plugins_1.AndroidConfig.Manifest;
const META_PROVIDER_CLASS = "com.google.android.gms.cast.framework.OPTIONS_PROVIDER_CLASS_NAME";
const META_RECEIVER_APP_ID = "com.reactnative.googlecast.RECEIVER_APPLICATION_ID";
const withAndroidManifestCast = (config, { receiverAppId } = {}) => {
    return config_plugins_1.withAndroidManifest(config, (config) => {
        const mainApplication = getMainApplicationOrThrow(config.modResults);
        addMetaDataItemToMainApplication(mainApplication, META_PROVIDER_CLASS, 
        // This is the native Java class
        "com.reactnative.googlecast.GoogleCastOptionsProvider");
        if (receiverAppId) {
            addMetaDataItemToMainApplication(mainApplication, META_RECEIVER_APP_ID, receiverAppId);
        }
        return config;
    });
};
const withAppBuildGradleImport = (config, { version }) => {
    return config_plugins_1.withAppBuildGradle(config, (config) => {
        if (config.modResults.language !== "groovy")
            throw new Error("react-native-google-cast config plugin does not support Kotlin app/build.gradle yet.");
        config.modResults.contents = addGoogleCastImport(config.modResults.contents, {
            version,
        }).contents;
        return config;
    });
};
const withMainActivityLazyLoading = (config) => {
    return config_plugins_1.withDangerousMod(config, [
        "android",
        async (config) => {
            const file = await config_plugins_1.AndroidConfig.Paths.getMainActivityAsync(config.modRequest.projectRoot);
            if (file.language === "java") {
                const src = addGoogleCastLazyLoadingImport(file.contents).contents;
                await fs_1.default.promises.writeFile(file.path, src, "utf-8");
            }
            else {
                throw new Error("react-native-google-cast config plugin does not support kotlin MainActivity yet.");
            }
            return config;
        },
    ]);
};
const withAndroidGoogleCast = (config, props) => {
    var _a;
    config = withAndroidManifestCast(config, {
        receiverAppId: props.receiverAppId,
    });
    config = withMainActivityLazyLoading(config);
    config = withAppBuildGradleImport(config, {
        // gradle dep version
        version: (_a = props.androidPlayServicesCastFrameworkVersion) !== null && _a !== void 0 ? _a : "+",
    });
    return config;
};
exports.withAndroidGoogleCast = withAndroidGoogleCast;
function addGoogleCastLazyLoadingImport(src) {
    const newSrc = [];
    newSrc.push("    CastContext.getSharedInstance(this);");
    return generateCode_1.mergeContents({
        tag: "react-native-google-cast-onCreate",
        src,
        newSrc: newSrc.join("\n"),
        anchor: /super\.onCreate\(\w+\);/,
        offset: 1,
        comment: "//",
    });
}
// TODO: Add this ability to autolinking
// dependencies { implementation "com.google.android.gms:play-services-cast-framework:+" }
function addGoogleCastImport(src, { version } = {}) {
    const newSrc = [];
    newSrc.push(`  implementation "com.google.android.gms:play-services-cast-framework:${version || "+"}"`);
    return generateCode_1.mergeContents({
        tag: "react-native-google-cast-dependencies",
        src,
        newSrc: newSrc.join("\n"),
        anchor: /dependencies(?:\s+)?\{/,
        offset: 1,
        comment: "//",
    });
}
