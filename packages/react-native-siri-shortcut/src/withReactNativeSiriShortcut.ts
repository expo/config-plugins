import {
  mergeContents,
  MergeResults,
} from "@expo/config-plugins/build/utils/generateCode";
import {
  type ConfigPlugin,
  createRunOncePlugin,
  withAppDelegate,
  withInfoPlist,
  withEntitlementsPlist,
  withDangerousMod,
} from "expo/config-plugins";
import fs from "fs";
import { globSync } from "glob";
import path from "path";

/**
 * Apply react-native-siri-shortcut configuration for Expo SDK 44 projects.
 */
const withReactNativeSiriShortcut: ConfigPlugin<void | string[]> = (
  config,
  activityTypes
) => {
  withSiriShortcutAppDelegate(config);
  withSiriEntitlements(config);

  const items = activityTypes || [];

  if (!Array.isArray(items) || !items.length) {
    return config;
  }

  withInfoPlist(config, (config) => {
    config.modResults.NSUserActivityTypes = items;
    return config;
  });

  return config;
};

export function addSiriShortcutAppDelegateImport(
  src: string,
  lang: string
): MergeResults | null {
  if (lang !== "swift") {
    // ObjC
    return mergeContents({
      tag: "react-native-siri-shortcut",
      src,
      newSrc: "#import <RNSiriShortcuts/RNSiriShortcuts.h>",
      anchor: /#import "AppDelegate\.h"/,
      offset: 1,
      comment: "//",
    });
  }
  return null;
}

export function addSiriShortcutAppDelegateInit(
  src: string,
  lang: string
): MergeResults {
  if (lang === "swift") {
    return mergeContents({
      tag: "react-native-siri-shortcut-delegate",
      src,
      newSrc:
        "  RNSSiriShortcuts.application(application, continue: userActivity, restorationHandler: restorationHandler)",
      anchor:
        /return super.application\(application,(\s+)?continue:(\s+)?userActivity,(\s+)?restorationHandler:(\s+)?restorationHandler\)/,
      offset: -1,
      comment: "//",
    });
  }
  return mergeContents({
    tag: "react-native-siri-shortcut-delegate",
    src,
    newSrc:
      "  [RNSSSiriShortcuts application:application continueUserActivity:userActivity restorationHandler:restorationHandler];",
    anchor:
      /  return \[super application:application continueUserActivity:userActivity restorationHandler:restorationHandler\] \|\| result;/,
    offset: -1,
    comment: "//",
  });
}

export function addSiriShortcutBridgingHeaderImport(src: string): MergeResults {
  return mergeContents({
    tag: "react-native-siri-shortcut",
    src,
    newSrc: "#import <RNSiriShortcuts/RNSiriShortcuts.h>",
    anchor: /\/\//,
    offset: 4,
    comment: "//",
  });
}

/** Append the siri entitlement on iOS */
const withSiriEntitlements: ConfigPlugin = (config) => {
  return withEntitlementsPlist(config, (config) => {
    config.modResults["com.apple.developer.siri"] = true;
    return config;
  });
};

const withSiriShortcutAppDelegate: ConfigPlugin = (config) => {
  // Quick dirty hack to support Swift AppDelegate
  withDangerousMod(config, [
    "ios",
    async (config) => {
      const [using] = globSync("*-Bridging-Header.h", {
        absolute: true,
        cwd: path.join(
          config.modRequest.platformProjectRoot,
          config.modRequest.projectName!
        ),
      });

      if (!using) {
        throw new Error(
          "Cannot find bridging header. Please make sure you have a bridging header in your project."
        );
      }

      const src = await fs.promises.readFile(using, "utf-8");

      const res = addSiriShortcutBridgingHeaderImport(src);

      await fs.promises.writeFile(using, res.contents, "utf-8");

      return config;
    },
  ]);

  return withAppDelegate(config, (config) => {
    if (!["objc", "objcpp", "swift"].includes(config.modResults.language)) {
      throw new Error(
        "Cannot setup Siri Shortcut because the AppDelegate is not in a support language:" +
          ` ${config.modResults.language}. Only ObjC, ObjCpp and Swift are supported.`
      );
    }
    try {
      config.modResults.contents =
        addSiriShortcutAppDelegateImport(
          config.modResults.contents,
          config.modResults.language
        )?.contents ?? config.modResults.contents;
      config.modResults.contents = addSiriShortcutAppDelegateInit(
        config.modResults.contents,
        config.modResults.language
      ).contents;
    } catch (error: any) {
      if (error.code === "ERR_NO_MATCH") {
        throw new Error(
          `Cannot add Siri Shortcut to the project's AppDelegate because it's malformed. Please report this with a copy of your project AppDelegate.`
        );
      }
      throw error;
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

export default createRunOncePlugin(
  withReactNativeSiriShortcut,
  pkg.name,
  pkg.version
);
