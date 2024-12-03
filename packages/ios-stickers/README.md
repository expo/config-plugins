# @config-plugins/ios-stickers

Config plugin to auto-configure iOS iMessage stickers

## Versioning

Ensure you use versions that work together!

| `expo` | `@config-plugins/ios-stickers` |
| ------ | ------------------------------ |
| 52.0.0 | 9.0.0                          |
| 51.0.0 | 8.0.0                          |
| 50.0.0 | 7.0.0                          |
| 49.0.0 | 6.0.0                          |

## Install

> This package cannot be used in the "Expo Go" app because [it requires custom native code](https://docs.expo.io/workflow/customizing/).

```
npx expo install @config-plugins/ios-stickers
```

## Example

In your app.json `plugins` array:

```json
{
  "plugins": [
    [
      "@config-plugins/ios-stickers",
      {
        "name": "Stickers!",
        "icon": "./assets/imessage-icon.png",
        "stickerBundleId": "dev.bacon.iosstickers.stickers",
        "columns": 4,
        "stickers": [
          "./assets/stickers/annoyed.png",
          "./assets/stickers/cuddle.png",
          "./assets/stickers/crazy.png",
          "./assets/stickers/cant.png",
          "./assets/stickers/donno.png",
          "./assets/stickers/cozzy.png",
          "./assets/stickers/dork.png",
          "./assets/stickers/focus.png",
          "./assets/stickers/avocool.png",
          "./assets/stickers/coder-girl.png",
          "./assets/stickers/teapot.png"
        ]
      }
    ]
  ]
}
```

- `name`: defaults to the iOS app name
- `stickerBundleId`: custom bundle identifier for the stickers project, if not provided, it will defaults to `${ios.bundleIdentifier}.${name}-Stickers` given your expo config values.
- `icon`: defaults to the iOS app icon
- `columns`: number of stickers to render, defaults to `3`. Can be one of `2`, `3`, `4`.
- `stickers`: local file paths or remote URLs, or `{ image: "...", name: "...", accessibilityLabel: "..." }`. Order is preserved.
