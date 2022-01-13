"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withXcodeLinkBinaryWithLibraries = void 0;
const config_plugins_1 = require("@expo/config-plugins");
const ensureHeaderSearchPath_1 = require("./ensureHeaderSearchPath");
const withCallkeepHeaderSearchPath = (config) => {
    const headerSearchPath = `"$(SRCROOT)/../node_modules/react-native-callkeep/ios/RNCallKeep"`;
    return config_plugins_1.withXcodeProject(config, (config) => {
        ensureHeaderSearchPath_1.ensureHeaderSearchPath(config.modResults, headerSearchPath);
        return config;
    });
};
const withAndroidManifestService = (config) => {
    return config_plugins_1.withAndroidManifest(config, (config) => {
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
        const app = config_plugins_1.AndroidConfig.Manifest.getMainApplicationOrThrow(config.modResults);
        if (!Array.isArray(app.service))
            app.service = [];
        if (!app.service.find((item) => item.$["android:name"] ===
            "io.wazo.callkeep.RNCallKeepBackgroundMessagingService")) {
            app.service.push({
                $: {
                    "android:name": "io.wazo.callkeep.RNCallKeepBackgroundMessagingService",
                },
            });
        }
        // TODO: Update item
        if (!app.service.find((item) => item.$["android:name"] === "io.wazo.callkeep.VoiceConnectionService")) {
            app.service.push({
                $: {
                    "android:name": "io.wazo.callkeep.VoiceConnectionService",
                    // @ts-ignore
                    "android:label": "Wazo",
                    "android:permission": "android.permission.BIND_TELECOM_CONNECTION_SERVICE",
                    // Use this to target android >= 11
                    // "android:foregroundServiceType": "camera|microphone",
                    // For android < 11
                    "android:foregroundServiceType": "phoneCall",
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
const withCallkeep = (config) => {
    config = config_plugins_1.withInfoPlist(config, (config) => {
        if (!Array.isArray(config.modResults.UIBackgroundModes)) {
            config.modResults.UIBackgroundModes = [];
        }
        if (!config.modResults.UIBackgroundModes.includes("voip")) {
            config.modResults.UIBackgroundModes.push("voip");
        }
        return config;
    });
    config = withCallkeepHeaderSearchPath(config);
    config = exports.withXcodeLinkBinaryWithLibraries(config, {
        library: "Intents.framework",
        status: "optional",
    });
    config = exports.withXcodeLinkBinaryWithLibraries(config, {
        library: "CallKit.framework",
    });
    config = config_plugins_1.AndroidConfig.Permissions.withPermissions(config, [
        "android.permission.BIND_TELECOM_CONNECTION_SERVICE",
        "android.permission.FOREGROUND_SERVICE",
        "android.permission.READ_PHONE_STATE",
        "android.permission.CALL_PHONE",
    ]);
    config = withAndroidManifestService(config);
    return config;
};
const withXcodeLinkBinaryWithLibraries = (config, { library, status }) => {
    return config_plugins_1.withXcodeProject(config, (config) => {
        const options = status === "optional" ? { weak: true } : {};
        const target = config_plugins_1.IOSConfig.XcodeUtils.getApplicationNativeTarget({
            project: config.modResults,
            projectName: config.modRequest.projectName,
        });
        config.modResults.addFramework(library, {
            target: target.uuid,
            ...options,
        });
        return config;
    });
};
exports.withXcodeLinkBinaryWithLibraries = withXcodeLinkBinaryWithLibraries;
exports.default = withCallkeep;
