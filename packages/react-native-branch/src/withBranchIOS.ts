import { ConfigPlugin, InfoPlist, withInfoPlist } from "expo/config-plugins";

import { BranchKeys, ConfigData } from "./types";

export function setBranchApiKeys(
  { apiKey, testApiKey }: BranchKeys,
  infoPlist: InfoPlist
): InfoPlist {
  return {
    ...infoPlist,
    branch_key: {
      live: apiKey,
      ...(testApiKey && { test: testApiKey }),
    },
  };
}

export function enableBranchTestEnvironment(
  enableTestEnvironment: boolean,
  infoPlist: InfoPlist
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

  const apiKey = data.apiKey ?? config.ios?.config?.branch?.apiKey ?? null;
  const testApiKey =
    data.testApiKey ?? config.ios?.config?.branch?.testApiKey ?? null;
  const enableTestEnvironment =
    data.enableTestEnvironment ??
    config.android?.config?.branch?.enableTestEnvironment ??
    false;

  if (!apiKey) {
    throw new Error(
      "Branch API key is required: expo.ios.config.branch.apiKey"
    );
  }

  // Update the infoPlist with the branch key and branch domain
  config = withInfoPlist(config, (config) => {
    config.modResults = setBranchApiKeys(
      { apiKey, testApiKey },
      config.modResults
    );

    config.modResults = enableBranchTestEnvironment(
      enableTestEnvironment,
      config.modResults
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
