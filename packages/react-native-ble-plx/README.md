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

The plugin provides props for extra customization. Every time you change the props or plugins, you'll need to rebuild (and `prebuild`) the native app. If no extra properties are added, defaults will be used.

- `isBackgroundEnabled` (_boolean_): Enable background BLE support on Android. Adds `<uses-feature android:name="android.hardware.bluetooth_le" android:required="true"/>` to the `AndroidManifest.xml`. Default `false`.
- `neverForLocation` (_boolean_): Set to true only if you can strongly assert that your app never derives physical location from Bluetooth scan results. The location permission will be still required on older Android devices. Note, that some BLE beacons are filtered from the scan results. Android SDK 31+. Default `false`. _WARNING: This parameter is experimental and BLE might not work. Make sure to test before releasing to production._
- `modes` (_string[]_): Adds iOS `UIBackgroundModes` to the `Info.plist`. Options are: `peripheral`, and `central`. Defaults to undefined.
- `bluetoothAlwaysPermission` (_string | false_): Sets the iOS `NSBluetoothAlwaysUsageDescription` permission message to the `Info.plist`. Setting `false` will skip adding the permission. Defaults to `Allow $(PRODUCT_NAME) to connect to bluetooth devices`.

> Expo SDK 48 supports iOS 13+ which means `NSBluetoothPeripheralUsageDescription` is fully deprecated. It is no longer setup in `@config-plugins/react-native-ble-plx@5.0.0` and greater.

#### Example

```json
{
  "expo": {
    "plugins": [
      [
        "@config-plugins/react-native-ble-plx",
        {
          "isBackgroundEnabled": true,
          "modes": ["peripheral", "central"],
          "bluetoothAlwaysPermission": "Allow $(PRODUCT_NAME) to connect to bluetooth devices"
        }
      ]
    ]
  }
}
```
