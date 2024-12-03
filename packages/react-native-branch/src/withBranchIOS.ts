import { type ExpoConfig } from "expo/config";
import {
  type ConfigPlugin,
  InfoPlist,
  withInfoPlist,
} from "expo/config-plugins";

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
