# @config-plugins/airbridge-react-native-sdk

Expo Config Plugin to auto configure [`airbridge-react-native-sdk`](https://www.npmjs.com/package/airbridge-react-native-sdk) when the native code is generated (`expo prebuild`).

## Expo installation

> Tested against Expo SDK 42

This package cannot be used in the "Expo Go" app because [it requires custom native code](https://docs.expo.io/workflow/customizing/).

- First install the package with yarn, npm, or [`expo install`](https://docs.expo.io/workflow/expo-cli/#expo-install).

```sh
expo install airbridge-react-native-sdk @config-plugins/airbridge-react-native-sdk
```

After installing this npm package, add the [config plugin](https://docs.expo.io/guides/config-plugins/) to the [`plugins`](https://docs.expo.io/versions/latest/config/app/#plugins) array of your `app.json` or `app.config.js`:

```json
{
  "expo": {
    "plugins": ["@config-plugins/airbridge-react-native-sdk"]
  }
}
```

Next, rebuild your app as described in the ["Adding custom native code"](https://docs.expo.io/workflow/customizing/) guide.

## API

The plugin provides props for extra customization. Every time you change the props or plugins, you'll need to rebuild (and `prebuild`) the native app. If no extra properties are added, defaults will be used.

- `foobar` (_boolean_): Does XYZ. Default `false`.

#### Example

```json
{
  "expo": {
    "plugins": [
      [
        "@config-plugins/airbridge-react-native-sdk",
        {
          // props ...
        }
      ]
    ]
  }
}
```
