"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_plugins_1 = require("@expo/config-plugins");
const withBranchAndroid_1 = require("./withBranchAndroid");
const withBranchIOS_1 = require("./withBranchIOS");
const withBranch = (config, { apiKey, iosAppDomain } = {}) => {
    config = withBranchAndroid_1.withBranchAndroid(config, { apiKey });
    config = withBranchIOS_1.withBranchIOS(config, { apiKey, iosAppDomain });
    return config;
};
let pkg = {
    name: "branch",
};
try {
    const branchPkg = require("react-native-branch/package.json");
    pkg = branchPkg;
}
catch (_a) { }
exports.default = config_plugins_1.createRunOncePlugin(withBranch, pkg.name, pkg.version);
