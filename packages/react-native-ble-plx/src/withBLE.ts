import {
  ConfigPlugin,
  createRunOncePlugin,
  WarningAggregator,
} from "expo/config-plugins";

import { withBLEAndroidManifest } from "./withBLEAndroidManifest";
import {
  BackgroundMode,
  withBLEBackgroundModes,
} from "./withBLEBackgroundModes";
import { withBluetoothPermissions } from "./withBluetoothPermissions";

const pkg = { name: "react-native-ble-plx", version: "UNVERSIONED" }; //require('react-native-ble-plx/package.json')

/**
 * Apply BLE native configuration.
 */
const withBLE: ConfigPlugin<
  {
    neverForLocation?: boolean;
    modes?: BackgroundMode[];
    bluetoothAlwaysPermission?: string | false;

    isRequired?: boolean;
    canDiscover?: boolean;
    isDiscoverable?: boolean;
    canConnect?: boolean;
  } | void
> = (config, props = {}) => {
  const _props = props || {};

  const neverForLocation = _props.neverForLocation ?? true;
  const isRequired = _props.isRequired ?? false;
  const canDiscover = _props.canDiscover ?? true;
  const isDiscoverable = _props.isDiscoverable ?? false;
  const canConnect = _props.canConnect ?? true;

  if ("bluetoothPeripheralPermission" in _props) {
    WarningAggregator.addWarningIOS(
      "bluetoothPeripheralPermission",
      `The iOS permission \`NSBluetoothPeripheralUsageDescription\` is fully deprecated as of iOS 13 (lowest iOS version in Expo SDK 47+). Remove the \`bluetoothPeripheralPermission\` property from the \`@config-plugins/react-native-ble-plx\` config plugin.`
    );
  }

  if ("isBackgroundEnabled" in _props) {
    WarningAggregator.addWarningAndroid(
      "isBackgroundEnabled",
      "This propery name has changed. You should use isRequired, as better matches the behavior."
    );
  }

  // iOS
  config = withBluetoothPermissions(config, _props);
  config = withBLEBackgroundModes(config, _props.modes || []);

  config = withBLEAndroidManifest(config, {
    neverForLocation,
    isRequired,
    canDiscover,
    isDiscoverable,
    canConnect,
  });

  return config;
};

export { BackgroundMode };

export default createRunOncePlugin(withBLE, pkg.name, pkg.version);
