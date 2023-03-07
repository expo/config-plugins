"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withPermissions = void 0;
const config_plugins_1 = require("expo/config-plugins");
const CAMERA_USAGE = "Allow $(PRODUCT_NAME) to access your camera";
const MICROPHONE_USAGE = "Allow $(PRODUCT_NAME) to access your microphone";
const withPermissions = (config, props) => {
    return (0, config_plugins_1.withInfoPlist)(config, (config) => {
        const { cameraPermission, microphonePermission } = props || {};
        config.modResults.NSCameraUsageDescription =
            cameraPermission ||
                config.modResults.NSCameraUsageDescription ||
                CAMERA_USAGE;
        config.modResults.NSMicrophoneUsageDescription =
            microphonePermission ||
                config.modResults.NSMicrophoneUsageDescription ||
                MICROPHONE_USAGE;
        return config;
    });
};
exports.withPermissions = withPermissions;
