import {
  mergeContents,
  removeContents,
} from "@expo/config-plugins/build/utils/generateCode";
import {
  ConfigPlugin,
  WarningAggregator,
  withDangerousMod,
} from "expo/config-plugins";
import { promises } from "fs";
import path from "path";

import { ConfigData } from "./types";
import { isTVEnabled, showVerboseWarnings } from "./utils";

const pkg = require("../package.json");

/** Dangerously makes or reverts TV changes in the project Podfile. */
export const withTVPodfile: ConfigPlugin<ConfigData> = (c, params = {}) => {
  const isTV = isTVEnabled(params);
  const verbose = showVerboseWarnings(params);

  return withDangerousMod(c, [
    "ios",
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    async (config) => {
      const file = path.join(config.modRequest.platformProjectRoot, "Podfile");

      const contents = await promises.readFile(file, "utf8");

      const modifiedContents = isTV
        ? addTVPodfileModifications(contents)
        : removeTVPodfileModifications(contents);

      if (modifiedContents !== contents) {
        if (verbose) {
          WarningAggregator.addWarningIOS(
            "podfile",
            `${pkg.name}@${pkg.version}: modifying Podfile for ${
              isTV ? "tvOS" : "iOS"
            }`
          );
        }
        await promises.writeFile(file, modifiedContents, "utf-8");
      }
      return config;
    },
  ]);
};

const MOD_TAG = "react-native-tvos-import";

export function removeTVPodfileModifications(src: string): string {
  if (src.indexOf("platform :tvos") === -1) {
    return src;
  }
  const intermediateSrc = src.replace("platform :tvos", "platform :ios");
  const newSrc = removeContents({
    src: intermediateSrc,
    tag: MOD_TAG,
  }).contents;
  if (!newSrc) {
    throw new Error(
      `${pkg.name}@${pkg.version}: Error in removing TV modifications from Podfile. Recommend running "npx expo prebuild --clean"`
    );
  }
  return newSrc;
}

export function addTVPodfileModifications(src: string): string {
  if (src.indexOf("platform :tvos") !== -1) {
    return src;
  }
  const newSrc = mergeContents({
    tag: MOD_TAG,
    src,
    newSrc:
      "source 'https://github.com/react-native-tvos/react-native-tvos-podspecs.git'\nsource 'https://cdn.cocoapods.org/'\n",
    anchor: /^/,
    offset: 0,
    comment: "#",
  }).contents;

  return newSrc.replace("platform :ios", "platform :tvos");
}
