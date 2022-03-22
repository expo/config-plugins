import { ConfigPlugin } from "@expo/config-plugins";
export declare type IOSPermissionsProps = {
    cameraPermission?: string;
    microphonePermission?: string;
};
export declare const withPermissions: ConfigPlugin<IOSPermissionsProps | void>;
