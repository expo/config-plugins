# @config-plugins/react-native-permissions

Expo Config Plugin to auto-configure [`react-native-permissions`](https://www.npmjs.com/package/react-native-permissions) when the native code is generated (`expo prebuild`).

## Expo installation

> Tested against Expo SDK 46

This package cannot be used in the "Expo Go" app because [it requires custom native code](https://docs.expo.io/workflow/customizing/).

- First install the package with yarn, npm, or [`expo install`](https://docs.expo.io/workflow/expo-cli/#expo-install).

```sh
expo install react-native-permissions @config-plugins/react-native-permissions
```

After installing this npm package, add the [config plugin](https://docs.expo.io/guides/config-plugins/) to the [`plugins`](https://docs.expo.io/versions/latest/config/app/#plugins) array of your `app.json` or `app.config.js` and provide a list of [permission handlers](https://github.com/zoontek/react-native-permissions#ios) that should be installed:

> You can omit the `Permission-` prefix from the pod name, eg. `Permission-Camera` should be just `Camera`:

```json
{
  "expo": {
    "plugins": [
      [
        "@config-plugins/react-native-permissions",
        { "pods": ["Camera", "Notifications"] }
      ]
    ]
  }
}
```

Next, rebuild your app as described in the ["Adding custom native code"](https://docs.expo.io/workflow/customizing/) guide.

⚠️ Please note that this config plugin doesn't handle the configuration of Android permissions since Expo provides a [built-in way](https://docs.expo.dev/guides/permissions/#android) to do that. Same applies for [iOS permission messages](https://docs.expo.dev/guides/permissions/#ios) in your `Info.plist`. You will need to configure those in order to use `react-native-permissions` properly.
