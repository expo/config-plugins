# config-plugins/react-native-pdf

Config plugin to auto-configure [`react-native-pdf`][lib] when the native code is generated (`expo prebuild`).

### Add the package to your npm dependencies

> Tested against Expo SDK 46

```
yarn add react-native-pdf react-native-blob-util fbjs @config-plugins/react-native-pdf @config-plugins/react-native-blob-util
```

After installing this npm package, add the [config plugin](https://docs.expo.io/guides/config-plugins/) to the [`plugins`](https://docs.expo.io/versions/latest/config/app/#plugins) array of your `app.json` or `app.config.js`:

```json
{
  "expo": {
    "plugins": [
      "@config-plugins/react-native-blob-util",
      "@config-plugins/react-native-pdf"
    ]
  }
}
```

Next, rebuild your app as described in the ["Adding custom native code"](https://docs.expo.io/workflow/customizing/) guide.

[lib]: https://www.npmjs.com/package/react-native-pdf
