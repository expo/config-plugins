"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_plugins_1 = require("expo/config-plugins");
const withBranchAndroid_1 = require("./withBranchAndroid");
const withBranchIOS_1 = require("./withBranchIOS");
const withBranch = (config, { apiKey, iosAppDomain, iosUniversalLinkDomains } = {}) => {
    config = (0, withBranchAndroid_1.withBranchAndroid)(config, { apiKey });
    config = (0, withBranchIOS_1.withBranchIOS)(config, {
        apiKey,
        iosAppDomain,
        iosUniversalLinkDomains,
    });
    return config;
};
let pkg = {
    name: "react-native-branch",
};
try {
    const branchPkg = require("react-native-branch/package.json");
    pkg = branchPkg;
}
catch { }
exports.default = (0, config_plugins_1.createRunOncePlugin)(withBranch, pkg.name, pkg.version);
