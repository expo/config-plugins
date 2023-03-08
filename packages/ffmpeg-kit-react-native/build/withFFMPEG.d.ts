type Package = "min" | "min-gpl" | "https" | "https-gpl" | "audio" | "video" | "full" | "full-gpl";
export type Props = {
    package?: Package;
    ios?: {
        package?: Package;
    };
    android?: {
        package?: Package;
    };
};
export {};
