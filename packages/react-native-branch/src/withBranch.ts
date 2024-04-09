import { ConfigPlugin, createRunOncePlugin } from "expo/config-plugins";

import { ConfigData } from "./types";
import { withBranchAndroid } from "./withBranchAndroid";
import { withBranchIOS } from "./withBranchIOS";

const withBranch: ConfigPlugin<ConfigData> = (config, branchConfig = {}) => {
  config = withBranchAndroid(config, branchConfig);
  config = withBranchIOS(config, branchConfig);

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
