import { ConfigPlugin } from "@expo/config-plugins";
import { MergeResults } from "@expo/config-plugins/build/utils/generateCode";
declare type ConfigProps = {
    apiKey: string;
    customEndpoint: string;
};
export declare function addBrazeImport(src: string): MergeResults;
declare const _default: ConfigPlugin<ConfigProps>;
export default _default;
