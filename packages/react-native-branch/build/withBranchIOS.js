"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withBranchIOS = exports.setBranchApiKey = exports.getBranchApiKey = void 0;
const config_plugins_1 = require("expo/config-plugins");
function getBranchApiKey(config) {
    return config.ios?.config?.branch?.apiKey ?? null;
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
    // Ensure object exist
    if (!config.ios) {
        config.ios = {};
    }
    const apiKey = data.apiKey ?? getBranchApiKey(config);
    if (!apiKey) {
        throw new Error("Branch API key is required: expo.ios.config.branch.apiKey");
    }
    // Update the infoPlist with the branch key and branch domain
    config = (0, config_plugins_1.withInfoPlist)(config, (config) => {
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
