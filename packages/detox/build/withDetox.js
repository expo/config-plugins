"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_plugins_1 = require("expo/config-plugins");
const withDetoxProjectGradle_1 = __importDefault(require("./withDetoxProjectGradle"));
const withDetoxTestAppGradle_1 = __importDefault(require("./withDetoxTestAppGradle"));
const withDetoxTestClass_1 = require("./withDetoxTestClass");
const withKotlinGradle_1 = __importDefault(require("./withKotlinGradle"));
const withNetworkSecurityConfig_1 = require("./withNetworkSecurityConfig");
const withProguardGradle_1 = __importDefault(require("./withProguardGradle"));
const withDetox = (config, { skipProguard, subdomains } = {}) => {
    return (0, config_plugins_1.withPlugins)(config, [
        // 3.
        withDetoxProjectGradle_1.default,
        // 3.
        withDetoxTestAppGradle_1.default,
        // 4.
        [
            withKotlinGradle_1.default,
            // Minimum version of Kotlin required to work with expo packages in SDK 49
            // React Native 72 https://github.com/wix/Detox/blob/f26b13ebacdbb9ca2beafbc2c8b4c8ea1bbb3139/detox/android/build.gradle#L6C26-L6C32
            "1.8.22",
        ],
        // 5.
        withDetoxTestClass_1.withDetoxTestClass,
        // 6.
        [withNetworkSecurityConfig_1.withNetworkSecurityConfigManifest, { subdomains }],
        // 7.
        !skipProguard && withProguardGradle_1.default,
    ].filter(Boolean));
};
let pkg = {
    name: "detox",
    // UNVERSIONED...
};
try {
    const detoxPkg = require("detox/package.json");
    pkg = detoxPkg;
}
catch { }
exports.default = (0, config_plugins_1.createRunOncePlugin)(withDetox, pkg.name, pkg.version);
