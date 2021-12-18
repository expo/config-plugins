import { ConfigPlugin, WarningAggregator } from "@expo/config-plugins";

export const withBitcodeDisabled: ConfigPlugin = (config) => {
  if (!config.ios) {
    config.ios = {};
  }

  if (
    config.ios?.bitcode === false ||
    (config.ios?.bitcode && config.ios.bitcode !== "Debug")
  ) {
    WarningAggregator.addWarningIOS(
      "ios.bitcode",
      'react-native-webrtc plugin is overwriting project bitcode settings. WebRTC requires bitcode to be disabled for "Release" builds, targeting physical iOS devices.'
    );
  }
  // WebRTC requires Bitcode be disabled for
  // production iOS builds that target devices, e.g. not simulators.
  // SDK +44 property
  config.ios.bitcode = "Debug";
  return config;
};
