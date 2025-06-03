# @config-plugins/react-native-global-keyevent

Expo Config Plugin to auto-configure [`react-native-global-keyevent`](https://www.npmjs.com/package/react-native-global-keyevent) when the native code is generated (`npx expo prebuild`).

## Versioning

| `expo` | `react-native-global-keyevent` | `@config-plugins/react-native-global-keyevent` |
|--------|--------------------------------|------------------------------------------------|
| 51.0.0 | 0.1.4                          | 0.1.4                                          |

## Expo installation

> This package cannot be used in the "Expo Go" app because [it requires custom native code](https://docs.expo.io/workflow/customizing/).

First install the package with yarn, npm, or [`npx expo install`](https://docs.expo.io/workflow/expo-cli/#expo-install).

```sh
npx expo install react-native-global-keyevent @config-plugins/react-native-global-keyevent
```

After installing this npm package, add the [config plugin](https://docs.expo.io/guides/config-plugins/) to the [`plugins`](https://docs.expo.io/versions/latest/config/app/#plugins) array of your `app.json` or `app.config.js`:

```json
{
  "expo": {
    "plugins": ["@config-plugins/react-native-global-keyevent"]
  }
}
```

Next, rebuild your app as described in the ["Adding custom native code"](https://docs.expo.io/workflow/customizing/) guide.

## API

The plugin does not provide any props for extra customization.

#### Example

```json
{
  "expo": {
    "plugins": [
      "@config-plugins/react-native-global-keyevent"
    ]
  }
}
```
