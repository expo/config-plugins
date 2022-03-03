import { ConfigPlugin } from "@expo/config-plugins";
export declare type SubdomainsType = string[] | "*";
export declare function getTemplateFile(subdomains: SubdomainsType): string;
/**
 * [Step 6](https://github.com/wix/Detox/blob/master/docs/Introduction.Android.md#6-enable-clear-text-unencrypted-traffic-for-detox). Link the `network_security_config.xml` file to the `AndroidManifest.xml`.
 */
export declare const withNetworkSecurityConfigManifest: ConfigPlugin<{
    subdomains: SubdomainsType;
} | void>;
