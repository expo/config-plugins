import {
  type ConfigPlugin,
  type ExportedConfigWithProps,
  AndroidConfig,
  withAppDelegate,
  withDangerousMod,
  withAndroidManifest,
} from "@expo/config-plugins";
import { mergeContents } from "@expo/config-plugins/build/utils/generateCode";
import fs from "fs";
import path from "path";

const withAndroidMod: ConfigPlugin<{ googleMapsApiKey: string }> = (
  config,
  props,
) => {
  config = withAndroidManifest(config, (config) => {
    const app = AndroidConfig.Manifest.getMainApplicationOrThrow(
      config.modResults,
    );

    if (!Array.isArray(app["meta-data"])) app["meta-data"] = [];

    app["meta-data"].push({
      $: {
        "android:name": "com.google.android.geo.API_KEY",
        "android:value": props.googleMapsApiKey,
      },
    });

    return config;
  });

  return config;
};

const addReactNativeMapsAppDelegateImport = (src: string) => {
  const newSrc = [];
  newSrc.push("#import <GoogleMaps/GoogleMaps.h>");

  return mergeContents({
    tag: "react-native-maps-import",
    src,
    newSrc: newSrc.join("\n"),
    anchor: /#import "AppDelegate\.h"/,
    offset: 1,
    comment: "//",
  });
};

const addReactNativeMapsAppDelegateDidFinishLaunchingWithOptions = (
  src: string,
  props: { googleMapsApiKey: string },
) => {
  const newSrc = [];
  newSrc.push(`  [GMSServices provideAPIKey:@"${props.googleMapsApiKey}"];`);

  return mergeContents({
    tag: "react-native-maps-didFinishLaunchingWithOptions",
    src,
    newSrc: newSrc.join("\n"),
    anchor: /.*didFinishLaunchingWithOptions/,
    offset: 2,
    comment: "//",
  });
};

const modifyPodfile = (config: ExportedConfigWithProps<unknown>) => {
  const filePath = path.join(config.modRequest.platformProjectRoot, "Podfile");
  const contents = fs.readFileSync(filePath, "utf-8");
  const addGoogleMapsPath = mergeContents({
    tag: "maps",
    src: contents,
    newSrc: `   rn_maps_path = '../node_modules/react-native-maps'
   pod 'react-native-google-maps', :path => rn_maps_path`,
    anchor: /#*use_native_modules!/i,
    offset: 0,
    comment: "#",
  });

  fs.writeFileSync(filePath, addGoogleMapsPath.contents);
};

const withIosMod: ConfigPlugin<{ googleMapsApiKey: string }> = (
  config,
  props,
) => {
  config = withAppDelegate(config, (config) => {
    config.modResults.contents = addReactNativeMapsAppDelegateImport(
      config.modResults.contents,
    ).contents;
    config.modResults.contents =
      addReactNativeMapsAppDelegateDidFinishLaunchingWithOptions(
        config.modResults.contents,
        props,
      ).contents;
    return config;
  });

  config = withDangerousMod(config, [
    "ios",
    (config) => {
      modifyPodfile(config);

      return config;
    },
  ]);

  return config;
};

const withReactNativeMaps: ConfigPlugin<{ googleMapsApiKey: string }> = (
  config,
  props,
) => {
  if (!props.googleMapsApiKey) {
    throw new Error(
      "googleMapsApiKey is required for react-native-maps plugin",
    );
  }

  config = withIosMod(config, props);

  config = withAndroidMod(config, props);

  return config;
};

export default withReactNativeMaps;
