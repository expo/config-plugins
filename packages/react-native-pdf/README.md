# config-plugins/react-native-pdf

Config plugin to auto-configure [`react-native-pdf`][lib] when the native code is generated (`npx expo prebuild`).

## Versioning

Ensure you use versions that work together!

| `expo` | `react-native-pdf` | `@config-plugins/react-native-pdf` |
| ------ | ------------------ | ---------------------------------- |
| 51.0.0 | 6.7.5              | 8.0.0                              |
| 50.0.0 | 6.7.4              | 7.0.0                              |
| 49.0.0 | 6.7.1              | 6.0.0                              |
| 48.0.0 | 6.6.2              | 5.0.0                              |

### Add the package to your npm dependencies

> This package cannot be used in the "Expo Go" app because [it requires custom native code](https://docs.expo.io/workflow/customizing/).

First install the package with yarn, npm, or [`npx expo install`](https://docs.expo.io/workflow/expo-cli/#expo-install).

```
npx expo install react-native-pdf react-native-blob-util @config-plugins/react-native-pdf @config-plugins/react-native-blob-util
```

After installing this npm package, add the [config plugin](https://docs.expo.io/guides/config-plugins/) to the [`plugins`](https://docs.expo.io/versions/latest/config/app/#plugins) array of your `app.json` or `app.config.js`:

```json
{
  "plugins": [
    "@config-plugins/react-native-blob-util",
    "@config-plugins/react-native-pdf"
  ]
}
```

Next, rebuild your app as described in the ["Adding custom native code"](https://docs.expo.io/workflow/customizing/) guide.

[lib]: https://www.npmjs.com/package/react-native-pdf
