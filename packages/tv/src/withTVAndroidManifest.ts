import { ExpoConfig } from "expo/config";
import {
  AndroidConfig,
  ConfigPlugin,
  WarningAggregator,
  withAndroidManifest,
} from "expo/config-plugins";

import { ConfigData } from "./types";
import { isTVEnabled, showVerboseWarnings } from "./utils";

const pkg = require("../package.json");

const { getMainActivity } = AndroidConfig.Manifest;

export const withTVAndroidManifest: ConfigPlugin<ConfigData> = (
  config,
  params = {}
) => {
  const isTV = isTVEnabled(params);
  const verbose = showVerboseWarnings(params);

  return withAndroidManifest(config, async (config) => {
    if (isTV) {
      if (verbose) {
        WarningAggregator.addWarningAndroid(
          "manifest",
          `${pkg.name}@${pkg.version}: modifying AndroidManifest.xml for TV`
        );
      }
      config.modResults = await setLeanBackLauncherIntent(
        config,
        config.modResults,
        params
      );
      config.modResults = await removePortraitOrientation(
        config,
        config.modResults,
        params
      );
    }
    return config;
  });
};

const LEANBACK_LAUNCHER_CATEGORY = "android.intent.category.LEANBACK_LAUNCHER";

function getMainLaunchIntent(
  androidManifest: AndroidConfig.Manifest.AndroidManifest
) {
  const mainActivity = getMainActivity(androidManifest);
  const intentFilters = mainActivity?.["intent-filter"];
  const mainLaunchIntents = (intentFilters ?? []).filter((i) => {
    const action = i.action ?? [];
    if (action.length === 0) {
      return false;
    }
    return action[0]?.$["android:name"] === "android.intent.action.MAIN";
  });
  return mainLaunchIntents.length ? mainLaunchIntents[0] : undefined;
}

function leanbackLauncherCategoryExistsInMainLaunchIntent(
  mainLaunchIntent: AndroidConfig.Manifest.ManifestIntentFilter
): boolean {
  const mainLaunchCategories = mainLaunchIntent.category ?? [];
  const mainLaunchIntentCategoriesWithLeanbackLauncher =
    mainLaunchCategories.filter(
      (c) => c.$["android:name"] === LEANBACK_LAUNCHER_CATEGORY
    );
  return mainLaunchIntentCategoriesWithLeanbackLauncher.length > 0;
}

export function setLeanBackLauncherIntent(
  _config: Pick<ExpoConfig, "android">,
  androidManifest: AndroidConfig.Manifest.AndroidManifest,
  params: ConfigData
): AndroidConfig.Manifest.AndroidManifest {
  const isTV = isTVEnabled(params);
  const verbose = showVerboseWarnings(params);
  if (isTV) {
    const mainLaunchIntent = getMainLaunchIntent(androidManifest);
    if (!mainLaunchIntent) {
      throw new Error(
        `${pkg.name}@${pkg.version}: no main intent in main activity of Android manifest`
      );
    }
    if (!leanbackLauncherCategoryExistsInMainLaunchIntent(mainLaunchIntent)) {
      // Leanback needs to be added
      if (verbose) {
        WarningAggregator.addWarningAndroid(
          "manifest",
          `${pkg.name}@${pkg.version}: adding TV leanback launcher category to main intent in AndroidManifest.xml`
        );
      }
      const mainLaunchCategories = mainLaunchIntent.category ?? [];
      mainLaunchCategories.push({
        $: {
          "android:name": LEANBACK_LAUNCHER_CATEGORY,
        },
      });
      mainLaunchIntent.category = mainLaunchCategories;
    }
  }
  return androidManifest;
}

export async function removePortraitOrientation(
  _config: Pick<ExpoConfig, "android">,
  androidManifest: AndroidConfig.Manifest.AndroidManifest,
  params: ConfigData
): Promise<AndroidConfig.Manifest.AndroidManifest> {
  const isTV = isTVEnabled(params);
  const verbose = showVerboseWarnings(params);

  const mainActivity = getMainActivity(androidManifest);
  if (mainActivity?.$) {
    const metadata: typeof mainActivity.$ = mainActivity?.$ ?? {};
    if (metadata["android:screenOrientation"] && isTV) {
      if (verbose) {
        WarningAggregator.addWarningAndroid(
          "manifest",
          `${pkg.name}@${pkg.version}: removing screen orientation from AndroidManifest.xml`
        );
      }
      delete metadata["android:screenOrientation"];
    }
  }
  return androidManifest;
}
