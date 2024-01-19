"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withAndroidGoogleCast = void 0;
const codeMod_1 = require("@expo/config-plugins/build/android/codeMod");
const generateCode_1 = require("@expo/config-plugins/build/utils/generateCode");
const config_plugins_1 = require("expo/config-plugins");
const { addMetaDataItemToMainApplication, getMainApplicationOrThrow } = config_plugins_1.AndroidConfig.Manifest;
const META_PROVIDER_CLASS = "com.google.android.gms.cast.framework.OPTIONS_PROVIDER_CLASS_NAME";
const META_RECEIVER_APP_ID = "com.reactnative.googlecast.RECEIVER_APPLICATION_ID";
const CUSTOM_ACTIVITY = "com.reactnative.googlecast.RNGCExpandedControllerActivity";
async function ensureCustomActivityAsync({ mainApplication, }) {
    if (Array.isArray(mainApplication.activity)) {
        // Remove all activities matching the custom name
        mainApplication.activity = mainApplication.activity.filter((activity) => {
            return activity.$?.["android:name"] !== CUSTOM_ACTIVITY;
        });
    }
    else {
        mainApplication.activity = [];
    }
    // `<activity android:name="${CUSTOM_ACTIVITY}" />`
    mainApplication.activity.push({
        $: {
            "android:name": CUSTOM_ACTIVITY,
        },
    });
    return mainApplication;
}
const withAndroidManifestCast = (config, { receiverAppId } = {}) => {
    return (0, config_plugins_1.withAndroidManifest)(config, async (config) => {
        const mainApplication = getMainApplicationOrThrow(config.modResults);
        ensureCustomActivityAsync({ mainApplication });
        addMetaDataItemToMainApplication(mainApplication, META_PROVIDER_CLASS, 
        // This is the native Java class
        "com.reactnative.googlecast.GoogleCastOptionsProvider");
        if (receiverAppId) {
            addMetaDataItemToMainApplication(mainApplication, META_RECEIVER_APP_ID, receiverAppId);
        }
        return config;
    });
};
const withProjectBuildGradleVersion = (config, { version }) => {
    return (0, config_plugins_1.withProjectBuildGradle)(config, (config) => {
        if (config.modResults.language !== "groovy")
            throw new Error("react-native-google-cast config plugin does not support Kotlin /build.gradle yet.");
        config.modResults.contents = addGoogleCastVersionImport(config.modResults.contents, {
            version,
        }).contents;
        return config;
    });
};
const withAppBuildGradleImport = (config, { version }) => {
    return (0, config_plugins_1.withAppBuildGradle)(config, (config) => {
        if (config.modResults.language !== "groovy")
            throw new Error("react-native-google-cast config plugin does not support Kotlin app/build.gradle yet.");
        config.modResults.contents = addSafeExtGet(config.modResults.contents);
        config.modResults.contents = addGoogleCastImport(config.modResults.contents, {
            version,
        }).contents;
        return config;
    });
};
const withMainActivityLazyLoading = (config) => {
    return (0, config_plugins_1.withMainActivity)(config, async (config) => {
        const src = (0, codeMod_1.addImports)(config.modResults.contents, ["com.google.android.gms.cast.framework.CastContext"], config.modResults.language === "java");
        config.modResults.contents = addGoogleCastLazyLoadingImport(src, config.modResults.language).contents;
        return config;
    });
};
// castFrameworkVersion
const withAndroidGoogleCast = (config, props) => {
    config = withAndroidManifestCast(config, {
        receiverAppId: props.receiverAppId,
    });
    config = withMainActivityLazyLoading(config);
    config = withProjectBuildGradleVersion(config, {
        // gradle dep version
        version: props.androidPlayServicesCastFrameworkVersion ?? "+",
    });
    config = withAppBuildGradleImport(config, {
        // gradle dep version
        version: props.androidPlayServicesCastFrameworkVersion ?? "+",
    });
    return config;
};
exports.withAndroidGoogleCast = withAndroidGoogleCast;
const MAIN_ACTIVITY_LANGUAGES = {
    java: {
        code: "CastContext.getSharedInstance(this);",
        anchor: /super\.onCreate\(\w+\);/,
    },
    kt: {
        code: "CastContext.getSharedInstance(this)",
        anchor: /super\.onCreate\(\w+\)/,
    },
};
function addGoogleCastLazyLoadingImport(src, language) {
    const mainActivity = MAIN_ACTIVITY_LANGUAGES[language];
    if (!mainActivity) {
        throw new Error(`react-native-google-cast config plugin does not support MainActivity.${language} yet`);
    }
    const newSrc = [];
    newSrc.push(`    ${mainActivity.code}`);
    return (0, generateCode_1.mergeContents)({
        tag: "react-native-google-cast-onCreate",
        src,
        newSrc: newSrc.join("\n"),
        anchor: mainActivity.anchor,
        offset: 1,
        comment: "//",
    });
}
// TODO: Add this ability to autolinking
// dependencies { implementation "com.google.android.gms:play-services-cast-framework:+" }
function addGoogleCastImport(src, { version } = {}) {
    const newSrc = [];
    newSrc.push(`    implementation "com.google.android.gms:play-services-cast-framework:\${safeExtGet('castFrameworkVersion', '${version}')}"`);
    return (0, generateCode_1.mergeContents)({
        tag: "react-native-google-cast-dependencies",
        src,
        newSrc: newSrc.join("\n"),
        anchor: /dependencies(?:\s+)?\{/,
        offset: 1,
        comment: "//",
    });
}
function addSafeExtGet(src) {
    const tag = "safeExtGet";
    src = (0, generateCode_1.removeContents)({ src, tag }).contents;
    // If the source already has a safeExtGet method after removing this one, then go with the existing one.
    if (src.match(/def(?:\s+)?safeExtGet\(/)) {
        return src;
    }
    // Otherwise add a new one
    const newSrc = [];
    newSrc.push("def safeExtGet(prop, fallback) {", "  rootProject.ext.has(prop) ? rootProject.ext.get(prop) : fallback", "}");
    return (0, generateCode_1.mergeContents)({
        tag: "safeExtGet",
        src,
        newSrc: newSrc.join("\n"),
        // This block can go anywhere in the upper scope
        anchor: /apply plugin/,
        offset: 1,
        comment: "//",
    }).contents;
}
function addGoogleCastVersionImport(src, { version } = {}) {
    const newSrc = [];
    newSrc.push(`        castFrameworkVersion = "${version}"`);
    return (0, generateCode_1.mergeContents)({
        tag: "react-native-google-cast-version",
        src,
        newSrc: newSrc.join("\n"),
        anchor: /ext(?:\s+)?\{/,
        offset: 1,
        comment: "//",
    });
}
