import {
  mergeContents,
  MergeResults,
} from "@expo/config-plugins/build/utils/generateCode";
import { type ExpoConfig } from "expo/config";
import {
  type ConfigPlugin,
  InfoPlist,
  withDangerousMod,
  withInfoPlist,
} from "expo/config-plugins";
import { globSync } from "glob";
import * as fs from "node:fs";
import * as path from "node:path";

import { ConfigData } from "./types";

export function getBranchApiKey(config: Pick<ExpoConfig, "ios">) {
  return config.ios?.config?.branch?.apiKey ?? null;
}

export function setBranchApiKey(
  apiKey: string | null,
  infoPlist: InfoPlist,
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

export const withBranchIOS: ConfigPlugin<ConfigData> = (config, data) => {
  // Ensure object exist
  if (!config.ios) {
    config.ios = {};
  }

  const apiKey = data.apiKey ?? getBranchApiKey(config);
  if (!apiKey) {
    throw new Error(
      "Branch API key is required: expo.ios.config.branch.apiKey",
    );
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

  return config;
};
