"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setFacebookConfig = exports.withFacebookManifest = void 0;
const config_plugins_1 = require("@expo/config-plugins");
const { getMainApplicationOrThrow, prefixAndroidKeys } = config_plugins_1.AndroidConfig.Manifest;
const INTERSTITIAL_AD_ACTIVITY = "com.facebook.ads.InterstitialAdActivity";
const withFacebookManifest = (config) => {
    return config_plugins_1.withAndroidManifest(config, (config) => {
        config.modResults = setFacebookConfig(config.modResults);
        return config;
    });
};
exports.withFacebookManifest = withFacebookManifest;
function setFacebookConfig(androidManifest) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let mainApplication = getMainApplicationOrThrow(androidManifest);
    mainApplication = ensureFacebookActivity({ mainApplication });
    return androidManifest;
}
exports.setFacebookConfig = setFacebookConfig;
function ensureFacebookActivity({ mainApplication, }) {
    if (Array.isArray(mainApplication.activity)) {
        // Remove all Facebook InterstitialAdActivity first
        mainApplication.activity = mainApplication.activity.filter((activity) => {
            var _a;
            return ((_a = activity.$) === null || _a === void 0 ? void 0 : _a["android:name"]) !== INTERSTITIAL_AD_ACTIVITY;
        });
    }
    else {
        mainApplication.activity = [];
    }
    mainApplication.activity.push(getFacebookAdActivity());
    return mainApplication;
}
function buildXMLItem({ head, children, }) {
    return { ...(children !== null && children !== void 0 ? children : {}), $: head };
}
function getFacebookAdActivity() {
    /**
  <activity
    android:name="com.facebook.ads.InterstitialAdActivity"
    android:configChanges="keyboardHidden|orientation"
  />
     */
    return buildXMLItem({
        head: prefixAndroidKeys({
            name: INTERSTITIAL_AD_ACTIVITY,
            configChanges: "keyboardHidden|orientation",
        }),
    });
}
/**
 * Apply react-native-fbads configuration for Expo SDK 44 projects.
 */
const withReactNativeFbads = (config) => {
    config = exports.withFacebookManifest(config);
    return config;
};
const pkg = require("react-native-fbads/package.json");
exports.default = config_plugins_1.createRunOncePlugin(withReactNativeFbads, pkg.name, pkg.version);
