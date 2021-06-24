import { ConfigPlugin } from "@expo/config-plugins";
/**
 * Set the `android.enableDexingArtifactTransform.desugaring` value in the static `gradle.properties` file.
 * This is used to disable desugaring to fix weird Android bugs. [Learn more](https://github.com/jitsi/jitsi-meet/issues/7911#issuecomment-714323255).
 */
export declare const withDesugaring: ConfigPlugin<boolean>;
