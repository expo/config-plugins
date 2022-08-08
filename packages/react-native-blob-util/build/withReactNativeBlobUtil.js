"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appendDownloadCompleteAction = void 0;
const config_plugins_1 = require("@expo/config-plugins");
let pkg = {
    name: "react-native-blob-util",
};
try {
    pkg = require("react-native-blob-util/package.json");
}
catch (_a) {
    // empty catch block
}
function appendDownloadCompleteAction(androidManifest) {
    var _a, _b;
    if (!Array.isArray(androidManifest.manifest.application)) {
        return androidManifest;
    }
    for (const application of androidManifest.manifest.application) {
        for (const activity of application.activity || []) {
            if (((_a = activity === null || activity === void 0 ? void 0 : activity.$) === null || _a === void 0 ? void 0 : _a["android:launchMode"]) === "singleTask") {
                for (const intentFilter of activity["intent-filter"] || []) {
                    const isLauncher = (_b = intentFilter.category) === null || _b === void 0 ? void 0 : _b.some((action) => action.$["android:name"] === "android.intent.category.LAUNCHER");
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
    return config;
};
exports.default = (0, config_plugins_1.createRunOncePlugin)(withReactNativeBlobUtil, pkg.name, pkg.version);
