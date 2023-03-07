"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withBLEBackgroundModes = exports.BackgroundMode = void 0;
const config_plugins_1 = require("expo/config-plugins");
var BackgroundMode;
(function (BackgroundMode) {
    BackgroundMode["Central"] = "central";
    BackgroundMode["Peripheral"] = "peripheral";
})(BackgroundMode = exports.BackgroundMode || (exports.BackgroundMode = {}));
function ensureKey(arr, key) {
    if (!arr.find((mode) => mode === key)) {
        arr.push(key);
    }
    return arr;
}
const centralKey = "bluetooth-central";
const peripheralKey = "bluetooth-peripheral";
/**
 * Append `UIBackgroundModes` to the `Info.plist`.
 */
const withBLEBackgroundModes = (c, modes) => {
    return (0, config_plugins_1.withInfoPlist)(c, (config) => {
        if (!Array.isArray(config.modResults.UIBackgroundModes)) {
            config.modResults.UIBackgroundModes = [];
        }
        if (modes.includes(BackgroundMode.Central)) {
            config.modResults.UIBackgroundModes = ensureKey(config.modResults.UIBackgroundModes, centralKey);
        }
        if (modes.includes(BackgroundMode.Peripheral)) {
            config.modResults.UIBackgroundModes = ensureKey(config.modResults.UIBackgroundModes, peripheralKey);
        }
        // Prevent empty array
        if (!config.modResults.UIBackgroundModes.length) {
            delete config.modResults.UIBackgroundModes;
        }
        return config;
    });
};
exports.withBLEBackgroundModes = withBLEBackgroundModes;
