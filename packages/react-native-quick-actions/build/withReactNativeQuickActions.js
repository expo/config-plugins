"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addQuickActionsAppDelegateInit = exports.addQuickActionsAppDelegateImport = void 0;
const config_plugins_1 = require("@expo/config-plugins");
const generateCode_1 = require("@expo/config-plugins/build/utils/generateCode");
const remapping = {
    iconType: "UIApplicationShortcutItemIconType",
    iconFile: "UIApplicationShortcutItemIconFile",
    iconSymbolName: "UIApplicationShortcutItemIconSymbolName",
    title: "UIApplicationShortcutItemTitle",
    subtitle: "UIApplicationShortcutItemSubtitle",
    type: "UIApplicationShortcutItemType",
    userInfo: "UIApplicationShortcutItemUserInfo",
};
// #import "RNQuickActionManager.h"
// https://github.com/jordanbyron/react-native-quick-actions#adding-static-quick-actions---ios-only
// https://developer.apple.com/documentation/uikit/menus_and_shortcuts/add_home_screen_quick_actions
// TODO: Auto generate images in asset catalogues
/**
 * Apply react-native-quick-actions native configuration.
 */
const withReactNativeQuickActions = (config, _items) => {
    config = withQuickActionsAppDelegate(config);
    const items = _items || [];
    if (!Array.isArray(items) || !items.length) {
        return config;
    }
    return (0, config_plugins_1.withInfoPlist)(config, (config) => {
        config.modResults.UIApplicationShortcutItems = items.map((item) => {
            const result = {};
            for (const [key, value] of Object.entries(remapping)) {
                // @ts-expect-error
                const itemValue = item[key];
                if (itemValue) {
                    result[value] = itemValue;
                }
            }
            return result;
        });
        for (const index in config.modResults.UIApplicationShortcutItems) {
            const item = config.modResults.UIApplicationShortcutItems[index];
            for (const key of Object.keys(item)) {
                if (!item[key]) {
                    // @ts-expect-error
                    delete config.modResults.UIApplicationShortcutItems[index][key];
                }
            }
        }
        return config;
    });
};
function addQuickActionsAppDelegateImport(src) {
    return (0, generateCode_1.mergeContents)({
        tag: "react-native-quick-actions-import",
        src,
        newSrc: '#import "RNQuickActionManager.h"',
        anchor: /#import "AppDelegate\.h"/,
        offset: 1,
        comment: "//",
    });
}
exports.addQuickActionsAppDelegateImport = addQuickActionsAppDelegateImport;
function addQuickActionsAppDelegateInit(src) {
    const newSrc = [];
    newSrc.push("- (void)application:(UIApplication *)application performActionForShortcutItem:(UIApplicationShortcutItem *)shortcutItem completionHandler:(void (^)(BOOL succeeded)) completionHandler {", "  [RNQuickActionManager onQuickActionPress:shortcutItem completionHandler:completionHandler];", "}");
    return (0, generateCode_1.mergeContents)({
        tag: "react-native-quick-actions-delegate",
        src,
        newSrc: newSrc.join("\n"),
        anchor: /-\s?\(BOOL\)application:\(UIApplication\s?\*\)application/,
        offset: 0,
        comment: "//",
    });
}
exports.addQuickActionsAppDelegateInit = addQuickActionsAppDelegateInit;
const withQuickActionsAppDelegate = (config) => {
    return (0, config_plugins_1.withAppDelegate)(config, (config) => {
        if (["objc", "objcpp"].includes(config.modResults.language)) {
            try {
                config.modResults.contents = addQuickActionsAppDelegateImport(config.modResults.contents).contents;
                config.modResults.contents = addQuickActionsAppDelegateInit(config.modResults.contents).contents;
            }
            catch (error) {
                if (error.code === "ERR_NO_MATCH") {
                    throw new Error(`Cannot add QuickActions to the project's AppDelegate because it's malformed. Please report this with a copy of your project AppDelegate.`);
                }
                throw error;
            }
        }
        else {
            throw new Error("Cannot setup QuickActions because the AppDelegate is not Objective C");
        }
        return config;
    });
};
const pkg = {
    // Prevent this plugin from being run more than once.
    // This pattern enables users to safely migrate off of this
    // out-of-tree `@config-plugins/react-native-quick-actions` to a future
    // upstream plugin in `react-native-quick-actions`
    name: "react-native-quick-actions",
    // Indicates that this plugin is dangerously linked to a module,
    // and might not work with the latest version of that module.
    version: "UNVERSIONED",
};
exports.default = (0, config_plugins_1.createRunOncePlugin)(withReactNativeQuickActions, pkg.name, pkg.version);
