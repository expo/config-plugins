# @config-plugins/%CONFIG_PLUGIN%

Expo Config Plugin to auto configure [`%NPM_MODULE%`](https://www.npmjs.com/package/%NPM_MODULE%) when the native code is generated (`npx expo prebuild`).

## Expo installation

> Tested against Expo SDK %SDK_VERSION%

This package cannot be used in the "Expo Go" app because [it requires custom native code](https://docs.expo.io/workflow/customizing/).

- First install the package with yarn, npm, or [`npx expo install`](https://docs.expo.io/workflow/expo-cli/#expo-install).

```sh
npx expo install %NPM_MODULE% @config-plugins/%CONFIG_PLUGIN%
```

After installing this npm package, add the [config plugin](https://docs.expo.io/guides/config-plugins/) to the [`plugins`](https://docs.expo.io/versions/latest/config/app/#plugins) array of your `app.json` or `app.config.js`:

```json
{
  "expo": {
    "plugins": ["@config-plugins/%CONFIG_PLUGIN%"]
  }
}
```

Next, rebuild your app as described in the ["Adding custom native code"](https://docs.expo.io/workflow/customizing/) guide.

## API

The plugin provides props for extra customization. Every time you change the props or plugins, you'll need to rebuild (and `prebuild`) the native app. If no extra properties are added, defaults will be used.

- `foobar` (_boolean_): Does XYZ. Default `false`.

#### Example

```json
{
  "expo": {
    "plugins": [
      [
        "@config-plugins/%CONFIG_PLUGIN%",
        {
          // props ...
        }
      ]
    ]
  }
}
```
