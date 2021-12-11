"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withBranchIos = exports.addBranchAppDelegateContinueUserActivity = exports.addBranchAppDelegateOpenURL = exports.addBranchAppDelegateInit = exports.addBranchAppDelegateImport = void 0;
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
const MATCH_INIT = /(?:(self\.|_)(\w+)\s?=\s?\[\[UMModuleRegistryAdapter alloc\])|(?:RCTBridge\s?\*\s?(\w+)\s?=\s?\[\[RCTBridge alloc\])/g;
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
const withBranchIos = (config, data) => {
    // Ensure object exist
    if (!config.ios) {
        config.ios = {};
    }
    // Update the infoPlist with the branch key and branch domain
    config = config_plugins_1.withInfoPlist(config, (config) => {
        config.modResults.branch_app_domain = data.appDomain;
        config.modResults.branch_key = {
            live: data.apiKey,
        };
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
exports.withBranchIos = withBranchIos;
