# config-plugins/react-native-branch

Config plugin to auto-configure `react-native-branch` when the native code is generated (`npx expo prebuild`).

## Versioning

Ensure you use versions that work together!

| `expo` | `react-native-branch` | `@config-plugins/react-native-branch` |
| ------ | --------------------- | ------------------------------------- |
| 49.0.0 | 5.9.0                 | 6.0.0                                 |
| 48.0.0 | 5.7.0                 | 5.0.0                                 |

## Expo installation

> Tested against Expo SDK 49

> This package cannot be used in the "Expo Go" app because [it requires custom native code](https://docs.expo.io/workflow/customizing/).
> First install the package with yarn, npm, or [`npx expo install`](https://docs.expo.io/workflow/expo-cli/#expo-install).

```sh
npx expo install react-native-branch @config-plugins/react-native-branch
```

After installing this npm package, add the [config plugin](https://docs.expo.io/guides/config-plugins/) to the [`plugins`](https://docs.expo.io/versions/latest/config/app/#plugins) array of your `app.json` or `app.config.js`:

```json
{
  "expo": {
    "plugins": ["@config-plugins/react-native-branch"]
  }
}
```

Next, rebuild your app as described in the ["Adding custom native code"](https://docs.expo.io/workflow/customizing/) guide.

## API

The plugin provides props for extra customization. Every time you change the props or plugins, you'll need to rebuild (and `prebuild`) the native app. If no extra properties are added, defaults will be used.

- `apiKey` (_string_): Branch API key. Optional.
- `iosAppDomain` (_string_): App Domain for iOS. Optional.

#### Example

```json
{
  "expo": {
    "plugins": [
      [
        "@config-plugins/react-native-branch",
        {
          "apiKey": "key_live_f9f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8",
          "iosAppDomain": "awesome-alternate.app.link"
        }
      ]
    ]
  }
}
```
