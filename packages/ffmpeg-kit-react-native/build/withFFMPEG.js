"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_plugins_1 = require("@expo/config-plugins");
const withAndroidFFMPEGPackage_1 = require("./withAndroidFFMPEGPackage");
const withCocoaPodsImport_1 = require("./withCocoaPodsImport");
const withIosDeploymentTarget_1 = require("./withIosDeploymentTarget");
let pkg = {
    name: "ffmpeg-kit-react-native",
};
try {
    pkg = require("ffmpeg-kit-react-native/package.json");
}
catch (_a) {
    // empty catch block
}
const withFFMPEG = (config, _props) => {
    var _a, _b;
    const props = _props || {};
    const iosPackage = ((_a = props.ios) === null || _a === void 0 ? void 0 : _a.package) || props.package;
    const androidPackage = ((_b = props.android) === null || _b === void 0 ? void 0 : _b.package) || props.package;
    return config_plugins_1.withPlugins(config, [
        // iOS
        [withCocoaPodsImport_1.withPodfilePropertiesPackage, iosPackage],
        [
            withIosDeploymentTarget_1.withIosDeploymentTarget,
            // https://github.com/tanersener/ffmpeg-kit/tree/main/react-native#211-package-names
            { deploymentTarget: "12.1" },
        ],
        withCocoaPodsImport_1.withCocoaPodsImport,
        // Android
        // Set min SDK Version to 24.
        [
            config_plugins_1.AndroidConfig.Version.withBuildScriptExtMinimumVersion,
            {
                name: "minSdkVersion",
                minVersion: 24,
            },
        ],
        [withAndroidFFMPEGPackage_1.withAndroidFFMPEGPackage, androidPackage],
    ]);
};
module.exports = config_plugins_1.createRunOncePlugin(withFFMPEG, pkg.name, pkg.version);
