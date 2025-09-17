import { ConfigPlugin, createRunOncePlugin } from "expo/config-plugins";

import {
  AndroidParams,
  withGoogleSigninAndroid,
} from "./withGoogleSigninAndroid";
import { IosParams, withGoogleSigninIos } from "./withGoogleSigninIos";

const withGoogleSigninPlugin: ConfigPlugin<AndroidParams & IosParams> = (
  config,
  options,
) => {
  config = withGoogleSigninAndroid(config, options);
  config = withGoogleSigninIos(config, options);
  return config;
};

const pkg = {
  // Prevent this plugin from being run more than once.
  // This pattern enables users to safely migrate off of this
  // out-of-tree `@config-plugins/react-native-google-signin` to a future
  // upstream plugin in `react-native-google-signin`
  name: "react-native-google-signin",
  // Indicates that this plugin is dangerously linked to a module,
  // and might not work with the latest version of that module.
  version: "UNVERSIONED",
};

export default createRunOncePlugin(
  withGoogleSigninPlugin,
  pkg.name,
  pkg.version,
);
