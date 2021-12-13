import {
  AndroidConfig,
  withAndroidManifest,
  withMainActivity,
  withMainApplication,
} from "@expo/config-plugins";
import {
  addImports,
  appendContentsInsideDeclarationBlock,
} from "@expo/config-plugins/build/android/codeMod";
import type { ConfigPlugin } from "@expo/config-plugins";
import type { ExpoConfig } from "@expo/config-types";
import { mergeContents } from "@expo/config-plugins/build/utils/generateCode";
import type { MergeResults } from "@expo/config-plugins/build/utils/generateCode";

const {
  addMetaDataItemToMainApplication,
  getMainApplicationOrThrow,
  removeMetaDataItemFromMainApplication,
} = AndroidConfig.Manifest;

const META_BRANCH_KEY = "io.branch.sdk.BranchKey";

function addGetAutoInstanceIfNeeded(
  mainApplication: string,
  isJava: boolean
): string {
  if (mainApplication.match(/\s+RNBranchModule\.getAutoInstance\(/m)) {
    return mainApplication;
  }

  const semicolon = isJava ? ";" : "";
  return appendContentsInsideDeclarationBlock(
    mainApplication,
    "onCreate",
    `  RNBranchModule.getAutoInstance(this)${semicolon}\n  `
  );
}

export function modifyMainApplication(
  mainApplication: string,
  language: "java" | "kt"
): string {
  const isJava = language === "java";

  mainApplication = addImports(
    mainApplication,
    ["io.branch.rnbranch.RNBranchModule"],
    isJava
  );
  mainApplication = addGetAutoInstanceIfNeeded(mainApplication, isJava);

  return mainApplication;
}

export function addBranchInitSession(src: string): MergeResults {
  const tag = "react-native-branch-init-session";

  try {
    const newSrc = [
      "    RNBranchModule.initSession(getIntent().getData(), this);",
    ];

    return mergeContents({
      tag,
      src,
      newSrc: newSrc.join("\n"),
      anchor: /super\.onStart\(\);/,
      offset: 1,
      comment: "//",
    });
  } catch (err) {
    if ((err as any).code !== "ERR_NO_MATCH") {
      throw err;
    }
  }

  const newSrc = [
    "  @Override",
    "  protected void onStart() {",
    "    super.onStart();",
    "    RNBranchModule.initSession(getIntent().getData(), this);",
    "  }",
  ];
  return mergeContents({
    tag,
    src,
    newSrc: newSrc.join("\n"),
    anchor: `getMainComponentName`,
    offset: 3,
    comment: "//",
  });
}

export function addBranchOnNewIntent(src: string): MergeResults {
  const tag = "react-native-branch-on-new-intent";

  try {
    const newSrc = ["    RNBranchModule.onNewIntent(intent);"];

    return mergeContents({
      tag,
      src,
      newSrc: newSrc.join("\n"),
      anchor: /super\.onNewIntent\(intent\);/,
      offset: 1,
      comment: "//",
    });
  } catch (err) {
    if ((err as any).code !== "ERR_NO_MATCH") {
      throw err;
    }
  }

  const newSrc = [
    "  @Override",
    "  public void onNewIntent(Intent intent) {",
    "    super.onNewIntent(intent);",
    "    RNBranchModule.onNewIntent(intent);",
    "  }",
  ];
  return mergeContents({
    tag,
    src,
    newSrc: newSrc.join("\n"),
    anchor: `getMainComponentName`,
    offset: 3,
    comment: "//",
  });
}

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

export const modifyMainActivity = (
  mainActivity: string,
  language: "java" | "kt"
): string => {
  const isJava = language === "java";

  mainActivity = addImports(
    mainActivity,
    ["android.content.Intent", "io.branch.rnbranch.*"],
    isJava
  );
  mainActivity = addBranchInitSession(mainActivity).contents;
  mainActivity = addBranchOnNewIntent(mainActivity).contents;

  return mainActivity;
};

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

  config = withMainApplication(config, (config) => {
    config.modResults.contents = modifyMainApplication(
      config.modResults.contents,
      config.modResults.language
    );

    return config;
  });

  config = withMainActivity(config, (config) => {
    config.modResults.contents = modifyMainActivity(
      config.modResults.contents,
      config.modResults.language
    );

    return config;
  });

  return config;
};
