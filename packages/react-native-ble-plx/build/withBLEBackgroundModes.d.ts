import { ConfigPlugin } from "expo/config-plugins";
export declare enum BackgroundMode {
    Central = "central",
    Peripheral = "peripheral"
}
/**
 * Append `UIBackgroundModes` to the `Info.plist`.
 */
export declare const withBLEBackgroundModes: ConfigPlugin<BackgroundMode[]>;
