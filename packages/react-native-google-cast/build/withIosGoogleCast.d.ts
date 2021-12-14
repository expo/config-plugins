import { ConfigPlugin } from "@expo/config-plugins";
export declare const withIosGoogleCast: ConfigPlugin<{
    /**
     * @default 'CC1AD845'
     */
    receiverAppId?: string;
}>;
export declare const MATCH_INIT: RegExp;
declare type IosProps = {
    receiverAppId?: string | null;
    disableDiscoveryAutostart?: boolean;
    startDiscoveryAfterFirstTapOnCastButton?: boolean;
};
export declare function addGoogleCastAppDelegateDidFinishLaunchingWithOptions(src: string, { receiverAppId, disableDiscoveryAutostart, startDiscoveryAfterFirstTapOnCastButton, }?: IosProps): import("@expo/config-plugins/build/utils/generateCode").MergeResults;
export {};
