"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withBitcodeDisabled = void 0;
const config_plugins_1 = require("@expo/config-plugins");
const withBitcodeDisabled = (config) => {
    var _a, _b;
    if (!config.ios) {
        config.ios = {};
    }
    if (((_a = config.ios) === null || _a === void 0 ? void 0 : _a.bitcode) === false ||
        (((_b = config.ios) === null || _b === void 0 ? void 0 : _b.bitcode) && config.ios.bitcode !== "Debug")) {
        config_plugins_1.WarningAggregator.addWarningIOS("ios.bitcode", 'react-native-webrtc plugin is overwriting project bitcode settings. WebRTC requires bitcode to be disabled for "Release" builds, targeting physical iOS devices.');
    }
    // WebRTC requires Bitcode be disabled for
    // production iOS builds that target devices, e.g. not simulators.
    // SDK +44 property
    config.ios.bitcode = "Debug";
    return config;
};
exports.withBitcodeDisabled = withBitcodeDisabled;
