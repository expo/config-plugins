"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withBranchIOS = exports.setBranchApiKey = exports.getBranchApiKey = void 0;
const config_plugins_1 = require("@expo/config-plugins");
function getBranchApiKey(config) {
    var _a, _b, _c, _d;
    return (_d = (_c = (_b = (_a = config.ios) === null || _a === void 0 ? void 0 : _a.config) === null || _b === void 0 ? void 0 : _b.branch) === null || _c === void 0 ? void 0 : _c.apiKey) !== null && _d !== void 0 ? _d : null;
}
exports.getBranchApiKey = getBranchApiKey;
function setBranchApiKey(apiKey, infoPlist) {
    if (apiKey === null) {
        return infoPlist;
    }
    return {
        ...infoPlist,
        branch_key: {
            live: apiKey,
        },
    };
}
exports.setBranchApiKey = setBranchApiKey;
const withBranchIOS = (config, data) => {
    var _a;
    // Ensure object exist
    if (!config.ios) {
        config.ios = {};
    }
    const apiKey = (_a = data.apiKey) !== null && _a !== void 0 ? _a : getBranchApiKey(config);
    if (!apiKey) {
        throw new Error("Branch API key is required");
    }
    // Update the infoPlist with the branch key and branch domain
    config = config_plugins_1.withInfoPlist(config, (config) => {
        config.modResults = setBranchApiKey(apiKey, config.modResults);
        if (data.iosAppDomain) {
            config.modResults.branch_app_domain = data.iosAppDomain;
        }
        else {
            delete config.modResults.branch_app_domain;
        }
        if (data.iosUniversalLinkDomains) {
            config.modResults.branch_universal_link_domains =
                data.iosUniversalLinkDomains;
        }
        else {
            delete config.modResults.branch_universal_link_domains;
        }
        return config;
    });
    return config;
};
exports.withBranchIOS = withBranchIOS;
