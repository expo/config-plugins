import { XcodeProject } from "@expo/config-plugins";
export declare function getMainPBXGroup(proj: XcodeProject): {
    id: any;
    obj: any;
} | null;
export declare function addStickerResourceFile(proj: XcodeProject, path: string, rootFolderName: string): any;
export declare function addStickersTarget(proj: XcodeProject, name: string, bundleId: string, subfolder: string, stickerBundleId?: string): false | {
    uuid: any;
    pbxNativeTarget: {
        isa: string;
        name: string;
        productName: string;
        productReference: any;
        productType: string;
        buildConfigurationList: any;
        buildPhases: never[];
        buildRules: never[];
        dependencies: never[];
    };
};
