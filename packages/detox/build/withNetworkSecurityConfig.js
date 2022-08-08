"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withNetworkSecurityConfigManifest = exports.getTemplateFile = void 0;
const config_plugins_1 = require("@expo/config-plugins");
const assert_1 = __importDefault(require("assert"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function getTemplateConfigContent(subdomains) {
    if (subdomains === "*") {
        // allow all domains
        return '<base-config cleartextTrafficPermitted="true" />';
    }
    return `
    <domain-config cleartextTrafficPermitted="true">
      ${subdomains
        .map((subdomain) => `<domain includeSubdomains="true">${subdomain}</domain>`)
        .join("")}
    </domain-config>
  `;
}
function getTemplateFile(subdomains) {
    const content = getTemplateConfigContent(subdomains);
    /**
     * May not have new lines or spaces in the beginning.
     * Otherwise build fails with:
     * "AAPT: error: XML or text declaration not at start of entity"
     */
    return `<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
${content}
</network-security-config>`;
}
exports.getTemplateFile = getTemplateFile;
/**
 * Create `network_security_config.xml` resource file.
 */
const withNetworkSecurityConfigFile = (config, { subdomains }) => {
    return (0, config_plugins_1.withDangerousMod)(config, [
        "android",
        async (config) => {
            var _a;
            const packageName = (_a = config.android) === null || _a === void 0 ? void 0 : _a.package;
            (0, assert_1.default)(packageName, "android.package must be defined");
            const folder = path_1.default.join(config.modRequest.platformProjectRoot, `app/src/main/res/xml`);
            fs_1.default.mkdirSync(folder, { recursive: true });
            fs_1.default.writeFileSync(path_1.default.join(folder, "network_security_config.xml"), getTemplateFile(subdomains), { encoding: "utf8" });
            return config;
        },
    ]);
};
/**
 * [Step 6](https://github.com/wix/Detox/blob/master/docs/Introduction.Android.md#6-enable-clear-text-unencrypted-traffic-for-detox). Link the `network_security_config.xml` file to the `AndroidManifest.xml`.
 */
const withNetworkSecurityConfigManifest = (config, props) => {
    if (!props || !props.subdomains) {
        // (*) 10.0.2.2 for Google emulators, 10.0.3.2 for Genymotion emulators.
        // https://developer.android.com/training/articles/security-config
        props = { subdomains: ["10.0.2.2", "localhost"] };
    }
    if (typeof props.subdomains === "object" && !props.subdomains.length) {
        // if subdomains is an empty array, skip network config mod
        return config;
    }
    config = withNetworkSecurityConfigFile(config, props);
    return (0, config_plugins_1.withAndroidManifest)(config, (config) => {
        const application = config_plugins_1.AndroidConfig.Manifest.getMainApplicationOrThrow(config.modResults);
        application.$["android:networkSecurityConfig"] =
            "@xml/network_security_config";
        return config;
    });
};
exports.withNetworkSecurityConfigManifest = withNetworkSecurityConfigManifest;
