# config-plugins/react-native-ble-plx

Config plugin to auto-configure `react-native-ble-plx` when the native code is generated (`npx expo prebuild`). [Upstream PR](https://github.com/Polidea/react-native-ble-plx/pull/842).

## Expo installation

> Tested against Expo SDK 49

> This package cannot be used in the "Expo Go" app because [it requires custom native code](https://docs.expo.io/workflow/customizing/).
> First install the package with yarn, npm, or [`npx expo install`](https://docs.expo.io/workflow/expo-cli/#expo-install).

```sh
npx expo install react-native-ble-plx @config-plugins/react-native-ble-plx
```

After installing this npm package, add the [config plugin](https://docs.expo.io/guides/config-plugins/) to the [`plugins`](https://docs.expo.io/versions/latest/config/app/#plugins) array of your `app.json` or `app.config.js`:

```json
{
  "expo": {
    "plugins": ["@config-plugins/react-native-ble-plx"]
  }
}
```

Next, rebuild your app as described in the ["Adding custom native code"](https://docs.expo.io/workflow/customizing/) guide.

## API

### iOS options

The plugin provides props for extra customization. Every time you change the props or plugins, you'll need to rebuild (and `prebuild`) the native app. If no extra properties are added, defaults will be used.

- `modes` (_string[]_): Adds iOS `UIBackgroundModes` to the `Info.plist`. Options are: `peripheral`, and `central`. Defaults to undefined.
- `bluetoothAlwaysPermission` (_string | false_): Sets the iOS `NSBluetoothAlwaysUsageDescription` permission message to the `Info.plist`. Setting `false` will skip adding the permission. Defaults to `Allow $(PRODUCT_NAME) to connect to bluetooth devices`.

> Expo SDK 48 supports iOS 13+ which means `NSBluetoothPeripheralUsageDescription` is fully deprecated. It is no longer setup in `@config-plugins/react-native-ble-plx@5.0.0` and greater.

### Android options

- `canDiscover` (_boolean_): default:`true` - Indicates whether your app should have the permission to discover other Bluetooth devices. If set to `true`, `android.permission.BLUETOOTH_ADMIN` and `android:maxSdkVersion` is added conditioanlly based on legacy Android support. conditionally based on your settings.

- `canConnect` (_boolean_): default:`true` - Specifies if your app requires the permission to connect to already-paired Bluetooth devices. If set to `true`, `android.permission.BLUETOOTH_CONNECT` will be added to `AndroidManifest.xml`.

- `neverForLocation` (_boolean_): default:`true` - A flag you can set to `true` to assert that your app doesn't use BLE scan results to derive physical location. If `true`, `"android:usesPermissionFlags": "neverForLocation"` will be added to your `"android.permission.BLUETOOTH_SCAN"` declaration. Android SDK 31+. Default `false`. _WARNING: This parameter is experimental and BLE might not work. Make sure to test before releasing to production._

- `isDiscoverable` (_boolean_): default:`false` - Dictates whether or not your app is discoverable to other Bluetooth devices. If set to `true`, `android.permission.BLUETOOTH_ADVERTISE` will be added to `AndroidManifest.xml`.

- `isRequired` (_boolean_): default:`false` - Determines whether or not your app requires Bluetooth to function. If set to `true`, `<uses-feature android:name="android.hardware.bluetooth_le" android:required="true"/>` will be added to the `AndroidManifest.xml`.

#### Example

```json
{
  "expo": {
    "plugins": [
      [
        "@config-plugins/react-native-ble-plx",
        {
          
          "modes": ["peripheral", "central"],
          "bluetoothAlwaysPermission": "Allow $(PRODUCT_NAME) to connect to bluetooth devices",
          "neverForLocation": false,
          "isRequired": true,
        }
      ]
    ]
  }
}
```
