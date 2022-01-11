# @config-plugins/react-native-adjust

Expo Config Plugin to auto configure [`react-native-adjust`](https://www.npmjs.com/package/react-native-adjust) when the native code is generated (`expo prebuild`).

## Expo installation

> Tested against Expo SDK 44

This package cannot be used in the "Expo Go" app because [it requires custom native code](https://docs.expo.io/workflow/customizing/).

- First install the package with yarn, npm, or [`expo install`](https://docs.expo.io/workflow/expo-cli/#expo-install).

```sh
expo install react-native-adjust @config-plugins/react-native-adjust
```

After installing this npm package, add the [config plugin](https://docs.expo.io/guides/config-plugins/) to the [`plugins`](https://docs.expo.io/versions/latest/config/app/#plugins) array of your `app.json` or `app.config.js`:

```json
{
  "expo": {
    "plugins": ["@config-plugins/react-native-adjust"]
  }
}
```

Next, rebuild your app as described in the ["Adding custom native code"](https://docs.expo.io/workflow/customizing/) guide.
