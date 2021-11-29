"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withBitcodeDisabled = void 0;
const config_plugins_1 = require("@expo/config-plugins");
const withBitcodeDisabled = (config) => {
    return config_plugins_1.withXcodeProject(config, (config) => {
        // @ts-ignore
        if (config.ios.bitcode === true || config.ios.bitcode === "Debug") {
            config_plugins_1.WarningAggregator.addWarningIOS("ios.bitcode", 'react-native-webrtc plugin is overwriting project bitcode settings. WebRTC requires bitcode to be disabled for "Release" builds, targeting physical iOS devices.');
        }
        // WebRTC requires Bitcode be disabled for
        // production iOS builds that target devices, e.g. not simulators.
        config.modResults.addBuildProperty("ENABLE_BITCODE", "NO", "Release");
        return config;
    });
};
exports.withBitcodeDisabled = withBitcodeDisabled;
