import {
  ConfigPlugin,
  WarningAggregator,
  withXcodeProject,
} from "@expo/config-plugins";

export const withBitcodeDisabled: ConfigPlugin = (config) => {
  return withXcodeProject(config, (config) => {
    // @ts-ignore
    if (config.ios.bitcode === true || config.ios.bitcode === "Debug") {
      WarningAggregator.addWarningIOS(
        "ios.bitcode",
        'react-native-webrtc plugin is overwriting project bitcode settings. WebRTC requires bitcode to be disabled for "Release" builds, targeting physical iOS devices.'
      );
    }
    // WebRTC requires Bitcode be disabled for
    // production iOS builds that target devices, e.g. not simulators.
    config.modResults.addBuildProperty("ENABLE_BITCODE", "NO", "Release");

    return config;
  });
};
