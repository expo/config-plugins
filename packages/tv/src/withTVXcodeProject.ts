import { ExpoConfig } from "@expo/config-types";
import {
  ConfigPlugin,
  WarningAggregator,
  withXcodeProject,
  XcodeProject,
} from "expo/config-plugins";

import { ConfigData } from "./types";
import { isTVEnabled, showVerboseWarnings } from "./utils";

export const withTVXcodeProject: ConfigPlugin<ConfigData> = (
  config,
  params
) => {
  const isTV = isTVEnabled(params);
  if (showVerboseWarnings(params)) {
    WarningAggregator.addWarningIOS(
      "ios.xcodeproject",
      `@config-plugins/tv: modifying Xcode project for ${isTV ? "tvOS" : "iOS"}`
    );
  }
  return withXcodeProject(config, async (config) => {
    config.modResults = await setXcodeProjectBuildSettings(config, {
      project: config.modResults,
      isTV,
    });
    return config;
  });
};

export function setXcodeProjectBuildSettings(
  config: Pick<ExpoConfig, "ios">,
  { project, isTV }: { project: XcodeProject; isTV: boolean }
): XcodeProject {
  const deviceFamilies = formatDeviceFamilies(getDeviceFamilies(config));
  const configurations = project.pbxXCBuildConfigurationSection();
  // @ts-ignore
  for (const { buildSettings } of Object.values(configurations || {})) {
    // Guessing that this is the best way to emulate Xcode.
    // Using `project.addToBuildSettings` modifies too many targets.
    if (typeof buildSettings?.PRODUCT_NAME !== "undefined") {
      if (isTV) {
        buildSettings.TARGETED_DEVICE_FAMILY = "3";
        buildSettings.TVOS_DEPLOYMENT_TARGET = "13.0";
        buildSettings.SDKROOT = "appletvos";
        if (typeof buildSettings?.IOS_DEPLOYMENT_TARGET !== "undefined") {
          delete buildSettings?.IOS_DEPLOYMENT_TARGET;
        }
      } else {
        buildSettings.TARGETED_DEVICE_FAMILY = deviceFamilies;
        buildSettings.IOS_DEPLOYMENT_TARGET = "13.0";
        buildSettings.SDKROOT = "iphoneos";
        if (typeof buildSettings?.TVOS_DEPLOYMENT_TARGET !== "undefined") {
          delete buildSettings?.TVOS_DEPLOYMENT_TARGET;
        }
      }
    }
  }

  return project;
}

/**
 * Wrapping the families in double quotes is the only way to set a value with a comma in it.
 *
 * @param deviceFamilies
 */
export function formatDeviceFamilies(deviceFamilies: number[]): string {
  return `"${deviceFamilies.join(",")}"`;
}

export function getSupportsTablet(config: Pick<ExpoConfig, "ios">): boolean {
  return !!config.ios?.supportsTablet;
}

export function getIsTabletOnly(config: Pick<ExpoConfig, "ios">): boolean {
  return !!config?.ios?.isTabletOnly;
}

export function getDeviceFamilies(config: Pick<ExpoConfig, "ios">): number[] {
  const supportsTablet = getSupportsTablet(config);
  const isTabletOnly = getIsTabletOnly(config);

  if (isTabletOnly && config.ios?.supportsTablet === false) {
    // add warning
  }

  // 1 is iPhone, 2 is iPad
  if (isTabletOnly) {
    return [2];
  } else if (supportsTablet) {
    return [1, 2];
  } else {
    // is iPhone only
    return [1];
  }
}
