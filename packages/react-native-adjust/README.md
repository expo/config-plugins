# @config-plugins/react-native-adjust

Expo Config Plugin to auto-configure [`react-native-adjust`](https://www.npmjs.com/package/react-native-adjust) when the native code is generated (`npx expo prebuild`).

## Versioning

Ensure you use versions that work together!

| `expo` | `react-native-adjust` | `@config-plugins/react-native-adjust` |
| ------ | --------------------- | ------------------------------------- |
| 53.0.0 | 5.1.0                 | 10.0.0                                |
| 52.0.0 | 5.0.2                 | 9.0.0                                 |
| 51.0.0 | 4.38.1                | 8.0.0                                 |
| 50.0.0 | 4.37.1                | 7.0.0                                 |
| 49.0.0 | 4.33.0                | 6.0.0                                 |

## Expo installation

> This package cannot be used in the "Expo Go" app because [it requires custom native code](https://docs.expo.io/workflow/customizing/).

First install the package with yarn, npm, or [`npx expo install`](https://docs.expo.io/workflow/expo-cli/#expo-install).

```sh
npx expo install react-native-adjust @config-plugins/react-native-adjust
```

After installing this npm package, add the [config plugin](https://docs.expo.io/guides/config-plugins/) to the [`plugins`](https://docs.expo.io/versions/latest/config/app/#plugins) array of your `app.json` or `app.config.js`:

```json
{
  "plugins": ["@config-plugins/react-native-adjust"]
}
```

## Configuration Options

### Android 12+ Support

If you are targeting Android 12 and above (API level 31), you need to add it in the options of the plugin:

```json
{
  "plugins": [
    ["@config-plugins/react-native-adjust", { "targetAndroid12": true }]
  ]
}
```

This will add the [appropriate permission](https://github.com/adjust/react_native_sdk#add-permission-to-gather-google-advertising-id) for you.

### Meta Install Referrer

If you need to track Meta (Facebook) install referrers, you can enable the Meta install referrer dependency:

```json
{
  "plugins": [
    ["@config-plugins/react-native-adjust", { "metaInstallReferrer": true }]
  ]
}
```

This will add the `com.adjust.sdk:adjust-android-meta-referrer:5.4.0` dependency to your Android build.

Doc: https://dev.adjust.com/en/sdk/react-native/plugins/meta-referrer-plugin

### Combined Configuration

You can combine multiple options:

```json
{
  "plugins": [
    [
      "@config-plugins/react-native-adjust", 
      { 
        "targetAndroid12": true,
        "metaInstallReferrer": true
      }
    ]
  ]
}
```

Next, rebuild your app as described in the ["Adding custom native code"](https://docs.expo.io/workflow/customizing/) guide.
