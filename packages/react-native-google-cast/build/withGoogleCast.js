"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_plugins_1 = require("expo/config-plugins");
const withAndroidGoogleCast_1 = require("./withAndroidGoogleCast");
const withIosGoogleCast_1 = require("./withIosGoogleCast");
const withGoogleCast = (config, _props) => {
    const props = _props || {};
    // TODO: Are the Android and iOS receiverAppId values the same?
    config = (0, withIosGoogleCast_1.withIosGoogleCast)(config, {
        receiverAppId: props.iosReceiverAppId,
        // disableDiscoveryAutostart?: boolean;
        // startDiscoveryAfterFirstTapOnCastButton?: boolean;
    });
    config = (0, withAndroidGoogleCast_1.withAndroidGoogleCast)(config, {
        receiverAppId: props.androidReceiverAppId,
        androidPlayServicesCastFrameworkVersion: props.androidPlayServicesCastFrameworkVersion,
    });
    return config;
};
exports.default = (0, config_plugins_1.createRunOncePlugin)(withGoogleCast, "react-native-google-cast");
