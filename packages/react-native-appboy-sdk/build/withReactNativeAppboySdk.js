"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addBrazeImport = void 0;
const config_plugins_1 = require("@expo/config-plugins");
const Permissions_1 = require("@expo/config-plugins/build/android/Permissions");
const generateCode_1 = require("@expo/config-plugins/build/utils/generateCode");
const { buildResourceItem } = config_plugins_1.AndroidConfig.Resources;
const { setStringItem, removeStringItem } = config_plugins_1.AndroidConfig.Strings;
const STRING_COM_BRAZE_API_KEY = "com_braze_api_key";
const STRING_COM_BRAZE_CUSTOM_ENDPOINT = "com_braze_custom_endpoint";
const withAndroidAppboySdk = (config, props) => {
    config = config_plugins_1.withProjectBuildGradle(config, (config) => {
        if (config.modResults.language === "groovy") {
            config.modResults.contents = addBrazeImport(config.modResults.contents).contents;
        }
        else {
            throw new Error("Cannot add camera maven gradle because the build.gradle is not groovy");
        }
        return config;
    });
    config = config_plugins_1.withStringsXml(config, (config) => {
        config.modResults = applyApiKeyString(props, config.modResults);
        config.modResults = applyCustomEndpointString(props, config.modResults);
        return config;
    });
    config = Permissions_1.withPermissions(config, [
        "android.permission.ACCESS_NETWORK_STATE",
        "android.permission.INTERNET",
    ]);
    return config;
};
const withIOSAppboySdk = (config, props) => {
    config = config_plugins_1.withInfoPlist(config, (config) => {
        delete config.modResults.Braze;
        const { apiKey, customEndpoint } = props;
        if (apiKey) {
            config.modResults.Braze = {
                ApiKey: apiKey,
            };
            if (customEndpoint) {
                config.modResults.Braze.Endpoint = customEndpoint;
            }
        }
        return config;
    });
    return config;
};
function applyApiKeyString(props, stringsJSON) {
    if (props.apiKey) {
        return setStringItem([
            buildResourceItem({
                name: STRING_COM_BRAZE_API_KEY,
                value: props.apiKey,
            }),
        ], stringsJSON);
    }
    return removeStringItem(STRING_COM_BRAZE_API_KEY, stringsJSON);
}
function applyCustomEndpointString(props, stringsJSON) {
    if (props.customEndpoint) {
        return setStringItem([
            buildResourceItem({
                name: STRING_COM_BRAZE_CUSTOM_ENDPOINT,
                translatable: false,
                value: props.customEndpoint,
            }),
        ], stringsJSON);
    }
    return removeStringItem(STRING_COM_BRAZE_CUSTOM_ENDPOINT, stringsJSON);
}
const gradleMaven = [
    `allprojects { repositories { maven { url "https://appboy.github.io/appboy-android-sdk/sdk" } } }`,
].join("\n");
function addBrazeImport(src) {
    return appendContents({
        tag: "react-native-appboy-sdk-import",
        src,
        newSrc: gradleMaven,
        comment: "//",
    });
}
exports.addBrazeImport = addBrazeImport;
function appendContents({ src, newSrc, tag, comment, }) {
    const header = generateCode_1.createGeneratedHeaderComment(newSrc, tag, comment);
    if (!src.includes(header)) {
        // Ensure the old generated contents are removed.
        const sanitizedTarget = generateCode_1.removeGeneratedContents(src, tag);
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
/**
 * Apply react-native-appboy-sdk configuration for Expo SDK 42 projects.
 */
const withReactNativeAppboySdk = (config, _props) => {
    const props = _props || {};
    config = withAndroidAppboySdk(config, props);
    config = withIOSAppboySdk(config, props);
    return config;
};
const pkg = {
    // Prevent this plugin from being run more than once.
    // This pattern enables users to safely migrate off of this
    // out-of-tree `@config-plugins/react-native-appboy-sdk` to a future
    // upstream plugin in `react-native-appboy-sdk`
    name: "react-native-appboy-sdk",
    // Indicates that this plugin is dangerously linked to a module,
    // and might not work with the latest version of that module.
    version: "UNVERSIONED",
};
exports.default = config_plugins_1.createRunOncePlugin(withReactNativeAppboySdk, pkg.name, pkg.version);
