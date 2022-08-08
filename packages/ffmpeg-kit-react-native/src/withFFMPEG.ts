import {
  ConfigPlugin,
  createRunOncePlugin,
  withPlugins,
} from "@expo/config-plugins";
import { withBuildProperties } from "expo-build-properties";

import { withAndroidFFMPEGPackage } from "./withAndroidFFMPEGPackage";
import {
  withCocoaPodsImport,
  withPodfilePropertiesPackage,
} from "./withCocoaPodsImport";

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
    withCocoaPodsImport,

    // Android

    // Set min SDK Version to 24.
    [
      withBuildProperties,
      {
        android: {
          // https://github.com/expo/expo/blob/sdk-46/templates/expo-template-bare-minimum/android/build.gradle#L8
          minSdkVersion: 24,
        },
      },
    ],
    [withAndroidFFMPEGPackage, androidPackage],
  ]);
};

module.exports = createRunOncePlugin(withFFMPEG, pkg.name, pkg.version);
