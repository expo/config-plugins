import { ExpoConfig } from "expo/config";
import {
  AndroidConfig,
  ConfigPlugin,
  withAndroidManifest,
} from "expo/config-plugins";

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
  androidManifest: AndroidConfig.Manifest.AndroidManifest,
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
  data,
) => {
  const apiKey = data.apiKey ?? getBranchApiKey(config);
  if (!apiKey) {
    throw new Error(
      "Branch API key is required: expo.android.config.branch.apiKey",
    );
  }

  config = withAndroidManifest(config, (config) => {
    config.modResults = setBranchApiKey(apiKey, config.modResults);
    return config;
  });

  return config;
};
