import { ConfigPlugin } from "@expo/config-plugins";
/** Sets a numeric version for a value in the project.gradle buildscript.ext object to be at least the provided props.minVersion, if the existing value is greater then no change will be made. */
export declare const withBuildScriptExtMinimumVersion: ConfigPlugin<{
    name: string;
    minVersion: number;
}>;
export declare function setMinBuildScriptExtVersion(buildGradle: string, { name, minVersion }: {
    name: string;
    minVersion: number;
}): string;
