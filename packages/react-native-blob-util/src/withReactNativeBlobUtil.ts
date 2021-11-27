import {
  AndroidConfig,
  ConfigPlugin,
  createRunOncePlugin,
  withAndroidManifest,
} from "@expo/config-plugins";

let pkg: { name: string; version?: string } = {
  name: "react-native-blob-util",
};
try {
  pkg = require("react-native-blob-util/package.json");
} catch {
  // empty catch block
}

export function appendDownloadCompleteAction(
  androidManifest: AndroidConfig.Manifest.AndroidManifest
): AndroidConfig.Manifest.AndroidManifest {
  if (!Array.isArray(androidManifest.manifest.application)) {
    return androidManifest;
  }

  for (const application of androidManifest.manifest.application) {
    for (const activity of application.activity || []) {
      if (activity?.$?.["android:launchMode"] === "singleTask") {
        for (const intentFilter of activity["intent-filter"] || []) {
          const isLauncher = intentFilter.category?.some(
            (action) =>
              action.$["android:name"] === "android.intent.category.LAUNCHER"
          );
          if (!isLauncher) continue;

          intentFilter.action = intentFilter.action || [];
          const hasDownloadCompleteAction = intentFilter.action.some(
            (action) =>
              action.$["android:name"] ===
              "android.intent.action.DOWNLOAD_COMPLETE"
          );
          if (!hasDownloadCompleteAction) {
            intentFilter.action.push({
              $: {
                "android:name": "android.intent.action.DOWNLOAD_COMPLETE",
              },
            });
            return androidManifest;
          }
        }
        break;
      }
    }
  }
  return androidManifest;
}

const withReactNativeBlobUtil: ConfigPlugin = (config) => {
  config = AndroidConfig.Permissions.withPermissions(config, [
    "android.permission.READ_EXTERNAL_STORAGE",
    "android.permission.WRITE_EXTERNAL_STORAGE",
    "android.permission.DOWNLOAD_WITHOUT_NOTIFICATION",
    // Wifi-only mode.
    "android.permission.ACCESS_NETWORK_STATE",
  ]);

  config = withAndroidManifest(config, (config) => {
    config.modResults = appendDownloadCompleteAction(config.modResults);
    return config;
  });

  return config;
};

export default createRunOncePlugin(
  withReactNativeBlobUtil,
  pkg.name,
  pkg.version
);
