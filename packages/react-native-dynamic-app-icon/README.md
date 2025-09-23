# @config-plugins/react-native-dynamic-app-icon

> [!IMPORTANT]
> Consider using [`expo-quick-actions/icon`](https://github.com/evanbacon/expo-quick-actions) instead for both iOS and Android support, along with dark mode support for iOS.

Config plugin to auto-configure `react-native-dynamic-app-icon` when the native code is generated (`npx expo prebuild`).

## Versioning

Ensure you use versions that work together!

| `expo` | `react-native-dynamic-app-icon` | `@config-plugins/react-native-dynamic-app-icon` |
| ------ | ------------------------------- | ----------------------------------------------- |
| 54.0.0 | 1.1.0                           | 12.0.0                                          |
| 53.0.0 | 1.1.0                           | 11.0.0                                          |
| 52.0.0 | 1.1.0                           | 9.0.0                                           |
| 51.0.0 | 1.1.0                           | 8.0.0                                           |
| 50.0.0 | 1.1.0                           | 7.0.0                                           |
| 49.0.0 | 1.1.0                           | 6.0.0                                           |

## Install

> This package cannot be used in the "Expo Go" app because [it requires custom native code](https://docs.expo.io/workflow/customizing/).

First install the package with yarn, npm, or [`npx expo install`](https://docs.expo.io/workflow/expo-cli/#expo-install).

```
npx expo install react-native-dynamic-app-icon @config-plugins/react-native-dynamic-app-icon
```

After installing this npm package, add the [config plugin](https://docs.expo.io/guides/config-plugins/) to the [`plugins`](https://docs.expo.io/versions/latest/config/app/#plugins) array of your `app.json` or `app.config.js`. Then rebuild your app as described in the ["Adding custom native code"](https://docs.expo.io/workflow/customizing/) guide.

## Example

In your app.json `plugins` array:

```json
{
  "plugins": [
    [
      "@config-plugins/react-native-dynamic-app-icon",
      ["./path/to/image.png", "https://mywebsite.com/my-icon.png"]
    ]
  ]
}
```

Or as objects:

```json
{
  "plugins": [
    [
      "@config-plugins/react-native-dynamic-app-icon",
      {
        "AppIcon1": {
          "image": "./path/to/image.png",
          "prerendered": true
        }
      }
    ]
  ]
}
```

> Note: Icon URLs will be downloaded and embedded at build time, you cannot push new icons OTA.

## Usage

In list format, icons are named after the item index (`'0', '1', '2'`), they can be changed like `AppIcon.setAppIcon('2')` (from the package `react-native-dynamic-app-icon`).

This isn't tied to `react-native-dynamic-app-icon` in any way, so any method of swapping icons works.

<!-- Android support: https://github.com/myinnos/AppIconNameChanger -->
