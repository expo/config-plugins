import { ConfigPlugin } from "expo/config-plugins";
import { BackgroundMode } from "./withBLEBackgroundModes";
export { BackgroundMode };
declare const _default: ConfigPlugin<void | {
    neverForLocation?: boolean | undefined;
    modes?: BackgroundMode[] | undefined;
    bluetoothAlwaysPermission?: string | false | undefined;
    isRequired?: boolean | undefined;
    canDiscover?: boolean | undefined;
    isDiscoverable?: boolean | undefined;
    canConnect?: boolean | undefined;
}>;
export default _default;
