# config-plugins/react-native-code-push

Config plugin to auto-configure [`react-native-code-push`][lib] when the native code is generated (`npx expo prebuild`).

### Add the package to your npm dependencies

> Tested against Expo SDK 49

```
yarn add react-native-code-push @config-plugins/react-native-code-push
```

After installing this npm package, add the [config plugin](https://docs.expo.io/guides/config-plugins/) to the [`plugins`](https://docs.expo.io/versions/latest/config/app/#plugins) array of your `app.json` or `app.config.js`:

```json
{
  "expo": {
    "plugins": [
      [
        "@config-plugins/react-native-code-push",
        {
          "android": {
            "CodePushDeploymentKey": "YOUR_ANDROID_CODE_PUSH_KEY"
          },
          "ios": {
            "CodePushDeploymentKey": "YOUR_IOS_CODE_PUSH_KEY"
          }
        }
      ]
    ]
  }
}
```

Next, rebuild your app as described in the ["Adding custom native code"](https://docs.expo.io/workflow/customizing/) guide.

[lib]: https://www.npmjs.com/package/react-native-code-push
