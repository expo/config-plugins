import { ConfigPlugin, XcodeProject } from "@expo/config-plugins";
declare type IosDeploymentTargetConfigPlugin = ConfigPlugin<{
    deploymentTarget: string;
}>;
export declare const withIosDeploymentTarget: IosDeploymentTargetConfigPlugin;
export declare function updateDeploymentTargetXcodeProject(project: XcodeProject, deploymentTarget: string): XcodeProject;
export {};
