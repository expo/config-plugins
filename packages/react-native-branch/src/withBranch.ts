import { createRunOncePlugin } from "@expo/config-plugins";
import type { ConfigPlugin } from "@expo/config-plugins";

import type { ConfigData } from "./types";
import { withBranchAndroid } from "./withBranchAndroid";
import { withBranchIOS } from "./withBranchIOS";

const withBranch: ConfigPlugin<ConfigData> = (
  config,
  { apiKey, iosAppDomain, iosUniversalLinkDomains } = {}
) => {
  config = withBranchAndroid(config, { apiKey });
  config = withBranchIOS(config, {
    apiKey,
    iosAppDomain,
    iosUniversalLinkDomains,
  });
  return config;
};

let pkg: { name: string; version?: string } = {
  name: "react-native-branch",
};
try {
  const branchPkg = require("react-native-branch/package.json");
  pkg = branchPkg;
} catch {}

export default createRunOncePlugin(withBranch, pkg.name, pkg.version);
