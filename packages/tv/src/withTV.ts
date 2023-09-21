import { ConfigPlugin, createRunOncePlugin } from "expo/config-plugins";

import { ConfigData } from "./types";
import { withTVPodfile } from "./withTVPodfile";
import { withTVSplashScreen } from "./withTVSplashScreen";
import { withTVXcodeProject } from "./withTVXcodeProject";

const withTVPlugin: ConfigPlugin<ConfigData> = (config, params = {}) => {
  config = withTVXcodeProject(config, params);
  config = withTVPodfile(config, params);
  config = withTVSplashScreen(config, params);

  return config;
};

const pkg = {
  name: "tv",
  version: "UNVERSIONED",
};

export default createRunOncePlugin(withTVPlugin, pkg.name, pkg.version);
