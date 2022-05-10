# config-plugins/react-native-google-cast

Config plugin to auto configure react-native-google-cast when the native code is generated (`expo prebuild`).

## Expo installation

> Tested against Expo SDK 45

> This package cannot be used in the "Expo Go" app because [it requires custom native code](https://docs.expo.io/workflow/customizing/).
> First install the package with yarn, npm, or [`expo install`](https://docs.expo.io/workflow/expo-cli/#expo-install).

```sh
yarn add react-native-google-cast @config-plugins/react-native-google-cast
```

After installing this npm package, add the [config plugin](https://docs.expo.io/guides/config-plugins/) to the [`plugins`](https://docs.expo.io/versions/latest/config/app/#plugins) array of your `app.json` or `app.config.js`:

```json
{
  "expo": {
    "plugins": ["@config-plugins/react-native-google-cast"]
  }
}
```

Next, rebuild your app as described in the ["Adding custom native code"](https://docs.expo.io/workflow/customizing/) guide.

## API

The plugin provides props for extra customization. Every time you change the props or plugins, you'll need to rebuild (and `prebuild`) the native app. If no extra properties are added, defaults will be used.

- `iosReceiverAppId` (_string_): unknown. Default `CC1AD845`
- `androidReceiverAppId` (_string_): unknown.
- `androidPlayServicesCastFrameworkVersion` (_string_): Version for the gradle package. Default `+`

#### Example

```json
{
  "expo": {
    "plugins": [
      [
        "@config-plugins/react-native-google-cast",
        {
          "iosReceiverAppId": "...",
          "androidReceiverAppId": "...",
          "androidPlayServicesCastFrameworkVersion": "..."
        }
      ]
    ]
  }
}
```
