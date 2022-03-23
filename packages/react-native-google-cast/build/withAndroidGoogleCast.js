"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withAndroidGoogleCast = void 0;
const config_plugins_1 = require("@expo/config-plugins");
const codeMod_1 = require("@expo/config-plugins/build/android/codeMod");
const generateCode_1 = require("@expo/config-plugins/build/utils/generateCode");
const { addMetaDataItemToMainApplication, getMainApplicationOrThrow } = config_plugins_1.AndroidConfig.Manifest;
const META_PROVIDER_CLASS = "com.google.android.gms.cast.framework.OPTIONS_PROVIDER_CLASS_NAME";
const META_RECEIVER_APP_ID = "com.reactnative.googlecast.RECEIVER_APPLICATION_ID";
const CUSTOM_ACTIVITY = "com.reactnative.googlecast.RNGCExpandedControllerActivity";
async function ensureCustomActivityAsync({ mainApplication, }) {
    if (Array.isArray(mainApplication.activity)) {
        // Remove all activities matching the custom name
        mainApplication.activity = mainApplication.activity.filter((activity) => {
            var _a;
            return ((_a = activity.$) === null || _a === void 0 ? void 0 : _a["android:name"]) !== CUSTOM_ACTIVITY;
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
    return config_plugins_1.withAndroidManifest(config, async (config) => {
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
    return config_plugins_1.withProjectBuildGradle(config, (config) => {
        if (config.modResults.language !== "groovy")
            throw new Error("react-native-google-cast config plugin does not support Kotlin /build.gradle yet.");
        config.modResults.contents = addGoogleCastVersionImport(config.modResults.contents, {
            version,
        }).contents;
        return config;
    });
};
const withAppBuildGradleImport = (config, { version }) => {
    return config_plugins_1.withAppBuildGradle(config, (config) => {
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
    return config_plugins_1.withMainActivity(config, async (config) => {
        const src = codeMod_1.addImports(config.modResults.contents, ["com.google.android.gms.cast.framework.CastContext"], config.modResults.language === "java");
        if (config.modResults.language === "java") {
            config.modResults.contents = addGoogleCastLazyLoadingImport(src).contents;
        }
        else {
            throw new Error("react-native-google-cast config plugin does not support kotlin MainActivity yet.");
        }
        return config;
    });
};
// castFrameworkVersion
const withAndroidGoogleCast = (config, props) => {
    var _a, _b;
    config = withAndroidManifestCast(config, {
        receiverAppId: props.receiverAppId,
    });
    config = withMainActivityLazyLoading(config);
    config = withProjectBuildGradleVersion(config, {
        // gradle dep version
        version: (_a = props.androidPlayServicesCastFrameworkVersion) !== null && _a !== void 0 ? _a : "+",
    });
    config = withAppBuildGradleImport(config, {
        // gradle dep version
        version: (_b = props.androidPlayServicesCastFrameworkVersion) !== null && _b !== void 0 ? _b : "+",
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
    newSrc.push(`    implementation "com.google.android.gms:play-services-cast-framework:\${safeExtGet('castFrameworkVersion', '${version}')}"`);
    return generateCode_1.mergeContents({
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
    src = generateCode_1.removeContents({ src, tag }).contents;
    // If the source already has a safeExtGet method after removing this one, then go with the existing one.
    if (src.match(/def(?:\s+)?safeExtGet\(/)) {
        return src;
    }
    // Otherwise add a new one
    const newSrc = [];
    newSrc.push("def safeExtGet(prop, fallback) {", "  rootProject.ext.has(prop) ? rootProject.ext.get(prop) : fallback", "}");
    return generateCode_1.mergeContents({
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
    return generateCode_1.mergeContents({
        tag: "react-native-google-cast-version",
        src,
        newSrc: newSrc.join("\n"),
        anchor: /ext(?:\s+)?\{/,
        offset: 1,
        comment: "//",
    });
}
