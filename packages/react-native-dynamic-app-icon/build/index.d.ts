import { ConfigPlugin } from "expo/config-plugins";
declare type IconSet = Record<string, {
    image: string;
    prerendered?: boolean;
}>;
declare const withDynamicIcon: ConfigPlugin<string[] | IconSet | void>;
export default withDynamicIcon;
