# @config-plugins/android-jsc-intl

Expo Config Plugin to auto-configure [`android-jsc-intl`](https://www.npmjs.com/package/android-jsc-intl) when the native code is generated (`npx expo prebuild`).

Adding this plugin lets you use `Intl` in your Android app, without using Hermes.

## Expo installation

> Tested against Expo SDK 47

This package cannot be used in the "Expo Go" app because [it requires custom native code](https://docs.expo.io/workflow/customizing/).

- First install the package with yarn, npm, or [`npx expo install`](https://docs.expo.io/workflow/expo-cli/#expo-install).

```sh
npx expo install @config-plugins/android-jsc-intl
```

After installing this npm package, add the [config plugin](https://docs.expo.io/guides/config-plugins/) to the [`plugins`](https://docs.expo.io/versions/latest/config/app/#plugins) array of your `app.json` or `app.config.js`:

```json
{
  "expo": {
    "plugins": ["@config-plugins/android-jsc-intl"]
  }
}
```

Next, rebuild your app as described in the ["Adding custom native code"](https://docs.expo.io/workflow/customizing/) guide.
