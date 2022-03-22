import { ConfigPlugin, withInfoPlist } from "@expo/config-plugins";

const BLUETOOTH_ALWAYS =
  "Allow $(PRODUCT_NAME) to connect to bluetooth devices";
const BLUETOOTH_PERIPHERAL_USAGE =
  "Allow $(PRODUCT_NAME) to connect to bluetooth devices";

export const withBluetoothPermissions: ConfigPlugin<{
  bluetoothAlwaysPermission?: string | false;
  bluetoothPeripheralPermission?: string | false;
}> = (c, { bluetoothAlwaysPermission, bluetoothPeripheralPermission } = {}) => {
  return withInfoPlist(c, (config) => {
    if (bluetoothAlwaysPermission !== false) {
      config.modResults.NSBluetoothAlwaysUsageDescription =
        bluetoothAlwaysPermission ||
        config.modResults.NSBluetoothAlwaysUsageDescription ||
        BLUETOOTH_ALWAYS;
    }
    if (bluetoothPeripheralPermission !== false) {
      config.modResults.NSBluetoothPeripheralUsageDescription =
        bluetoothPeripheralPermission ||
        config.modResults.NSBluetoothPeripheralUsageDescription ||
        BLUETOOTH_PERIPHERAL_USAGE;
    }
    return config;
  });
};
