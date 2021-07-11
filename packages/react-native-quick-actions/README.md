# @config-plugins/react-native-quick-actions

Expo Config Plugin to auto configure [`react-native-quick-actions`](https://www.npmjs.com/package/react-native-quick-actions) when the native code is generated (`expo prebuild`).

## Expo installation

> Tested against Expo SDK 42

This package cannot be used in the "Expo Go" app because [it requires custom native code](https://docs.expo.io/workflow/customizing/).

- First install the package with yarn, npm, or [`expo install`](https://docs.expo.io/workflow/expo-cli/#expo-install).

```sh
expo install react-native-quick-actions @config-plugins/react-native-quick-actions
```

After installing this npm package, add the [config plugin](https://docs.expo.io/guides/config-plugins/) to the [`plugins`](https://docs.expo.io/versions/latest/config/app/#plugins) array of your `app.json` or `app.config.js`:

```json
{
  "expo": {
    "plugins": ["@config-plugins/react-native-quick-actions"]
  }
}
```

Next, rebuild your app as described in the ["Adding custom native code"](https://docs.expo.io/workflow/customizing/) guide.

## API

The plugin provides props for extra customization. Every time you change the props or plugins, you'll need to rebuild (and `prebuild`) the native app. If no extra properties are added, defaults will be used.

iOS only; an array of the objects with the following keys:

- `title`: (_string_): `UIApplicationShortcutItemTitle`: Name of action (required)
- `type`: (_string_): `UIApplicationShortcutItemType`: A unique string that the system passes to your app (required)
- `subtitle` (_string_): `UIApplicationShortcutItemSubtitle`: Subtitle message
- `iconType` (_string_): `UIApplicationShortcutItemIconType`: List of [icon types](https://developer.apple.com/design/human-interface-guidelines/ios/icons-and-images/system-icons/#home-screen-quick-action-icons) (ex: "UIApplicationShortcutIconTypeLocation")
- `iconSymbolName` (_string_): `UIApplicationShortcutItemIconSymbolName`: Name of system icon, here is an [unofficial list](https://github.com/cyanzhong/sf-symbols-online) (ex: "square.stack.3d.up")
- `iconFile` (_string_): `UIApplicationShortcutItemIconFile`: Name of the resource file (Not supported)
- `userInfo` (_XML.XMLObject_): `UIApplicationShortcutItemUserInfo`: An optional, app-defined dictionary. One use for this dictionary is to provide app version information, as described in the “App Launch and App Update Considerations for Quick Actions” section of the overview in UIApplicationShortcutItem Class Reference.

#### Example

```json
{
  "expo": {
    "plugins": [
      [
        "@config-plugins/react-native-quick-actions",
        [
          {
            "title": "Take Photo",
            "type": "photo",
            "iconType": "UIApplicationShortcutIconTypeCapturePhoto"
          }
        ]
      ]
    ]
  }
}
```
