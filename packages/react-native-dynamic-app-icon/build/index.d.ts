import { ConfigPlugin } from "@expo/config-plugins";
declare const withDynamicIcon: ConfigPlugin<{
    icons?: string[] | Record<string, {
        image: string;
        prerendered?: boolean;
    }>;
} | void>;
export default withDynamicIcon;
