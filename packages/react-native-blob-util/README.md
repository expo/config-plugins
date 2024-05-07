# config-plugins/react-native-blob-util

Config plugin to auto-configure [`react-native-blob-util`][lib] when the native code is generated (`npx expo prebuild`).

## Versioning

Ensure you use versions that work together!

| `expo` | `react-native-blob-util` | `@config-plugins/react-native-blob-util` |
| ------ | ------------------------ | ---------------------------------------- |
| 51.0.0 | 0.19.9                   | 8.0.0                                    |
| 50.0.0 | 0.19.6                   | 7.0.0                                    |
| 49.0.0 | 0.18.3                   | 6.0.0                                    |
| 48.0.0 | 0.17.2                   | 5.0.0                                    |

### Add the package to your npm dependencies

> This package cannot be used in the "Expo Go" app because [it requires custom native code](https://docs.expo.io/workflow/customizing/).

First install the package with yarn, npm, or [`npx expo install`](https://docs.expo.io/workflow/expo-cli/#expo-install).

```
npx expo install react-native-blob-util @config-plugins/react-native-blob-util
```

This plugin is Android-only and required for `react-native-pdf`.

[lib]: https://www.npmjs.com/package/react-native-blob-util
