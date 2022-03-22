# config-plugins/react-native-webrtc

Config plugin to auto configure `react-native-webrtc` when the native code is generated (`expo prebuild`). [Upstream PR](https://github.com/react-native-webrtc/react-native-webrtc/pull/1013).

## Versioning

Ensure you use versions that work together!

| `expo` | `react-native-webrtc` | `@config-plugins/react-native-webrtc` |
| ------ | --------------------- | ------------------------------------- |
| 44.0.0 | 1.92.2                | 2.0.0                                 |
| 43.0.0 | 1.92.2                | 1.0.0                                 |

> Expo SDK 42 uses `react-native@0.63` which doesn't work with `react-native-webrtc`, specifically iOS production builds fail. Meaning this package is only supported for Expo SDK +43.

## Expo installation

> Tested against Expo SDK 44

> This package cannot be used in the "Expo Go" app because [it requires custom native code](https://docs.expo.io/workflow/customizing/).
> First install the package with yarn, npm, or [`expo install`](https://docs.expo.io/workflow/expo-cli/#expo-install).

```sh
expo install react-native-webrtc @config-plugins/react-native-webrtc
```

After installing this npm package, add the [config plugin](https://docs.expo.io/guides/config-plugins/) to the [`plugins`](https://docs.expo.io/versions/latest/config/app/#plugins) array of your `app.json` or `app.config.js`:

```json
{
  "expo": {
    "plugins": ["@config-plugins/react-native-webrtc"]
  }
}
```

Next, rebuild your app as described in the ["Adding custom native code"](https://docs.expo.io/workflow/customizing/) guide.

## API

The plugin provides props for extra customization. Every time you change the props or plugins, you'll need to rebuild (and `prebuild`) the native app. If no extra properties are added, defaults will be used.

- `cameraPermission` (_string_): Sets the iOS `NSCameraUsageDescription` permission message to the `Info.plist`. Defaults to `Allow $(PRODUCT_NAME) to access your camera`.
- `microphonePermission` (_string_): Sets the iOS `NSMicrophoneUsageDescription` permission message to the `Info.plist`. Defaults to `Allow $(PRODUCT_NAME) to access your microphone`.

`app.config.js`

```ts
export default {
  plugins: [
    [
      "@config-plugins/react-native-webrtc",
      {
        cameraPermission: "Allow $(PRODUCT_NAME) to access your camera",
        microphonePermission: "Allow $(PRODUCT_NAME) to access your microphone",
      },
    ],
  ],
};
```

## Important Notes

- For iOS, this plugin disables Bitcodes for all builds (required).
- For Android, this plugin disables desugaring in `gradle.properties`: `android.enableDexingArtifactTransform.desugaring=false` and the [minimum deployment target is changed to `24`](https://github.com/react-native-webrtc/react-native-webrtc/issues/720#issuecomment-552374206) (from `21`) which may break other packages in your app!

## Manual Setup

For bare workflow projects, you can follow the manual setup guides:

- [iOS](https://github.com/react-native-webrtc/react-native-webrtc/blob/master/Documentation/iOSInstallation.md)
- [Android](https://github.com/react-native-webrtc/react-native-webrtc/blob/master/Documentation/AndroidInstallation.md)
