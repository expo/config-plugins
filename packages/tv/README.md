# @config-plugins/tv

Expo Config Plugin to auto-configure the native directories for TV development using the [React Native TV fork](https://github.com/react-native-tvos/react-native-tvos). The TV fork supports development for both phone (Android and iOS) and TV (Android TV and Apple TV), so the plugin can be used in a project that targets both phone and TV devices.

_Notes_:

- This is an experimental plugin, tested only against Expo 50 alpha packages.
- This package cannot be used in the "Expo Go" app because Expo Go does not support TV.
- Apple TV development will work with many of the commonly used SDK 50 packages, including `expo-updates`, but many Expo packages do not work on Apple TV and are not supported. In particular, `expo-dev-client`, `expo-dev-menu`, and `expo-dev-launcher` are not supported.

## Expo installation

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

- `isTV`: (optional boolean, default false) If true, prebuild should generate or modify Android and iOS files to build for TV (Android TV and Apple TV). If false, the default phone-appropriate files should be generated, and if existing files contain TV changes, they will be reverted. Setting the environment variable EXPO_TV to "true" or "1" will override this value and force a TV build.
- `showVerboseWarnings`: (optional boolean, default false) If true, verbose warnings will be shown during plugin execution.

_Warning_:

When this plugin is used to generate files in the iOS directory that build an Apple TV or Android TV app, your React Native dependency in `package.json` MUST be set to the React Native TV fork, as shown in the example below:

```json
{
  "dependencies": {
    "react-native": "npm:react-native-tvos@^0.72.5-0"
  }
}
```

If this is not the case, the plugin will run successfully, but Cocoapods installation will fail, since React Native core repo does not support Apple TV. Android TV build will succeed, but will not contain native changes needed to correctly navigate the screen using a TV remote, and may have other problems.

_Warning_:

If you have already generated native directories for a phone build, and set `EXPO_TV` to "true" or "1" (or set the `isTV` plugin parameter to true), then running `npx expo prebuild` will lead to errors when Cocoapods installation is run again. You will need to remove `ios/Pods` and `ios/Podfile.lock` before running Cocoapods installation.

To avoid this issue, it is strongly recommended to run `npx expo prebuild --clean` if changing the `EXPO_TV` environment variable or the `isTV` plugin parameter.
