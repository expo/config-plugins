"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_plugins_1 = require("@expo/config-plugins");
/**
 * Apply android-jsc-intl configuration for Expo SDK 42 projects.
 */
const withAndroidJscIntl = (config, _props = {}) => {
    // Support passing no props to the plugin.
    const props = _props || {};
    // Return the modified config.
    return config;
};
const pkg = {
    // Prevent this plugin from being run more than once.
    // This pattern enables users to safely migrate off of this
    // out-of-tree `@config-plugins/android-jsc-intl` to a future
    // upstream plugin in `android-jsc-intl`
    name: "android-jsc-intl",
    // Indicates that this plugin is dangerously linked to a module,
    // and might not work with the latest version of that module.
    version: "UNVERSIONED",
};
exports.default = config_plugins_1.createRunOncePlugin(withAndroidJscIntl, pkg.name, pkg.version);
