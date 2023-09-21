# @config-plugins/tv

Expo Config Plugin to auto-configure the native directories for TV

## Expo installation

> Tested against Expo SDK 50 alpha

This package cannot be used in the "Expo Go" app because Expo Go does not support TV.

- First install the package with yarn, npm, or [`npx expo install`](https://docs.expo.io/workflow/expo-cli/#expo-install).

```sh
npx expo install tv @config-plugins/tv
```

After installing this npm package, add the [config plugin](https://docs.expo.io/guides/config-plugins/) to the [`plugins`](https://docs.expo.io/versions/latest/config/app/#plugins) array of your `app.json` or `app.config.js`:

```json
{
  "expo": {
    "plugins": ["@config-plugins/tv"]
  }
}
```

or

```json
{
  "expo": {
    "plugins": [
      [
        "@config-plugins/tv",
        {
          "isTV": true,
          "showVerboseWarnings": false
        }
      ]
    ]
  }
}
```

## Usage

_Plugin parameters_:

- `isTV`: (optional boolean, default false) If true, prebuild should generate or modify Android and iOS files to build for TV (Android TV and Apple TV). If false, the default phone-appropriate files should be generated, and if existing files contain TV changes, they will be reverted.  Setting the environment variable EXPO_TV to "true" or "1" will override this value and force a TV build.
- `showVerboseWarnings`: (optional boolean, default false) If true, verbose warnings will be shown during plugin execution.

_Warning_:

When this plugin is used to generate files in the iOS directory that build an Apple TV or Android TV app, your React Native dependency in `package.json` must be set to the React Native TV fork, as shown in the example below:

```json
{
  "dependencies": {
    "react-native": "npm:react-native-tvos@^0.72.4-0"
  }
}
```

If this is not the case, the plugin will run successfully, but Cocoapods installation will fail, since React Native core repo does not support Apple TV. Android TV build will succeed, but will not contain native changes needed to correctly navigate the screen using a TV remote, and may have other problems.
