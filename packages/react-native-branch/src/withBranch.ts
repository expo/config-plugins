import { createRunOncePlugin, withPlugins } from "@expo/config-plugins";
import type { ConfigPlugin } from "@expo/config-plugins";

import { withBranchAndroid } from "./withBranchAndroid";
import { withBranchIos } from "./withBranchIOS";
import type { ConfigData } from "./types";

const withBranch: ConfigPlugin<ConfigData> = (config, { apiKey, appDomain }) => {
  return withPlugins(
    config,
    [
      [withBranchIos, { apiKey, appDomain }],
      [withBranchAndroid, { apiKey }],
    ]
  );
};

let pkg: { name: string; version?: string } = {
  name: "branch",
};
try {
  const branchPkg = require("react-native-branch/package.json");
  pkg = branchPkg;
} catch {}

export default createRunOncePlugin(withBranch, pkg.name, pkg.version);
