import { ConfigPlugin } from "expo/config-plugins";
export type IOSPermissionsProps = {
    cameraPermission?: string;
    microphonePermission?: string;
};
export declare const withPermissions: ConfigPlugin<IOSPermissionsProps | void>;
