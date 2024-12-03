import {
  AndroidConfig,
  ConfigPlugin,
  createRunOncePlugin,
} from "expo/config-plugins";

import { withBitcodeDisabled } from "./withBitcodeDisabled";
import { IOSPermissionsProps, withPermissions } from "./withPermissions";

const pkg = { name: "react-native-webrtc", version: "UNVERSIONED" }; //require("react-native-webrtc/package.json");

const withWebRTC: ConfigPlugin<IOSPermissionsProps | void> = (
  config,
  props = {},
) => {
  const _props = props || {};

  // iOS
  config = withPermissions(config, _props);
  config = withBitcodeDisabled(config);

  // Android
  // https://github.com/react-native-webrtc/react-native-webrtc/blob/master/Documentation/AndroidInstallation.md#declaring-permissions
  config = AndroidConfig.Permissions.withPermissions(config, [
    "android.permission.ACCESS_NETWORK_STATE",
    "android.permission.CAMERA",
    "android.permission.INTERNET",
    "android.permission.MODIFY_AUDIO_SETTINGS",
    "android.permission.RECORD_AUDIO",
    "android.permission.SYSTEM_ALERT_WINDOW",
    "android.permission.WAKE_LOCK",

    "android.permission.BLUETOOTH",
  ]);

  return config;
};

export default createRunOncePlugin(withWebRTC, pkg.name, pkg.version);
