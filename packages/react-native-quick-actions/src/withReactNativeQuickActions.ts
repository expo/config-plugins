import {
  mergeContents,
  MergeResults,
} from "@expo/config-plugins/build/utils/generateCode";
import {
  ConfigPlugin,
  createRunOncePlugin,
  withAppDelegate,
  withInfoPlist,
  XML,
} from "expo/config-plugins";

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
const withReactNativeQuickActions: ConfigPlugin<
  | void
  | {
      // https://github.com/jordanbyron/react-native-quick-actions/blob/d94a7319e70dc0b7f882b8cd573b04ad3463d87b/RNQuickAction/RNQuickAction/RNQuickActionManager.m#L69-L99
      iconType?: "UIApplicationShortcutIconTypeLocation" | string;
      title: string;
      // UIApplicationShortcutItemIconSymbolName
      iconSymbolName?: "square.stack.3d.up" | string;
      iconFile?: string;
      subtitle?: string;
      /**
       * A unique string that the system passes to your app
       */
      type: string;
      /**
       * An optional, app-defined dictionary. One use for this dictionary is to provide app version information, as described in the “App Launch and App Update Considerations for Quick Actions” section of the overview in UIApplicationShortcutItem Class Reference.
       */
      userInfo?: XML.XMLObject;
    }[]
> = (config, _items) => {
  config = withQuickActionsAppDelegate(config);

  const items = _items || [];

  if (!Array.isArray(items) || !items.length) {
    return config;
  }

  return withInfoPlist(config, (config) => {
    config.modResults.UIApplicationShortcutItems = items.map((item) => {
      const result: Record<string, string> = {};

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
      const item = config.modResults.UIApplicationShortcutItems[
        index
      ] as Record<string, any>;
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

export function addQuickActionsAppDelegateImport(src: string): MergeResults {
  return mergeContents({
    tag: "react-native-quick-actions-import",
    src,
    newSrc: '#import "RNQuickActionManager.h"',
    anchor: /#import "AppDelegate\.h"/,
    offset: 1,
    comment: "//",
  });
}

export function addQuickActionsAppDelegateInit(src: string): MergeResults {
  const newSrc = [];
  newSrc.push(
    "- (void)application:(UIApplication *)application performActionForShortcutItem:(UIApplicationShortcutItem *)shortcutItem completionHandler:(void (^)(BOOL succeeded)) completionHandler {",
    "  [RNQuickActionManager onQuickActionPress:shortcutItem completionHandler:completionHandler];",
    "}",
  );

  return mergeContents({
    tag: "react-native-quick-actions-delegate",
    src,
    newSrc: newSrc.join("\n"),
    anchor: /-\s?\(BOOL\)application:\(UIApplication\s?\*\)application/,
    offset: 0,
    comment: "//",
  });
}

const withQuickActionsAppDelegate: ConfigPlugin = (config) => {
  return withAppDelegate(config, (config) => {
    if (["objc", "objcpp"].includes(config.modResults.language)) {
      try {
        config.modResults.contents = addQuickActionsAppDelegateImport(
          config.modResults.contents,
        ).contents;
        config.modResults.contents = addQuickActionsAppDelegateInit(
          config.modResults.contents,
        ).contents;
      } catch (error: any) {
        if (error.code === "ERR_NO_MATCH") {
          throw new Error(
            `Cannot add QuickActions to the project's AppDelegate because it's malformed. Please report this with a copy of your project AppDelegate.`,
          );
        }
        throw error;
      }
    } else {
      throw new Error(
        "Cannot setup QuickActions because the AppDelegate is not Objective C",
      );
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

export default createRunOncePlugin(
  withReactNativeQuickActions,
  pkg.name,
  pkg.version,
);
