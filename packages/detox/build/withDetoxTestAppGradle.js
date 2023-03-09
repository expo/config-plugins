"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addDetoxDefaultConfigBlock = exports.pushGradleDependency = exports.setGradleAndroidTestImplementation = void 0;
const config_plugins_1 = require("expo/config-plugins");
/**
 * [Step 3](https://github.com/wix/Detox/blob/master/docs/Introduction.Android.md#3-add-the-native-detox-dependency). Add the Native Detox dependency.
 *
 * 1. Add `androidTestImplementation` to the app/build.gradle
 * 2. Add `testInstrumentationRunner` to the app/build.gradle
 * @param config
 */
const withDetoxTestAppGradle = (config) => {
    return (0, config_plugins_1.withAppBuildGradle)(config, (config) => {
        if (config.modResults.language === "groovy") {
            config.modResults.contents = setGradleAndroidTestImplementation(config.modResults.contents);
            config.modResults.contents = addDetoxDefaultConfigBlock(config.modResults.contents);
        }
        else {
            throw new Error("Cannot add Detox maven gradle because the project build.gradle is not groovy");
        }
        return config;
    });
};
function setGradleAndroidTestImplementation(buildGradle) {
    buildGradle = pushGradleDependency(buildGradle, "implementation 'androidx.appcompat:appcompat:1.1.0'");
    buildGradle = pushGradleDependency(buildGradle, "androidTestImplementation('com.wix:detox:+')");
    return buildGradle;
}
exports.setGradleAndroidTestImplementation = setGradleAndroidTestImplementation;
function escapeStringRegexp(str) {
    return str.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&");
}
function pushGradleDependency(buildGradle, dependency) {
    const pattern = new RegExp(escapeStringRegexp(dependency), "g");
    if (buildGradle.match(pattern)) {
        return buildGradle;
    }
    return buildGradle.replace(/dependencies\s?{/, `dependencies {
    ${dependency}`);
}
exports.pushGradleDependency = pushGradleDependency;
function addDetoxDefaultConfigBlock(buildGradle) {
    const pattern = /detox-plugin-default-config/g;
    if (buildGradle.match(pattern)) {
        return buildGradle;
    }
    return buildGradle.replace(/defaultConfig\s?{/, `defaultConfig {
        // detox-plugin-default-config
        testBuildType System.getProperty('testBuildType', 'debug')
        testInstrumentationRunner 'androidx.test.runner.AndroidJUnitRunner'`);
}
exports.addDetoxDefaultConfigBlock = addDetoxDefaultConfigBlock;
exports.default = withDetoxTestAppGradle;
