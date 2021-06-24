import { ConfigPlugin, XcodeProject } from "@expo/config-plugins";
declare const withDynamicIcon: ConfigPlugin<{
    icons?: string[] | Record<string, {
        image: string;
        prerendered?: boolean;
    }>;
} | void>;
export declare function addIconFileToXcode({ projectRoot, project, projectName, fileName, }: {
    project: XcodeProject;
    projectName: string;
    projectRoot: string;
    fileName: string;
}): XcodeProject;
export default withDynamicIcon;
