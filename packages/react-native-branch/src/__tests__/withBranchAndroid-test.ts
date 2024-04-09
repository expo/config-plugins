import { AndroidConfig } from "@expo/config-plugins";
import { resolve } from "path";

import {
  setBranchApiKeys,
  enableBranchTestEnvironment,
} from "../withBranchAndroid";

const { findMetaDataItem, getMainApplication, readAndroidManifestAsync } =
  AndroidConfig.Manifest;

const sampleManifestPath = resolve(
  __dirname,
  "./fixtures",
  "react-native-AndroidManifest.xml"
);

describe(setBranchApiKeys, () => {
  it("sets branch api key in AndroidManifest.xml if given", async () => {
    let androidManifestJson =
      await readAndroidManifestAsync(sampleManifestPath);
    androidManifestJson = await setBranchApiKeys(
      { apiKey: "MY-API-KEY", testApiKey: "MY-TEST-API-KEY" },
      androidManifestJson
    );
    let mainApplication = getMainApplication(androidManifestJson);

    expect(
      findMetaDataItem(mainApplication, "io.branch.sdk.BranchKey")
    ).toBeGreaterThan(-1);
    expect(
      findMetaDataItem(mainApplication, "io.branch.sdk.BranchKey.test")
    ).toBeGreaterThan(-1);

    // Unset the item

    androidManifestJson = await setBranchApiKeys({}, androidManifestJson);
    mainApplication = getMainApplication(androidManifestJson);

    expect(findMetaDataItem(mainApplication, "io.branch.sdk.BranchKey")).toBe(
      -1
    );
    expect(
      findMetaDataItem(mainApplication, "io.branch.sdk.BranchKey.test")
    ).toBe(-1);
  });
});

describe(enableBranchTestEnvironment, () => {
  it("sets branch test mode meta data item in AndroidManifest.xml", async () => {
    let androidManifestJson =
      await readAndroidManifestAsync(sampleManifestPath);

    androidManifestJson = await enableBranchTestEnvironment(
      true,
      androidManifestJson
    );

    const mainApplication = getMainApplication(androidManifestJson);

    expect(
      findMetaDataItem(mainApplication, "io.branch.sdk.TestMode")
    ).toBeGreaterThan(-1);
  });
});
