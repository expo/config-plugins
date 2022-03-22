import { ConfigPlugin } from "@expo/config-plugins";
export declare const withPodfilePropertiesPackage: ConfigPlugin<string>;
/** Dangerously adds the custom import to the CocoaPods. */
export declare const withCocoaPodsImport: ConfigPlugin;
export declare function addCocoaPodsImport(src: string): string;
