import { MergeResults } from "@expo/config-plugins/build/utils/generateCode";
import { ConfigPlugin, XML } from "expo/config-plugins";
export declare function addQuickActionsAppDelegateImport(src: string): MergeResults;
export declare function addQuickActionsAppDelegateInit(src: string): MergeResults;
declare const _default: ConfigPlugin<void | {
    iconType?: string | undefined;
    title: string;
    iconSymbolName?: string | undefined;
    iconFile?: string | undefined;
    subtitle?: string | undefined;
    /**
     * A unique string that the system passes to your app
     */
    type: string;
    /**
     * An optional, app-defined dictionary. One use for this dictionary is to provide app version information, as described in the “App Launch and App Update Considerations for Quick Actions” section of the overview in UIApplicationShortcutItem Class Reference.
     */
    userInfo?: XML.XMLObject | undefined;
}[]>;
export default _default;
