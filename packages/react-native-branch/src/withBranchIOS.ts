import { withAppDelegate, withInfoPlist } from "@expo/config-plugins";
import type { ConfigPlugin, InfoPlist } from "@expo/config-plugins";
import type { ExpoConfig } from "@expo/config-types";
import type { ConfigData } from "./types";
import {
  addObjcImports,
  insertContentsInsideObjcFunctionBlock,
} from "@expo/config-plugins/build/ios/codeMod";

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

export function updateApplicationDidFinishLaunchingWithOptions(
  contents: string
): string {
  // application:didFinishLaunchingWithOptions:
  const initSessionWithLaunchOptions =
    "[RNBranch initSessionWithLaunchOptions:launchOptions isReferrable:YES];";
  if (!contents.includes(` ${initSessionWithLaunchOptions}`)) {
    contents = insertContentsInsideObjcFunctionBlock(
      contents,
      "application:didFinishLaunchingWithOptions:",
      initSessionWithLaunchOptions,
      { position: "head", indent: 2 }
    );
  }

  return contents;
}

export function updateApplicationOpenURLWithOptions(contents: string): string {
  // application:openURL:options:
  const branchOpenURLWithOptions =
    "[RNBranch application:application openURL:url options:options];";
  if (!contents.includes(` ${branchOpenURLWithOptions}`)) {
    contents = insertContentsInsideObjcFunctionBlock(
      contents,
      "application:openURL:options:",
      branchOpenURLWithOptions,
      { position: "tailBeforeLastReturn", indent: 2 }
    );
  }

  return contents;
}

export function updateApplicationContinueUserActivity(
  contents: string
): string {
  // application:continueUserActivity:restorationHandler:
  const branchContinueUserActivity =
    "if ([RNBranch continueUserActivity:userActivity]) { return YES; }";
  if (!contents.includes(`  ${branchContinueUserActivity}`)) {
    contents = insertContentsInsideObjcFunctionBlock(
      contents,
      "application:continueUserActivity:restorationHandler:",
      branchContinueUserActivity,
      { position: "tailBeforeLastReturn", indent: 2 }
    );
  }

  return contents;
}

export const modifyAppDelegateObjc = (contents: string): string => {
  // Add imports if needed
  if (!contents.match(/^#import\s+<RNBranch\/RNBranch\.h>\s*$/m)) {
    contents = addObjcImports(contents, ["<RNBranch/RNBranch.h>"]);
  }

  contents = updateApplicationDidFinishLaunchingWithOptions(contents);
  contents = updateApplicationOpenURLWithOptions(contents);
  contents = updateApplicationContinueUserActivity(contents);

  return contents;
};

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

  config = withAppDelegate(config, (config) => {
    if (config.modResults.language === "swift") {
      throw new Error("Branch is not supported in Swift");
    }

    config.modResults.contents = modifyAppDelegateObjc(
      config.modResults.contents
    );

    return config;
  });

  return config;
};
