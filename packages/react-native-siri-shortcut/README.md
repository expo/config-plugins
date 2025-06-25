# @config-plugins/react-native-siri-shortcut

Expo Config Plugin to auto-configure [`react-native-siri-shortcut`](https://www.npmjs.com/package/react-native-siri-shortcut) when the native code is generated (`npx expo prebuild`).

## Versioning

Ensure you use versions that work together!

| `expo` | `react-native-siri-shortcut` | `@config-plugins/react-native-siri-shortcut` |
| ------ | ---------------------------- | -------------------------------------------- |
| 53.0.0 | 3.2.4                        | 10.0.0                                       |
| 52.0.0 | 3.2.4                        | 8.0.0                                        |
| 51.0.0 | 3.2.4                        | 7.0.0                                        |
| 50.0.0 | 3.2.4                        | 6.0.0                                        |
| 49.0.0 | 3.2.3                        | 5.0.0                                        |
| 48.0.0 | 3.2.2                        | 4.0.0                                        |

## Expo installation

> This package cannot be used in the "Expo Go" app because [it requires custom native code](https://docs.expo.io/workflow/customizing/).

First install the package with yarn, npm, or [`npx expo install`](https://docs.expo.io/workflow/expo-cli/#expo-install).

```sh
npx expo install react-native-siri-shortcut @config-plugins/react-native-siri-shortcut
```

After installing this npm package, add the [config plugin](https://docs.expo.io/guides/config-plugins/) to the [`plugins`](https://docs.expo.io/versions/latest/config/app/#plugins) array of your `app.json` or `app.config.js`:

```json
{
  "plugins": ["@config-plugins/react-native-siri-shortcut"]
}
```

Next, rebuild your app as described in the ["Adding custom native code"](https://docs.expo.io/workflow/customizing/) guide.

## API

When working with Siri Shorcuts, you need to define their identifiers on the Xcode project. To achieve the same result using this plugin, just pass an array of strings with the identifiers of your shortcuts, and they will be added automatically during the build cycle:

#### Example

```json
{
  "plugins": [
    [
      "@config-plugins/react-native-siri-shortcut",
      ["com.example.InitiateWorkout", "com.example.FinishWorkout"]
    ]
  ]
}
```
