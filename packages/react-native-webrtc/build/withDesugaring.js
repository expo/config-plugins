"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withDesugaring = void 0;
const config_plugins_1 = require("@expo/config-plugins");
/**
 * Set the `android.enableDexingArtifactTransform.desugaring` value in the static `gradle.properties` file.
 * This is used to disable desugaring to fix weird Android bugs. [Learn more](https://github.com/jitsi/jitsi-meet/issues/7911#issuecomment-714323255).
 */
const withDesugaring = (config, isDisabled) => {
    const desugaringKey = "android.enableDexingArtifactTransform.desugaring";
    return config_plugins_1.withGradleProperties(config, (config) => {
        config.modResults = config.modResults.filter((item) => {
            if (item.type == "property" && item.key === desugaringKey) {
                return false;
            }
            return true;
        });
        config.modResults.push({
            type: "property",
            key: desugaringKey,
            value: String(!isDisabled),
        });
        return config;
    });
};
exports.withDesugaring = withDesugaring;
