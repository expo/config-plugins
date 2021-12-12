import {
  withAppDelegate,
  withInfoPlist,
  IOSConfig,
} from "@expo/config-plugins";
import type { ConfigPlugin, InfoPlist } from "@expo/config-plugins";
import type { ExpoConfig } from "@expo/config-types";
import { mergeContents } from "@expo/config-plugins/build/utils/generateCode";
import type { MergeResults } from "@expo/config-plugins/build/utils/generateCode";
import type { ConfigData } from "./types";

export function addBranchAppDelegateImport(src: string): MergeResults {
  const newSrc = ["#import <RNBranch/RNBranch.h>"];
  return mergeContents({
    tag: "react-native-branch-import",
    src,
    newSrc: newSrc.join("\n"),
    anchor: /#import "AppDelegate\.h"/,
    offset: 1,
    comment: "//",
  });
}

// Match against `UMModuleRegistryAdapter` (unimodules), and React Native without unimodules (Expo Modules).
const MATCH_INIT =
  /(?:(self\.|_)(\w+)\s?=\s?\[\[UMModuleRegistryAdapter alloc\])|(?:RCTBridge\s?\*\s?(\w+)\s?=\s?\[\[RCTBridge alloc\])|(?:RCTBridge\s?\*\s?(\w+)\s?=\s?\[self\.(\w+))/g;

export function addBranchAppDelegateInit(src: string): MergeResults {
  const newSrc = [];
  newSrc.push(
    "  [RNBranch initSessionWithLaunchOptions:launchOptions isReferrable:YES];"
  );

  return mergeContents({
    tag: "react-native-branch-init",
    src,
    newSrc: newSrc.join("\n"),
    anchor: MATCH_INIT,
    offset: 0,
    comment: "//",
  });
}

export function addBranchAppDelegateOpenURL(src: string): MergeResults {
  const newSrc = [
    "  if ([RNBranch application:application openURL:url options:options]) {",
    "    // do other deep link routing for the Facebook SDK, Pinterest SDK, etc",
    "  }",
  ];

  return mergeContents({
    tag: "react-native-branch-open-url",
    src,
    newSrc: newSrc.join("\n"),
    anchor: /\(UIApplication \*\)application openURL:/,
    offset: 1,
    comment: "//",
  });
}

export function addBranchAppDelegateContinueUserActivity(
  src: string
): MergeResults {
  const newSrc = [
    "  if ([RNBranch continueUserActivity:userActivity])  {",
    "    return YES;",
    "  }",
  ];

  return mergeContents({
    tag: "react-native-branch-continue-user-activity",
    src,
    newSrc: newSrc.join("\n"),
    anchor: /\(UIApplication \*\)application continueUserActivity:/,
    offset: 1,
    comment: "//",
  });
}

export function getBranchApiKey(config: Pick<ExpoConfig, "ios">) {
  return config.ios?.config?.branch?.apiKey ?? null;
}

export function setBranchApiKey(
  apiKey: string,
  infoPlist: InfoPlist
): InfoPlist {
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

export const withBranchIOS: ConfigPlugin<ConfigData> = (config, data) => {
  // Ensure object exist
  if (!config.ios) {
    config.ios = {};
  }

  const apiKey = data.apiKey ?? getBranchApiKey(config);
  if (!apiKey) {
    throw new Error("Branch API key is required");
  }

  // Update the infoPlist with the branch key and branch domain
  config = withInfoPlist(config, (config) => {
    config.modResults = setBranchApiKey(apiKey, config.modResults);
    if (data.iosAppDomain) {
      config.modResults.branch_app_domain = data.iosAppDomain;
    } else {
      delete config.modResults.branch_app_domain;
    }
    if (data.iosUniversalLinkDomains) {
      config.modResults.branch_universal_link_domains =
        data.iosUniversalLinkDomains;
    } else {
      delete config.modResults.branch_universal_link_domains;
    }
    return config;
  });

  // Update the AppDelegate.m
  config = withAppDelegate(config, (config) => {
    config.modResults.contents = addBranchAppDelegateImport(
      config.modResults.contents
    ).contents;
    config.modResults.contents = addBranchAppDelegateInit(
      config.modResults.contents
    ).contents;
    config.modResults.contents = addBranchAppDelegateOpenURL(
      config.modResults.contents
    ).contents;
    config.modResults.contents = addBranchAppDelegateContinueUserActivity(
      config.modResults.contents
    ).contents;

    return config;
  });

  return config;
};
