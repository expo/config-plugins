"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_plugins_1 = require("@expo/config-plugins");
const withBranchAndroid_1 = require("./withBranchAndroid");
const withBranchIOS_1 = require("./withBranchIOS");
const withBranch = (config, { apiKey, appDomain }) => {
    return config_plugins_1.withPlugins(config, [
        [withBranchIOS_1.withBranchIos, { apiKey, appDomain }],
        [withBranchAndroid_1.withBranchAndroid, { apiKey }],
    ]);
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
