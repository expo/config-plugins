export type ContentsJsonImageIdiom = "iphone" | "ipad" | "ios-marketing" | "universal";
export type ContentsJsonImageAppearance = {
    appearance: "luminosity";
    value: "dark";
};
export type ContentsJsonImageScale = "1x" | "2x" | "3x";
export interface ContentsJsonImage {
    appearances?: ContentsJsonImageAppearance[];
    idiom: ContentsJsonImageIdiom;
    size?: string;
    scale: ContentsJsonImageScale;
    filename?: string;
    platform?: string;
}
export declare function generateImessageIconsAsync(projectRoot: string, icon: string, iconsPath: string): Promise<ContentsJsonImage[]>;
