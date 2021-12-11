import { withAppDelegate, withInfoPlist } from "@expo/config-plugins";
import { mergeContents, MergeResults } from "@expo/config-plugins/build/utils/generateCode";
import type { ConfigPlugin } from "@expo/config-plugins";
import type { ConfigData } from "./types";

export function addBranchAppDelegateImport(src: string): MergeResults {
  const newSrc = ["#import <RNBranch/RNBranch.h>"];
  return mergeContents({
    tag: "rn-branch-import",
    src,
    newSrc: newSrc.join("\n"),
    anchor: /#import "AppDelegate\.h"/,
    offset: 1,
    comment: "//",
  });
}

// Match against `UMModuleRegistryAdapter` (unimodules), and React Native without unimodules (Expo Modules).
const MATCH_INIT =
  /(?:(self\.|_)(\w+)\s?=\s?\[\[UMModuleRegistryAdapter alloc\])|(?:RCTBridge\s?\*\s?(\w+)\s?=\s?\[\[RCTBridge alloc\])/g;

export function addBranchAppDelegateInit(src: string): MergeResults {
  const newSrc = [];
  newSrc.push(
    "  [RNBranch initSessionWithLaunchOptions:launchOptions isReferrable:YES];"
  );

  return mergeContents({
    tag: "rn-branch-init",
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
    tag: "rn-branch-open-url",
    src,
    newSrc: newSrc.join("\n"),
    anchor: /\(UIApplication \*\)application openURL:/,
    offset: 1,
    comment: "//",
  });
}

export function addBranchAppDelegateContinueUserActivity(src: string): MergeResults {
  const newSrc = [
    "  if ([RNBranch continueUserActivity:userActivity])  {",
    "    return YES;",
    "  }",
  ];

  return mergeContents({
    tag: "rn-branch-continue-user-activity",
    src,
    newSrc: newSrc.join("\n"),
    anchor: /\(UIApplication \*\)application continueUserActivity:/,
    offset: 1,
    comment: "//",
  });
}

export const withBranchIos: ConfigPlugin<ConfigData> = (config, data) =>{
  // Ensure object exist
  if (!config.ios) {
    config.ios = {};
  }

  // Update the infoPlist with the branch key and branch domain
  config = withInfoPlist(config, (config) => {
    config.modResults.branch_app_domain = data.appDomain;
    config.modResults.branch_key = {
      live: data.apiKey,
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
}
