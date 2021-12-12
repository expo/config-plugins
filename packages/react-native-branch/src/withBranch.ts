import { createRunOncePlugin } from "@expo/config-plugins";
import type { ConfigPlugin } from "@expo/config-plugins";

import { withBranchAndroid } from "./withBranchAndroid";
import { withBranchIOS } from "./withBranchIOS";
import type { ConfigData } from "./types";

const withBranch: ConfigPlugin<ConfigData> = (config, { apiKey, iosAppDomain } = {}) => {
  config = withBranchAndroid(config, { apiKey });
  config = withBranchIOS(config, { apiKey, iosAppDomain });
  return config;
};

let pkg: { name: string; version?: string } = {
  name: "branch",
};
try {
  const branchPkg = require("react-native-branch/package.json");
  pkg = branchPkg;
} catch {}

export default createRunOncePlugin(withBranch, pkg.name, pkg.version);
