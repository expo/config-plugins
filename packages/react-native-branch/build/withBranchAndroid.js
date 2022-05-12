"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withBranchAndroid = exports.setBranchApiKey = exports.getBranchApiKey = void 0;
const config_plugins_1 = require("@expo/config-plugins");
const { addMetaDataItemToMainApplication, getMainApplicationOrThrow, removeMetaDataItemFromMainApplication, } = config_plugins_1.AndroidConfig.Manifest;
const META_BRANCH_KEY = "io.branch.sdk.BranchKey";
function getBranchApiKey(config) {
    var _a, _b, _c, _d;
    return (_d = (_c = (_b = (_a = config.android) === null || _a === void 0 ? void 0 : _a.config) === null || _b === void 0 ? void 0 : _b.branch) === null || _c === void 0 ? void 0 : _c.apiKey) !== null && _d !== void 0 ? _d : null;
}
exports.getBranchApiKey = getBranchApiKey;
function setBranchApiKey(apiKey, androidManifest) {
    const mainApplication = getMainApplicationOrThrow(androidManifest);
    if (apiKey) {
        // If the item exists, add it back
        addMetaDataItemToMainApplication(mainApplication, META_BRANCH_KEY, apiKey);
    }
    else {
        // Remove any existing item
        removeMetaDataItemFromMainApplication(mainApplication, META_BRANCH_KEY);
    }
    return androidManifest;
}
exports.setBranchApiKey = setBranchApiKey;
const withBranchAndroid = (config, data) => {
    var _a;
    const apiKey = (_a = data.apiKey) !== null && _a !== void 0 ? _a : getBranchApiKey(config);
    if (!apiKey) {
        throw new Error("Branch API key is required: expo.android.config.branch.apiKey");
    }
    config = config_plugins_1.withAndroidManifest(config, (config) => {
        config.modResults = setBranchApiKey(apiKey, config.modResults);
        return config;
    });
    return config;
};
exports.withBranchAndroid = withBranchAndroid;
