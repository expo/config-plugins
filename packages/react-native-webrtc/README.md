# config-plugins/react-native-webrtc

Config plugin to auto-configure `react-native-webrtc` when the native code is generated (`npx expo prebuild`). [Upstream PR](https://github.com/react-native-webrtc/react-native-webrtc/pull/1013).

## Versioning

Ensure you use versions that work together!

| `expo` | `react-native-webrtc` | `@config-plugins/react-native-webrtc` |
| ------ | --------------------- | ------------------------------------- |
| 53.0.0 | 124.0.5               | 11.0.0                                |
| 52.0.0 | 124.0.4               | 10.0.0                                |
| 51.0.0 | 118.0.7               | 9.0.0                                 |
| 50.0.0 | 118.0.1               | 8.0.0                                 |
| 49.0.0 | 111.0.3               | 7.0.0                                 |
| 48.0.0 | 106.0.6               | 6.0.0                                 |
| 47.0.0 | 1.106.1               | 5.0.0                                 |
| 46.0.0 | 1.100.0               | 4.0.0                                 |
| 45.0.0 | 1.100.0               | 3.0.0                                 |
| 44.0.0 | 1.92.2                | 2.0.0                                 |
| 43.0.0 | 1.92.2                | 1.0.0                                 |

> Expo SDK 42 uses `react-native@0.63` which doesn't work with `react-native-webrtc`, specifically iOS production builds fail. Meaning this package is only supported for Expo SDK +43.

## Expo installation

> This package cannot be used in the "Expo Go" app because [it requires custom native code](https://docs.expo.io/workflow/customizing/).
> First install the package with yarn, npm, or [`npx expo install`](https://docs.expo.io/workflow/expo-cli/#expo-install).

```sh
npx expo install react-native-webrtc @config-plugins/react-native-webrtc
```

After installing this npm package, add the [config plugin](https://docs.expo.io/guides/config-plugins/) to the [`plugins`](https://docs.expo.io/versions/latest/config/app/#plugins) array of your `app.json` or `app.config.js`:

```json
{
  "plugins": ["@config-plugins/react-native-webrtc"]
}
```

Next, rebuild your app as described in the ["Adding custom native code"](https://docs.expo.io/workflow/customizing/) guide.

### Event Target Shim

> Only for SDK 50.

React Native uses `event-target-shim@5` which is not compatible with `react-native-webrtc`'s dependency on `event-target-shim@6`. To fix this, you may need to add a redirection in your `metro.config.js` file:

```js
// metro.config.js

// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");
const resolveFrom = require("resolve-from");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (
    // If the bundle is resolving "event-target-shim" from a module that is part of "react-native-webrtc".
    moduleName.startsWith("event-target-shim") &&
    context.originModulePath.includes("react-native-webrtc")
  ) {
    // Resolve event-target-shim relative to the react-native-webrtc package to use v6.
    // React Native requires v5 which is not compatible with react-native-webrtc.
    const eventTargetShimPath = resolveFrom(
      context.originModulePath,
      moduleName
    );

    return {
      filePath: eventTargetShimPath,
      type: "sourceFile",
    };
  }

  // Ensure you call the default resolver.
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
```

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
