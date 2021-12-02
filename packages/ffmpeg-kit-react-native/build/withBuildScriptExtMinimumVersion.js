"use strict";
// Copied from https://github.com/expo/expo-cli/blob/main/packages/config-plugins/src/android/Version.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.setMinBuildScriptExtVersion = exports.withBuildScriptExtMinimumVersion = void 0;
const config_plugins_1 = require("@expo/config-plugins");
/** Sets a numeric version for a value in the project.gradle buildscript.ext object to be at least the provided props.minVersion, if the existing value is greater then no change will be made. */
const withBuildScriptExtMinimumVersion = (config, props) => {
    return config_plugins_1.withProjectBuildGradle(config, (config) => {
        if (config.modResults.language === "groovy") {
            config.modResults.contents = setMinBuildScriptExtVersion(config.modResults.contents, props);
        }
        else {
            config_plugins_1.WarningAggregator.addWarningAndroid("withBuildScriptExtVersion", `Cannot automatically configure project build.gradle if it's not groovy`);
        }
        return config;
    });
};
exports.withBuildScriptExtMinimumVersion = withBuildScriptExtMinimumVersion;
function setMinBuildScriptExtVersion(buildGradle, { name, minVersion }) {
    var _a;
    const regex = new RegExp(`(${name}\\s?=\\s?)(\\d+(?:\\.\\d+)?)`);
    const currentVersion = (_a = buildGradle.match(regex)) === null || _a === void 0 ? void 0 : _a[2];
    if (!currentVersion) {
        config_plugins_1.WarningAggregator.addWarningAndroid("withBuildScriptExtVersion", `Cannot set minimum buildscript.ext.${name} version because the property "${name}" cannot be found or does not have a numeric value.`);
        // TODO: Maybe just add the property...
        return buildGradle;
    }
    const currentVersionNum = Number(currentVersion);
    return buildGradle.replace(regex, `$1${Math.max(minVersion, currentVersionNum)}`);
}
exports.setMinBuildScriptExtVersion = setMinBuildScriptExtVersion;
