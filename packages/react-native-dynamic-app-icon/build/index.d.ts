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
/**
 * Unlinks assets from iOS project. Removes references for fonts from `Info.plist`
 * fonts provided by application and from `Resources` group
 */
export declare function removeResourceFile(project: XcodeProject, projectDir: string, files: any): void;
export default withDynamicIcon;
