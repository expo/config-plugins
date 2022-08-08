# @config-plugins/react-native-siri-shortcut

Expo Config Plugin to auto-configure [`react-native-siri-shortcut`](https://www.npmjs.com/package/react-native-siri-shortcut) when the native code is generated (`expo prebuild`).

## Expo installation

> Tested against Expo SDK 46

This package cannot be used in the "Expo Go" app because [it requires custom native code](https://docs.expo.io/workflow/customizing/).

- First install the package with yarn, npm, or [`expo install`](https://docs.expo.io/workflow/expo-cli/#expo-install).

```sh
expo install react-native-siri-shortcut @config-plugins/react-native-siri-shortcut
```

After installing this npm package, add the [config plugin](https://docs.expo.io/guides/config-plugins/) to the [`plugins`](https://docs.expo.io/versions/latest/config/app/#plugins) array of your `app.json` or `app.config.js`:

```json
{
  "expo": {
    "plugins": ["@config-plugins/react-native-siri-shortcut"]
  }
}
```

Next, rebuild your app as described in the ["Adding custom native code"](https://docs.expo.io/workflow/customizing/) guide.

## API

When working with Siri Shorcuts, you need to define their identifiers on the Xcode project. To achieve the same result using this plugin, just pass an array of strings with the identifiers of your shortcuts, and they will be added automatically during the build cycle:

#### Example

```json
{
  "expo": {
    "plugins": [
      [
        "@config-plugins/react-native-siri-shortcut",
        ["com.example.InitiateWorkout", "com.example.FinishWorkout"]
      ]
    ]
  }
}
```
