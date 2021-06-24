"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_plugins_1 = require("@expo/config-plugins");
const withAndroidGoogleCast_1 = require("./withAndroidGoogleCast");
const withIosGoogleCast_1 = require("./withIosGoogleCast");
const withGoogleCast = (config, _props) => {
    const props = _props || {};
    // TODO: Are the Android and iOS receiverAppId values the same?
    config = withIosGoogleCast_1.withIosGoogleCast(config, {
        receiverAppId: props.iosReceiverAppId,
        // disableDiscoveryAutostart?: boolean;
        // startDiscoveryAfterFirstTapOnCastButton?: boolean;
    });
    config = withAndroidGoogleCast_1.withAndroidGoogleCast(config, {
        receiverAppId: props.androidReceiverAppId,
        androidPlayServicesCastFrameworkVersion: props.androidPlayServicesCastFrameworkVersion,
    });
    return config;
};
const pkg = { name: "react-native-google-cast", version: "UNVERSIONED" };
exports.default = config_plugins_1.createRunOncePlugin(withGoogleCast, pkg.name, pkg.version);
