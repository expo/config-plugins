import { ConfigPlugin } from "expo/config-plugins";
declare const withCallkeep: ConfigPlugin;
export declare const withXcodeLinkBinaryWithLibraries: ConfigPlugin<{
    library: string;
    status?: string;
}>;
export default withCallkeep;
