# @config-plugins/react-native-google-signin

Config plugin to auto configure react-native-google-signin on prebuild

# API documentation

- [Documentation for the main branch](https://github.com/expo/expo/blob/main/docs/pages/versions/unversioned/sdk/@config-plugins/react-native-google-signin.md)
- [Documentation for the latest stable release](https://docs.expo.dev/versions/latest/sdk/@config-plugins/react-native-google-signin/)

# Installation in managed Expo projects

For [managed](https://docs.expo.dev/archive/managed-vs-bare/) Expo projects, please follow the installation instructions in the [API documentation for the latest stable release](#api-documentation). If you follow the link and there is no documentation available then this library is not yet usable within managed projects &mdash; it is likely to be included in an upcoming Expo SDK release.

# Installation in bare React Native projects

For bare React Native projects, you must ensure that you have [installed and configured the `expo` package](https://docs.expo.dev/bare/installing-expo-modules/) before continuing.

### Add the package to your npm dependencies

```
npm install @config-plugins/react-native-google-signin
```

### Example

```json
{
  "expo": {
    "plugins": [
      [
        "@config-plugins/react-native-google-signin",
        {
          "serverClientId": "...",
          "iosClientId": "...",
          "iosUrlScheme": "..."
        }
      ]
    ]
  }
}
```


# Contributing

Contributions are very welcome! Please refer to guidelines described in the [contributing guide]( https://github.com/expo/expo#contributing).
