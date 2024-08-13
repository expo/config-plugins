# config-plugins/react-native-google-cast

Config plugin to auto-configure `react-native-google-cast` when the native code is generated (`npx expo prebuild`).

## Versioning

Ensure you use versions that work together!

| `expo` | `react-native-google-cast` | `@config-plugins/react-native-google-cast` |
| ------ | -------------------------- | ------------------------------------------ |
| 51.0.0 | 4.8.0                      | 8.0.0                                      |
| 50.0.0 | 4.6.2                      | 7.0.0                                      |
| 49.0.0 | 4.6.2                      | 6.0.0                                      |

## Expo installation

> This package cannot be used in the "Expo Go" app because [it requires custom native code](https://docs.expo.io/workflow/customizing/).

First install the package with yarn, npm, or [`npx expo install`](https://docs.expo.io/workflow/expo-cli/#expo-install).

```sh
npx expo install react-native-google-cast @config-plugins/react-native-google-cast
```

After installing this npm package, add the [config plugin](https://docs.expo.io/guides/config-plugins/) to the [`plugins`](https://docs.expo.io/versions/latest/config/app/#plugins) array of your `app.json` or `app.config.js`:

```json
{
  "plugins": ["@config-plugins/react-native-google-cast"]
}
```

Next, rebuild your app as described in the ["Adding custom native code"](https://docs.expo.io/workflow/customizing/) guide.

## API

The plugin provides props for extra customization. Every time you change the props or plugins, you'll need to rebuild (and `prebuild`) the native app. If no extra properties are added, defaults will be used.

- `iosReceiverAppId` (_string_): unknown. Default `CC1AD845`
- `iosStartDiscoveryAfterFirstTapOnCastButton` (_boolean_) Default `true`
- `iosPhysicalVolumeButtonsWillControlDeviceVolume` (\_boolean) Default `false`
- `androidReceiverAppId` (_string_): unknown.
- `androidPlayServicesCastFrameworkVersion` (_string_): Version for the gradle package. Default `+`

#### Example

```json
{
  "plugins": [
    [
      "@config-plugins/react-native-google-cast",
      {
        "iosReceiverAppId": "...",
        "iosStartDiscoveryAfterFirstTapOnCastButton": "...",
        "iosPhysicalVolumeButtonsWillControlDeviceVolume": "...",
        "androidReceiverAppId": "...",
        "androidPlayServicesCastFrameworkVersion": "..."
      }
    ]
  ]
}
```
