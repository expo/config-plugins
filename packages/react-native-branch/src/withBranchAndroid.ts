import { AndroidConfig, withAndroidManifest } from "@expo/config-plugins";
import type { ConfigPlugin } from "@expo/config-plugins";
import type { ExpoConfig } from "@expo/config-types";

const {
  addMetaDataItemToMainApplication,
  getMainApplicationOrThrow,
  removeMetaDataItemFromMainApplication,
} = AndroidConfig.Manifest;

const META_BRANCH_KEY = "io.branch.sdk.BranchKey";

export function getBranchApiKey(config: ExpoConfig) {
  return config.android?.config?.branch?.apiKey ?? null;
}

export function setBranchApiKey(
  apiKey: string,
  androidManifest: AndroidConfig.Manifest.AndroidManifest
) {
  const mainApplication = getMainApplicationOrThrow(androidManifest);

  if (apiKey) {
    // If the item exists, add it back
    addMetaDataItemToMainApplication(mainApplication, META_BRANCH_KEY, apiKey);
  } else {
    // Remove any existing item
    removeMetaDataItemFromMainApplication(mainApplication, META_BRANCH_KEY);
  }

  return androidManifest;
}

export const withBranchAndroid: ConfigPlugin<{ apiKey?: string }> = (
  config,
  data
) => {
  const apiKey = data.apiKey ?? getBranchApiKey(config);
  if (!apiKey) {
    throw new Error("Branch API key is required");
  }

  config = withAndroidManifest(config, (config) => {
    config.modResults = setBranchApiKey(apiKey, config.modResults);
    return config;
  });

  return config;
};
