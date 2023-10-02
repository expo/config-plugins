import { ConfigPlugin, createRunOncePlugin } from "expo/config-plugins";

import { ConfigData } from "./types";
import { withTVAndroidManifest } from "./withTVAndroidManifest";
import { withTVPodfile } from "./withTVPodfile";
import { withTVSplashScreen } from "./withTVSplashScreen";
import { withTVXcodeProject } from "./withTVXcodeProject";

const withTVPlugin: ConfigPlugin<ConfigData> = (config, params = {}) => {
  config = withTVXcodeProject(config, params);
  config = withTVPodfile(config, params);
  config = withTVSplashScreen(config, params);
  config = withTVAndroidManifest(config, params);

  return config;
};

const pkg = require("../package.json");

export default createRunOncePlugin(withTVPlugin, pkg.name, pkg.version);
