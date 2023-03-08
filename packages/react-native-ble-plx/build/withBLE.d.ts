import { ConfigPlugin } from "expo/config-plugins";
import { BackgroundMode } from "./withBLEBackgroundModes";
export { BackgroundMode };
declare const _default: ConfigPlugin<void | {
    isBackgroundEnabled?: boolean | undefined;
    neverForLocation?: boolean | undefined;
    modes?: BackgroundMode[] | undefined;
    bluetoothAlwaysPermission?: string | false | undefined;
}>;
export default _default;
