import {
  type ConfigPlugin,
  AndroidConfig,
  IOSConfig,
  withAndroidManifest,
  withInfoPlist,
  withXcodeProject,
} from "expo/config-plugins";

import { ensureHeaderSearchPath } from "./ensureHeaderSearchPath";

const withCallkeepHeaderSearchPath: ConfigPlugin = (config) => {
  const headerSearchPath = `"$(SRCROOT)/../node_modules/react-native-callkeep/ios/RNCallKeep"`;
  return withXcodeProject(config, (config) => {
    ensureHeaderSearchPath(config.modResults, headerSearchPath);
    return config;
  });
};

const withAndroidManifestService: ConfigPlugin = (config) => {
  return withAndroidManifest(config, (config) => {
    // <service
    //   android:name="io.wazo.callkeep.VoiceConnectionService"
    //   android:label="Wazo"
    //   android:permission="android.permission.BIND_TELECOM_CONNECTION_SERVICE"
    //   // Use this to target android >= 11
    //   android:foregroundServiceType="camera|microphone"
    //   // For android < 11
    //   android:foregroundServiceType="phoneCall"
    // >
    //   <intent-filter>
    //     <action android:name="android.telecom.ConnectionService" />
    //   </intent-filter>
    // </service>;

    const app = AndroidConfig.Manifest.getMainApplicationOrThrow(
      config.modResults,
    );

    if (!Array.isArray(app.service)) app.service = [];

    if (
      !app.service.find(
        (item) =>
          item.$["android:name"] ===
          "io.wazo.callkeep.RNCallKeepBackgroundMessagingService",
      )
    ) {
      app.service.push({
        $: {
          "android:name":
            "io.wazo.callkeep.RNCallKeepBackgroundMessagingService",
          "android:exported": "true",
        },
      });
    }
    // TODO: Update item
    if (
      !app.service.find(
        (item) =>
          item.$["android:name"] === "io.wazo.callkeep.VoiceConnectionService",
      )
    ) {
      app.service.push({
        $: {
          "android:name": "io.wazo.callkeep.VoiceConnectionService",
          "android:exported": "true",
          // @ts-ignore
          "android:label": "Wazo",
          "android:permission":
            "android.permission.BIND_TELECOM_CONNECTION_SERVICE",
          "android:foregroundServiceType": "camera|microphone",
        },
        "intent-filter": [
          {
            action: [
              {
                $: {
                  "android:name": "android.telecom.ConnectionService",
                },
              },
            ],
          },
        ],
      });
    }

    return config;
  });
};

const withCallkeep: ConfigPlugin = (config) => {
  withInfoPlist(config, (config) => {
    if (!Array.isArray(config.modResults.UIBackgroundModes)) {
      config.modResults.UIBackgroundModes = [];
    }

    if (!config.modResults.UIBackgroundModes.includes("voip")) {
      config.modResults.UIBackgroundModes.push("voip");
    }
    return config;
  });

  withCallkeepHeaderSearchPath(config);

  withXcodeLinkBinaryWithLibraries(config, {
    library: "Intents.framework",
    status: "optional",
  });

  withXcodeLinkBinaryWithLibraries(config, {
    library: "CallKit.framework",
  });

  config = AndroidConfig.Permissions.withPermissions(config, [
    "android.permission.BIND_TELECOM_CONNECTION_SERVICE",
    "android.permission.FOREGROUND_SERVICE",
    "android.permission.READ_PHONE_STATE",
    "android.permission.CALL_PHONE",
  ]);

  config = withAndroidManifestService(config);
  return config;
};

const withXcodeLinkBinaryWithLibraries: ConfigPlugin<{
  library: string;
  status?: string;
}> = (config, { library, status }) => {
  return withXcodeProject(config, (config) => {
    const options = status === "optional" ? { weak: true } : {};

    const target = IOSConfig.XcodeUtils.getApplicationNativeTarget({
      project: config.modResults,
      projectName: config.modRequest.projectName!,
    });
    config.modResults.addFramework(library, {
      target: target.uuid,
      ...options,
    });

    return config;
  });
};

export default withCallkeep;
