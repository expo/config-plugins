import {
  AndroidConfig,
  ConfigPlugin,
  withAndroidManifest,
} from "expo/config-plugins";

import { BranchKeys, ConfigData } from "./types";

const {
  addMetaDataItemToMainApplication,
  getMainApplicationOrThrow,
  removeMetaDataItemFromMainApplication,
} = AndroidConfig.Manifest;

const META_BRANCH_KEY = "io.branch.sdk.BranchKey";
const META_BRANCH_KEY_TEST = "io.branch.sdk.BranchKey.test";
const META_BRANCH_KEY_TEST_MODE = "io.branch.sdk.TestMode";

export function setBranchApiKeys(
  { apiKey, testApiKey }: BranchKeys,
  androidManifest: AndroidConfig.Manifest.AndroidManifest
) {
  const mainApplication = getMainApplicationOrThrow(androidManifest);

  if (apiKey) {
    addMetaDataItemToMainApplication(mainApplication, META_BRANCH_KEY, apiKey);
  } else {
    removeMetaDataItemFromMainApplication(mainApplication, META_BRANCH_KEY);
  }

  if (testApiKey) {
    addMetaDataItemToMainApplication(
      mainApplication,
      META_BRANCH_KEY_TEST,
      testApiKey
    );
  } else {
    removeMetaDataItemFromMainApplication(
      mainApplication,
      META_BRANCH_KEY_TEST
    );
  }

  return androidManifest;
}

export function enableBranchTestEnvironment(
  enableTestEnvironment: boolean,
  androidManifest: AndroidConfig.Manifest.AndroidManifest
) {
  const mainApplication = getMainApplicationOrThrow(androidManifest);

  addMetaDataItemToMainApplication(
    mainApplication,
    META_BRANCH_KEY_TEST_MODE,
    `${enableTestEnvironment}`
  );

  return androidManifest;
}

export const withBranchAndroid: ConfigPlugin<ConfigData> = (config, data) => {
  const apiKey = data.apiKey ?? config.android?.config?.branch?.apiKey ?? null;
  const testApiKey =
    data.testApiKey ?? config.android?.config?.branch?.testApiKey ?? null;
  const enableTestEnvironment =
    data.enableTestEnvironment ??
    config.android?.config?.branch?.enableTestEnvironment ??
    null;

  if (!apiKey) {
    throw new Error(
      "Branch API key is required: expo.android.config.branch.apiKey"
    );
  }

  config = withAndroidManifest(config, (config) => {
    config.modResults = setBranchApiKeys(
      { apiKey, testApiKey },
      config.modResults
    );

    config.modResults = enableBranchTestEnvironment(
      enableTestEnvironment,
      config.modResults
    );

    return config;
  });

  return config;
};
