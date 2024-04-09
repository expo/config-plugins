import {
  mergeContents,
  MergeResults,
} from "@expo/config-plugins/build/utils/generateCode";
import {
  type ConfigPlugin,
  InfoPlist,
  withDangerousMod,
  withInfoPlist,
} from "expo/config-plugins";
import { globSync } from "glob";
import * as fs from "node:fs";
import * as path from "node:path";

import { BranchKeys, ConfigData } from "./types";

export function setBranchApiKeys(
  { apiKey, testApiKey }: BranchKeys,
  infoPlist: InfoPlist,
): InfoPlist {
  return {
    ...infoPlist,
    branch_key: {
      live: apiKey,
      ...(testApiKey && { test: testApiKey }),
    },
  };
}

export function addBridgingHeaderImport(src: string): MergeResults {
  return mergeContents({
    tag: "react-native-branch",
    src,
    newSrc: "#import <React/RCTBridge.h>",
    anchor: /\/\//,
    offset: 4,
    comment: "//",
  });
}

export function enableBranchTestEnvironment(
  enableTestEnvironment: boolean,
  infoPlist: InfoPlist,
) {
  return {
    ...infoPlist,
    branch_test_environment: enableTestEnvironment,
  };
}

export const withBranchIOS: ConfigPlugin<ConfigData> = (config, data) => {
  // Ensure object exist
  if (!config.ios) {
    config.ios = {};
  }

  // Fall back to the Expo Config `branch.apiKey` if not provided in plugin
  // config. The `branch` property in the Expo Config is deprecated and will be
  // removed in SDK 56.
  // TODO(@hassankhan): Remove fallback when updating for SDK 56
  const apiKey = data.apiKey ?? config.ios?.config?.branch?.apiKey;
  const { testApiKey, enableTestEnvironment = false } = data;

  if (!apiKey) {
    throw new Error("Branch API key is required: apiKey must be provided");
  }

  // Add `React/RCTBridge` to bridging header
  withDangerousMod(config, [
    "ios",
    async (config) => {
      if (!config.modRequest.projectName) {
        return config;
      }

      const [using] = globSync("*-Bridging-Header.h", {
        absolute: true,
        cwd: path.join(
          config.modRequest.platformProjectRoot,
          config.modRequest.projectName!,
        ),
      });

      if (!using) {
        throw new Error(
          "Cannot find bridging header. Please make sure you have a bridging header in your project.",
        );
      }

      const src = await fs.promises.readFile(using, "utf-8");
      const res = addBridgingHeaderImport(src);
      await fs.promises.writeFile(using, res.contents, "utf-8");

      return config;
    },
  ]);

  // Update the infoPlist with the branch key and branch domain
  config = withInfoPlist(config, (config) => {
    config.modResults = setBranchApiKeys(
      { apiKey, testApiKey },
      config.modResults,
    );

    config.modResults = enableBranchTestEnvironment(
      enableTestEnvironment,
      config.modResults,
    );

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

  return config;
};
