# @config-plugins/intercom-react-native

Expo Config Plugin to auto configure [`intercom-react-native`](https://www.npmjs.com/package/@intercom/intercom-react-native) when the native code is generated (`npx expo prebuild`).

## Expo installation

> Tested against Expo SDK 49

This package cannot be used in the "Expo Go" app because [it requires custom native code](https://docs.expo.io/workflow/customizing/).

- First install the package with yarn, npm, or [`npx expo install`](https://docs.expo.io/workflow/expo-cli/#expo-install).

```sh
npx expo install expo-build-properties @intercom/intercom-react-native @config-plugins/intercom-react-native
```

After installing this npm package, add the [config plugin](https://docs.expo.io/guides/config-plugins/) to the [`plugins`](https://docs.expo.io/versions/latest/config/app/#plugins) array of your `app.json` or `app.config.js`:

```json
{
  "expo": {
    "plugins": ["@config-plugins/intercom-react-native"]
  }
}
```

Next, rebuild your app as described in the ["Adding custom native code"](https://docs.expo.io/workflow/customizing/) guide.

## Limitations

- **No push notifications support**: Intercom push notifications currently aren't supported by this config plugin extension. This will be added in the future.
- **compileSdkVersion: 34**: This plugin requires `compileSdkVersion` to be `34` or higher. This is because the Intercom SDK requires `compileSdkVersion` to be `34` or higher. Check the example how to do this using expo-build-properties.

## API

The plugin provides props for extra customization. Every time you change the props or plugins, you'll need to rebuild (and `prebuild`) the native app. If no extra properties are added, defaults will be used.

- `appId` (_string_): App ID from Intercom.
- `androidApiKey` (_string_): Android API Key from Intercom.
- `iosApiKey` (_string_): iOS API Key from Intercom.
- `intercomRegion` (_string_): Region for Intercom `US`, `EU`, `AU`. Optional. Defaults to `US`.

#### Example

```json
{
  "expo": {
    "plugins": [
      [
        "@config-plugins/intercom-react-native",
        {
          "appId": "abc123",
          "androidApiKey": "android_sdk-abc123",
          "iosApiKey": "ios_sdk-abc123",
          "intercomRegion": "EU" // Europe
        }
      ],
      [
        "expo-build-properties",
        {
            "compileSdkVersion": 34,
            "targetSdkVersion": 33,
            "minSdkVersion": 21,
        }
      ]
    ]
  }
}
```
