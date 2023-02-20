"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addDetoxDefaultConfigBlock = exports.setGradleAndroidTestImplementationForTestButler = exports.setGradleAndroidTestImplementation = void 0;
const config_plugins_1 = require("@expo/config-plugins");
const node_assert_1 = __importDefault(require("node:assert"));
/**
 * [Step 3](https://github.com/wix/Detox/blob/master/docs/Introduction.Android.md#3-add-the-native-detox-dependency). Add the Native Detox dependency.
 *
 * 1. Add `androidTestImplementation` to the app/build.gradle
 * 2. Add `testInstrumentationRunner` to the app/build.gradle
 * @param config
 */
const withDetoxTestAppGradle = (includeTestButler) => {
    return (config) => {
        const packageName = config.android?.package;
        (0, node_assert_1.default)(packageName, "android.package must be defined");
        const testRunnerClass = includeTestButler
            ? `${packageName}.DetoxTestAppJUnitRunner`
            : "androidx.test.runner.AndroidJUnitRunner";
        console.log(includeTestButler, testRunnerClass);
        return (0, config_plugins_1.withAppBuildGradle)(config, (config) => {
            if (config.modResults.language === "groovy") {
                config.modResults.contents = setGradleAndroidTestImplementation(config.modResults.contents);
                config.modResults.contents = addDetoxDefaultConfigBlock(config.modResults.contents, testRunnerClass);
                if (includeTestButler) {
                    config.modResults.contents =
                        setGradleAndroidTestImplementationForTestButler(config.modResults.contents);
                }
            }
            else {
                throw new Error("Cannot add Detox maven gradle because the project build.gradle is not groovy");
            }
            return config;
        });
    };
};
function setGradleAndroidTestImplementation(buildGradle) {
    const pattern = /androidTestImplementation\('com.wix:detox:\+'\)/g;
    if (buildGradle.match(pattern)) {
        return buildGradle;
    }
    return buildGradle.replace(/dependencies\s?{/, `dependencies {
    androidTestImplementation('com.wix:detox:+')`);
}
exports.setGradleAndroidTestImplementation = setGradleAndroidTestImplementation;
function setGradleAndroidTestImplementationForTestButler(buildGradle) {
    const pattern = /androidTestImplementation 'com\.linkedin\.testbutler:test-butler-library:2\.2\.1'/g;
    if (buildGradle.match(pattern)) {
        return buildGradle;
    }
    return buildGradle.replace(/dependencies\s?{/, `dependencies {
    androidTestImplementation 'com.linkedin.testbutler:test-butler-library:2.2.1'`);
}
exports.setGradleAndroidTestImplementationForTestButler = setGradleAndroidTestImplementationForTestButler;
function addDetoxDefaultConfigBlock(buildGradle, testRunnerClass) {
    const pattern = /detox-plugin-default-config/g;
    if (buildGradle.match(pattern)) {
        return buildGradle;
    }
    return buildGradle.replace(/defaultConfig\s?{/, `defaultConfig {
        // detox-plugin-default-config
        testBuildType System.getProperty('testBuildType', 'debug')
        testInstrumentationRunner '${testRunnerClass}'`);
}
exports.addDetoxDefaultConfigBlock = addDetoxDefaultConfigBlock;
exports.default = withDetoxTestAppGradle;
