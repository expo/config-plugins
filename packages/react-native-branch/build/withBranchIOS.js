"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withBranchIOS = exports.modifyAppDelegateObjc = exports.updateApplicationContinueUserActivity = exports.updateApplicationOpenURLWithOptions = exports.updateApplicationDidFinishLaunchingWithOptions = exports.setBranchApiKey = exports.getBranchApiKey = void 0;
const config_plugins_1 = require("@expo/config-plugins");
const codeMod_1 = require("@expo/config-plugins/build/ios/codeMod");
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
function updateApplicationDidFinishLaunchingWithOptions(contents) {
    // application:didFinishLaunchingWithOptions:
    const initSessionWithLaunchOptions = "[RNBranch initSessionWithLaunchOptions:launchOptions isReferrable:YES];";
    if (!contents.includes(` ${initSessionWithLaunchOptions}`)) {
        contents = codeMod_1.insertContentsInsideObjcFunctionBlock(contents, "application:didFinishLaunchingWithOptions:", initSessionWithLaunchOptions, { position: "head", indent: 2 });
    }
    return contents;
}
exports.updateApplicationDidFinishLaunchingWithOptions = updateApplicationDidFinishLaunchingWithOptions;
function updateApplicationOpenURLWithOptions(contents) {
    // application:openURL:options:
    const branchOpenURLWithOptions = "[RNBranch application:application openURL:url options:options];";
    if (!contents.includes(` ${branchOpenURLWithOptions}`)) {
        contents = codeMod_1.insertContentsInsideObjcFunctionBlock(contents, "application:openURL:options:", branchOpenURLWithOptions, { position: "tailBeforeLastReturn", indent: 2 });
    }
    return contents;
}
exports.updateApplicationOpenURLWithOptions = updateApplicationOpenURLWithOptions;
function updateApplicationContinueUserActivity(contents) {
    // application:continueUserActivity:restorationHandler:
    const branchContinueUserActivity = "if ([RNBranch continueUserActivity:userActivity]) { return YES; }";
    if (!contents.includes(`  ${branchContinueUserActivity}`)) {
        contents = codeMod_1.insertContentsInsideObjcFunctionBlock(contents, "application:continueUserActivity:restorationHandler:", branchContinueUserActivity, { position: "tailBeforeLastReturn", indent: 2 });
    }
    return contents;
}
exports.updateApplicationContinueUserActivity = updateApplicationContinueUserActivity;
const modifyAppDelegateObjc = (contents) => {
    // Add imports if needed
    if (!contents.match(/^#import\s+<RNBranch\/RNBranch\.h>\s*$/m)) {
        contents = codeMod_1.addObjcImports(contents, ["<RNBranch/RNBranch.h>"]);
    }
    contents = updateApplicationDidFinishLaunchingWithOptions(contents);
    contents = updateApplicationOpenURLWithOptions(contents);
    contents = updateApplicationContinueUserActivity(contents);
    return contents;
};
exports.modifyAppDelegateObjc = modifyAppDelegateObjc;
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
    config = config_plugins_1.withAppDelegate(config, (config) => {
        if (config.modResults.language === "swift") {
            throw new Error("Branch is not supported in Swift");
        }
        config.modResults.contents = exports.modifyAppDelegateObjc(config.modResults.contents);
        return config;
    });
    return config;
};
exports.withBranchIOS = withBranchIOS;
