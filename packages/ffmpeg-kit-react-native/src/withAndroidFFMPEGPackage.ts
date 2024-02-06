import {
  createGeneratedHeaderComment,
  MergeResults,
  removeGeneratedContents,
} from "@expo/config-plugins/build/utils/generateCode";
import { ExpoConfig } from "expo/config";
import {
  ConfigPlugin,
  withGradleProperties,
  withProjectBuildGradle,
} from "expo/config-plugins";

export const withAndroidFFMPEGPackage: ConfigPlugin<string | undefined> = (
  config,
  packageName,
) => {
  config = withProjectBuildGradle(config, (config) => {
    if (config.modResults.language === "groovy") {
      config.modResults.contents = addPackageName(
        config.modResults.contents,
        packageName,
      );
    } else {
      throw new Error(
        "Cannot add camera maven gradle because the build.gradle is not groovy",
      );
    }
    return config;
  });

  config = withLibCppSharedSo(config);

  return config;
};

export function addPackageName(src: string, packageName?: string): string {
  const tag = "ffmpeg-kit-react-native-package";
  const gradleMaven = packageName
    ? `ext { ffmpegKitPackage = "${packageName}" }`
    : "";
  return appendContents({
    tag,
    src,
    newSrc: gradleMaven,
    comment: "//",
  }).contents;
}

// Fork of config-plugins mergeContents, but appends the contents to the end of the file.
function appendContents({
  src,
  newSrc,
  tag,
  comment,
}: {
  src: string;
  newSrc: string;
  tag: string;
  comment: string;
}): MergeResults {
  const header = createGeneratedHeaderComment(newSrc, tag, comment);
  if (!src.includes(header)) {
    // Ensure the old generated contents are removed.
    let sanitizedTarget = removeGeneratedContents(src, tag);
    if (sanitizedTarget) sanitizedTarget += "\n";

    const contentsToAdd = [
      // @something
      header,
      // contents
      newSrc,
      // @end
      `${comment} @generated end ${tag}`,
    ].join("\n");

    return {
      contents: (sanitizedTarget ?? src) + contentsToAdd,
      didMerge: true,
      didClear: !!sanitizedTarget,
    };
  }
  return { contents: src, didClear: false, didMerge: false };
}

// This is required if you have several libraries which include libc++_shared.so as a dependency.
// See https://github.com/tanersener/ffmpeg-kit/wiki/Tips#2-depending-another-android-library-containing-libc_sharedso
function withLibCppSharedSo(config: ExpoConfig): ExpoConfig {
  return withGradleProperties(config, (config) => {
    config.modResults.push({
      type: "property",
      key: "android.packagingOptions.pickFirsts",
      value:
        "lib/x86/libc++_shared.so,lib/x86_64/libc++_shared.so,lib/armeabi-v7a/libc++_shared.so,lib/arm64-v8a/libc++_shared.so",
    });
    return config;
  });
}
