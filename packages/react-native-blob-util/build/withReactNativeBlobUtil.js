"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureBlobProviderAuthorityString = exports.ensureBlobProviderManifest = exports.appendDownloadCompleteAction = void 0;
const config_plugins_1 = require("expo/config-plugins");
let pkg = {
    name: "react-native-blob-util",
};
try {
    pkg = require("react-native-blob-util/package.json");
}
catch {
    // empty catch block
}
function appendDownloadCompleteAction(androidManifest) {
    if (!Array.isArray(androidManifest.manifest.application)) {
        return androidManifest;
    }
    for (const application of androidManifest.manifest.application) {
        for (const activity of application.activity || []) {
            if (activity?.$?.["android:launchMode"] === "singleTask") {
                for (const intentFilter of activity["intent-filter"] || []) {
                    const isLauncher = intentFilter.category?.some((action) => action.$["android:name"] === "android.intent.category.LAUNCHER");
                    if (!isLauncher)
                        continue;
                    intentFilter.action = intentFilter.action || [];
                    const hasDownloadCompleteAction = intentFilter.action.some((action) => action.$["android:name"] ===
                        "android.intent.action.DOWNLOAD_COMPLETE");
                    if (!hasDownloadCompleteAction) {
                        intentFilter.action.push({
                            $: {
                                "android:name": "android.intent.action.DOWNLOAD_COMPLETE",
                            },
                        });
                        return androidManifest;
                    }
                }
                break;
            }
        }
    }
    return androidManifest;
}
exports.appendDownloadCompleteAction = appendDownloadCompleteAction;
// com.facebook.react.modules.blob.BlobProvider
const withBlobProvider = (config) => {
    (0, config_plugins_1.withAndroidManifest)(config, (config) => {
        ensureBlobProviderManifest(config.modResults);
        return config;
    });
    return config;
};
function ensureBlobProviderManifest(androidManifest) {
    const app = config_plugins_1.AndroidConfig.Manifest.getMainApplicationOrThrow(androidManifest);
    if (!app.provider) {
        app.provider = [];
    }
    if (!app.provider.some((p) => p.$["android:name"] === "com.facebook.react.modules.blob.BlobProvider")) {
        // <provider android:name="com.facebook.react.modules.blob.BlobProvider" android:authorities="@string/blob_provider_authority" android:exported="false" />
        app.provider.push({
            $: {
                "android:name": "com.facebook.react.modules.blob.BlobProvider",
                "android:authorities": "@string/blob_provider_authority",
                "android:exported": "false",
            },
        });
    }
    return androidManifest;
}
exports.ensureBlobProviderManifest = ensureBlobProviderManifest;
const withReactNativeBlobUtil = (config) => {
    config = config_plugins_1.AndroidConfig.Permissions.withPermissions(config, [
        "android.permission.READ_EXTERNAL_STORAGE",
        "android.permission.WRITE_EXTERNAL_STORAGE",
        "android.permission.DOWNLOAD_WITHOUT_NOTIFICATION",
        // Wifi-only mode.
        "android.permission.ACCESS_NETWORK_STATE",
    ]);
    config = (0, config_plugins_1.withAndroidManifest)(config, (config) => {
        config.modResults = appendDownloadCompleteAction(config.modResults);
        return config;
    });
    withBlobProvider(config);
    config = (0, config_plugins_1.withStringsXml)(config, (config) => {
        ensureBlobProviderAuthorityString(config.modResults, config.android?.package + ".blobs");
        return config;
    });
    return config;
};
function ensureBlobProviderAuthorityString(res, authority) {
    if (!res.resources.string) {
        res.resources.string = [];
    }
    if (!res.resources.string.some((s) => s.$["name"] === "blob_provider_authority")) {
        res.resources.string.push({
            _: "invalid",
            $: {
                name: "blob_provider_authority",
            },
        });
    }
    const item = res.resources.string.find((s) => s.$["name"] === "blob_provider_authority");
    item._ = authority;
    return res;
}
exports.ensureBlobProviderAuthorityString = ensureBlobProviderAuthorityString;
exports.default = (0, config_plugins_1.createRunOncePlugin)(withReactNativeBlobUtil, pkg.name, pkg.version);
