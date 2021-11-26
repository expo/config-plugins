import { ConfigPlugin, withDangerousMod } from "@expo/config-plugins";
import { withPodfileProperties } from "@expo/config-plugins/build/plugins/ios-plugins";
import { mergeContents } from "@expo/config-plugins/build/utils/generateCode";
import { promises } from "fs";
import path from "path";

export const withPodfilePropertiesPackage: ConfigPlugin<string> = (
  config,
  packageName
) => {
  return withPodfileProperties(config, (config) => {
    // @ts-ignore: wrong type
    config.modResults["ffmpeg-kit-react-native.subspecs"] = [
      packageName,
    ].filter(Boolean);
    return config;
  });
};

/** Dangerously adds the custom import to the CocoaPods. */
export const withCocoaPodsImport: ConfigPlugin = (c) => {
  return withDangerousMod(c, [
    "ios",
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    async (config) => {
      const file = path.join(config.modRequest.platformProjectRoot, "Podfile");

      const contents = await promises.readFile(file, "utf8");

      await promises.writeFile(file, addCocoaPodsImport(contents), "utf-8");
      return config;
    },
  ]);
};

export function addCocoaPodsImport(src: string): string {
  return mergeContents({
    tag: `ffmpeg-kit-react-native-import`,
    src,
    newSrc: `  pod 'ffmpeg-kit-react-native', :subspecs => podfile_properties['ffmpeg-kit-react-native.subspecs'] || [], :podspec => File.join(File.dirname(\`node --print "require.resolve('ffmpeg-kit-react-native/package.json')"\`), "ffmpeg-kit-react-native.podspec")`,
    anchor: /use_native_modules/,
    // We can't go after the use_native_modules block because it might have parameters, causing it to be multi-line (see react-native template).
    offset: 0,
    comment: "#",
  }).contents;
}
