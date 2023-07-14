# config-plugins/react-native-blob-util

Config plugin to auto-configure [`react-native-blob-util`][lib] when the native code is generated (`npx expo prebuild`).

## Versioning

Ensure you use versions that work together!

| `expo` | `react-native-blob-util` | `@config-plugins/react-native-blob-util` |
| ------ | ------------------------ | ---------------------------------------- |
| 49.0.0 | 0.18.3                   | 6.0.0                                    |
| 48.0.0 | 0.17.2                   | 5.0.0                                    |

### Add the package to your npm dependencies

> Tested against Expo SDK 49

```
yarn add react-native-blob-util @config-plugins/react-native-blob-util
```

This plugin is Android-only and required for `react-native-pdf`.

[lib]: https://www.npmjs.com/package/react-native-blob-util
