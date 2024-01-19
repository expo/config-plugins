"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_plugins_1 = require("expo/config-plugins");
const expo_build_properties_1 = require("expo-build-properties");
const kotlinClassPath = "org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlinVersion";
/**
 * Lifted from [unimodules-test-core](https://github.com/expo/expo/blob/master/packages/unimodules-test-core/app.plugin.js).
 *
 * @param config Expo config
 * @param version Kotlin version to use
 */
const withKotlinGradle = (config, version) => {
    config = (0, expo_build_properties_1.withBuildProperties)(config, {
        android: {
            kotlinVersion: version,
        },
    });
    return (0, config_plugins_1.withProjectBuildGradle)(config, (config) => {
        // Add the classpath to the project build.gradle
        if (config.modResults.language === "groovy") {
            config.modResults.contents = setKotlinClassPath(config.modResults.contents);
        }
        else {
            throw new Error("Cannot setup kotlin because the build.gradle is not groovy");
        }
        return config;
    });
};
function setKotlinClassPath(buildGradle) {
    if (buildGradle.includes(kotlinClassPath)) {
        return buildGradle;
    }
    return buildGradle.replace(/dependencies\s?{/, `dependencies {
        classpath "${kotlinClassPath}"`);
}
exports.default = withKotlinGradle;
