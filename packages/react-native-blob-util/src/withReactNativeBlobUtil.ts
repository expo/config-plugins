import {
  AndroidConfig,
  ConfigPlugin,
  createRunOncePlugin,
  withAndroidManifest,
  withStringsXml,
} from "expo/config-plugins";

let pkg: { name: string; version?: string } = {
  name: "react-native-blob-util",
};
try {
  pkg = require("react-native-blob-util/package.json");
} catch {
  // empty catch block
}

export function appendDownloadCompleteAction(
  androidManifest: AndroidConfig.Manifest.AndroidManifest,
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
              action.$["android:name"] === "android.intent.category.LAUNCHER",
          );
          if (!isLauncher) continue;

          intentFilter.action = intentFilter.action || [];
          const hasDownloadCompleteAction = intentFilter.action.some(
            (action) =>
              action.$["android:name"] ===
              "android.intent.action.DOWNLOAD_COMPLETE",
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

// com.facebook.react.modules.blob.BlobProvider
const withBlobProvider: ConfigPlugin = (config) => {
  withAndroidManifest(config, (config) => {
    ensureBlobProviderManifest(config.modResults);
    return config;
  });
  return config;
};

export function ensureBlobProviderManifest(
  androidManifest: AndroidConfig.Manifest.AndroidManifest,
) {
  const app = AndroidConfig.Manifest.getMainApplicationOrThrow(
    androidManifest,
  ) as AndroidConfig.Manifest.ManifestApplication & { provider?: any[] };

  if (!app.provider) {
    app.provider = [];
  }
  if (
    !app.provider.some(
      (p) =>
        p.$["android:name"] === "com.facebook.react.modules.blob.BlobProvider",
    )
  ) {
    // <provider android:name="com.facebook.react.modules.blob.BlobProvider" android:authorities="@string/blob_provider_authority" android:exported="false" />
    app.provider.push({
      $: {
        "android:name": "com.facebook.react.modules.blob.BlobProvider",
        "android:authorities": "@string/blob_provider_authority",
        "android:exported": "false",
      },
    });
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

  withBlobProvider(config);

  config = withStringsXml(config, (config) => {
    ensureBlobProviderAuthorityString(
      config.modResults,
      config.android?.package + ".blobs",
    );
    return config;
  });

  return config;
};

export function ensureBlobProviderAuthorityString(
  res: AndroidConfig.Resources.ResourceXML,
  authority: string,
) {
  if (!res.resources.string) {
    res.resources.string = [];
  }
  if (
    !res.resources.string.some((s) => s.$["name"] === "blob_provider_authority")
  ) {
    res.resources.string.push({
      _: "invalid",
      $: {
        name: "blob_provider_authority",
      },
    });
  }

  const item = res.resources.string.find(
    (s) => s.$["name"] === "blob_provider_authority",
  );
  item!._ = authority;
  return res;
}

export default createRunOncePlugin(
  withReactNativeBlobUtil,
  pkg.name,
  pkg.version,
);
