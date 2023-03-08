"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addSiriShortcutAppDelegateInit = exports.addSiriShortcutAppDelegateImport = void 0;
const generateCode_1 = require("@expo/config-plugins/build/utils/generateCode");
const config_plugins_1 = require("expo/config-plugins");
/**
 * Apply react-native-siri-shortcut configuration for Expo SDK 44 projects.
 */
const withReactNativeSiriShortcut = (config, activityTypes) => {
    withSiriShortcutAppDelegate(config);
    withSiriEntitlements(config);
    const items = activityTypes || [];
    if (!Array.isArray(items) || !items.length) {
        return config;
    }
    return withReactNativeSiriShortcutInfoPlist(config, items);
};
const withReactNativeSiriShortcutInfoPlist = (config, activityTypes) => {
    return (0, config_plugins_1.withInfoPlist)(config, (config) => {
        config.modResults.NSUserActivityTypes = activityTypes;
        return config;
    });
};
function addSiriShortcutAppDelegateImport(src) {
    return (0, generateCode_1.mergeContents)({
        tag: "react-native-siri-shortcut",
        src,
        newSrc: "#import <RNSiriShortcuts/RNSiriShortcuts.h>",
        anchor: /#import "AppDelegate\.h"/,
        offset: 1,
        comment: "//",
    });
}
exports.addSiriShortcutAppDelegateImport = addSiriShortcutAppDelegateImport;
function addSiriShortcutAppDelegateInit(src) {
    return (0, generateCode_1.mergeContents)({
        tag: "react-native-siri-shortcut-delegate",
        src,
        newSrc: "  [RNSSSiriShortcuts application:application continueUserActivity:userActivity restorationHandler:restorationHandler];",
        anchor: /  return \[super application:application continueUserActivity:userActivity restorationHandler:restorationHandler\] \|\| result;/,
        offset: -1,
        comment: "//",
    });
}
exports.addSiriShortcutAppDelegateInit = addSiriShortcutAppDelegateInit;
/** Append the siri entitlement on iOS */
const withSiriEntitlements = (config) => {
    return (0, config_plugins_1.withEntitlementsPlist)(config, (config) => {
        config.modResults["com.apple.developer.siri"] = true;
        return config;
    });
};
const withSiriShortcutAppDelegate = (config) => {
    return (0, config_plugins_1.withAppDelegate)(config, (config) => {
        if (["objc", "objcpp"].includes(config.modResults.language)) {
            try {
                config.modResults.contents = addSiriShortcutAppDelegateImport(config.modResults.contents).contents;
                config.modResults.contents = addSiriShortcutAppDelegateInit(config.modResults.contents).contents;
            }
            catch (error) {
                if (error.code === "ERR_NO_MATCH") {
                    throw new Error(`Cannot add Siri Shortcut to the project's AppDelegate because it's malformed. Please report this with a copy of your project AppDelegate.`);
                }
                throw error;
            }
        }
        else {
            throw new Error("Cannot setup Siri Shortcut because the AppDelegate is not Objective C");
        }
        return config;
    });
};
const pkg = {
    // Prevent this plugin from being run more than once.
    // This pattern enables users to safely migrate off of this
    // out-of-tree `@config-plugins/react-native-siri-shortcut` to a future
    // upstream plugin in `react-native-siri-shortcut`
    name: "react-native-siri-shortcut",
    // Indicates that this plugin is dangerously linked to a module,
    // and might not work with the latest version of that module.
    version: "UNVERSIONED",
};
exports.default = (0, config_plugins_1.createRunOncePlugin)(withReactNativeSiriShortcut, pkg.name, pkg.version);
