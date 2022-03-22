import {
  AndroidConfig,
  ConfigPlugin,
  createRunOncePlugin,
  withPlugins,
} from "@expo/config-plugins";

import { withAndroidFFMPEGPackage } from "./withAndroidFFMPEGPackage";
import {
  withCocoaPodsImport,
  withPodfilePropertiesPackage,
} from "./withCocoaPodsImport";
import { withIosDeploymentTarget } from "./withIosDeploymentTarget";

let pkg: { name: string; version?: string } = {
  name: "ffmpeg-kit-react-native",
};
try {
  pkg = require("ffmpeg-kit-react-native/package.json");
} catch {
  // empty catch block
}

type Package =
  | "min"
  | "min-gpl"
  | "https"
  | "https-gpl"
  | "audio"
  | "video"
  | "full"
  | "full-gpl";

export type Props = {
  package?: Package;
  ios?: { package?: Package };
  android?: { package?: Package };
};

const withFFMPEG: ConfigPlugin<void | Props> = (config, _props) => {
  const props = _props || {};
  const iosPackage = props.ios?.package || props.package;
  const androidPackage = props.android?.package || props.package;
  return withPlugins(config, [
    // iOS

    [withPodfilePropertiesPackage, iosPackage],
    [
      withIosDeploymentTarget,
      // https://github.com/tanersener/ffmpeg-kit/tree/main/react-native#211-package-names
      { deploymentTarget: "12.1" },
    ],
    withCocoaPodsImport,

    // Android

    // Set min SDK Version to 24.
    [
      AndroidConfig.Version.withBuildScriptExtMinimumVersion,
      {
        name: "minSdkVersion",
        minVersion: 24,
      },
    ],
    [withAndroidFFMPEGPackage, androidPackage],
  ]);
};

module.exports = createRunOncePlugin(withFFMPEG, pkg.name, pkg.version);
