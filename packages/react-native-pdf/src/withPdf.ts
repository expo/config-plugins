import { mergeContents } from "@expo/config-plugins/build/utils/generateCode";
import {
  ConfigPlugin,
  createRunOncePlugin,
  WarningAggregator,
  withAppBuildGradle,
} from "expo/config-plugins";

let pkg: { name: string; version?: string } = {
  name: "react-native-pdf",
};
try {
  pkg = require("react-native-pdf/package.json");
} catch {
  // empty catch block
}

export const withAndroidPackagingOptions: ConfigPlugin = (config) => {
  return withAppBuildGradle(config, (config) => {
    if (config.modResults.language === "groovy") {
      config.modResults.contents = addAndroidPackagingOptions(
        config.modResults.contents
      ).contents;
    } else {
      WarningAggregator.addWarningAndroid(
        "@config-plugins/react-native-pdf",
        `Cannot automatically configure app build.gradle if it's not groovy`
      );
    }
    return config;
  });
};

export function addAndroidPackagingOptions(src: string) {
  return mergeContents({
    tag: "react-native-pdf-packaging-options",
    src,
    newSrc: packagingOptionsContents,
    anchor: /android(?:\s+)?\{/,
    // Inside the android block.
    offset: 1,
    comment: "//",
  });
}

const packagingOptionsContents = `
    packagingOptions {
        pickFirst 'lib/x86/libc++_shared.so'
        pickFirst 'lib/x86_64/libjsc.so'
        pickFirst 'lib/arm64-v8a/libjsc.so'
        pickFirst 'lib/arm64-v8a/libc++_shared.so'
        pickFirst 'lib/x86_64/libc++_shared.so'
        pickFirst 'lib/armeabi-v7a/libc++_shared.so'
    }
`;

const withReactNativePdf: ConfigPlugin = (config) => {
  return withAndroidPackagingOptions(config);
};

export default createRunOncePlugin(withReactNativePdf, pkg.name, pkg.version);
