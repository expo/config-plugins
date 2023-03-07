import { AndroidConfig, ConfigPlugin } from "expo/config-plugins";
export declare function appendDownloadCompleteAction(androidManifest: AndroidConfig.Manifest.AndroidManifest): AndroidConfig.Manifest.AndroidManifest;
export declare function ensureBlobProviderManifest(androidManifest: AndroidConfig.Manifest.AndroidManifest): AndroidConfig.Manifest.AndroidManifest;
export declare function ensureBlobProviderAuthorityString(res: AndroidConfig.Resources.ResourceXML, authority: string): AndroidConfig.Resources.ResourceXML;
declare const _default: ConfigPlugin<void>;
export default _default;
