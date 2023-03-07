"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withBitcodeDisabled = void 0;
const config_plugins_1 = require("expo/config-plugins");
const withBitcodeDisabled = (config) => {
    if (!config.ios) {
        config.ios = {};
    }
    if (config.ios?.bitcode != null && config.ios?.bitcode !== false) {
        config_plugins_1.WarningAggregator.addWarningIOS("ios.bitcode", "react-native-webrtc plugin is overwriting project bitcode settings. WebRTC requires bitcode to be disabled for builds, targeting physical iOS devices.");
    }
    // WebRTC requires Bitcode be disabled for
    // production AND development iOS builds that target devices, e.g. not simulators.
    // SDK +44 property
    config.ios.bitcode = false;
    return config;
};
exports.withBitcodeDisabled = withBitcodeDisabled;
