"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withBranchIOS = exports.setBranchApiKey = exports.getBranchApiKey = exports.addBranchAppDelegateContinueUserActivity = exports.addBranchAppDelegateOpenURL = exports.addBranchAppDelegateInit = exports.addBranchAppDelegateImport = void 0;
const config_plugins_1 = require("@expo/config-plugins");
const generateCode_1 = require("@expo/config-plugins/build/utils/generateCode");
function addBranchAppDelegateImport(src) {
    const newSrc = ["#import <RNBranch/RNBranch.h>"];
    return generateCode_1.mergeContents({
        tag: "rn-branch-import",
        src,
        newSrc: newSrc.join("\n"),
        anchor: /#import "AppDelegate\.h"/,
        offset: 1,
        comment: "//",
    });
}
exports.addBranchAppDelegateImport = addBranchAppDelegateImport;
// Match against `UMModuleRegistryAdapter` (unimodules), and React Native without unimodules (Expo Modules).
const MATCH_INIT = /(?:(self\.|_)(\w+)\s?=\s?\[\[UMModuleRegistryAdapter alloc\])|(?:RCTBridge\s?\*\s?(\w+)\s?=\s?\[\[RCTBridge alloc\])|(?:RCTBridge\s?\*\s?(\w+)\s?=\s?\[self\.(\w+))/g;
function addBranchAppDelegateInit(src) {
    const newSrc = [];
    newSrc.push("  [RNBranch initSessionWithLaunchOptions:launchOptions isReferrable:YES];");
    return generateCode_1.mergeContents({
        tag: "rn-branch-init",
        src,
        newSrc: newSrc.join("\n"),
        anchor: MATCH_INIT,
        offset: 0,
        comment: "//",
    });
}
exports.addBranchAppDelegateInit = addBranchAppDelegateInit;
function addBranchAppDelegateOpenURL(src) {
    const newSrc = [
        "  if ([RNBranch application:application openURL:url options:options]) {",
        "    // do other deep link routing for the Facebook SDK, Pinterest SDK, etc",
        "  }",
    ];
    return generateCode_1.mergeContents({
        tag: "rn-branch-open-url",
        src,
        newSrc: newSrc.join("\n"),
        anchor: /\(UIApplication \*\)application openURL:/,
        offset: 1,
        comment: "//",
    });
}
exports.addBranchAppDelegateOpenURL = addBranchAppDelegateOpenURL;
function addBranchAppDelegateContinueUserActivity(src) {
    const newSrc = [
        "  if ([RNBranch continueUserActivity:userActivity])  {",
        "    return YES;",
        "  }",
    ];
    return generateCode_1.mergeContents({
        tag: "rn-branch-continue-user-activity",
        src,
        newSrc: newSrc.join("\n"),
        anchor: /\(UIApplication \*\)application continueUserActivity:/,
        offset: 1,
        comment: "//",
    });
}
exports.addBranchAppDelegateContinueUserActivity = addBranchAppDelegateContinueUserActivity;
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
            config.modResults.branch_universal_link_domains = data.iosUniversalLinkDomains;
        }
        else {
            delete config.modResults.branch_universal_link_domains;
        }
        return config;
    });
    // Update the AppDelegate.m
    config = config_plugins_1.withAppDelegate(config, (config) => {
        config.modResults.contents = addBranchAppDelegateImport(config.modResults.contents).contents;
        config.modResults.contents = addBranchAppDelegateInit(config.modResults.contents).contents;
        config.modResults.contents = addBranchAppDelegateOpenURL(config.modResults.contents).contents;
        config.modResults.contents = addBranchAppDelegateContinueUserActivity(config.modResults.contents).contents;
        return config;
    });
    return config;
};
exports.withBranchIOS = withBranchIOS;
