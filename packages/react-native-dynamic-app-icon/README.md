# @config-plugins/react-native-dynamic-app-icon

Config plugin to auto configure `react-native-dynamic-app-icon`

## Install

```
yarn add react-native-dynamic-app-icon @config-plugins/react-native-dynamic-app-icon
```

## Example

In your app.json `plugins` array:

```json
{
  "plugins": [
    "@config-plugins/react-native-dynamic-app-icon",
    ["./path/to/image.png", "https://mywebsite.com/my-icon.png"]
  ]
}
```

Or as objects:

```json
{
  "plugins": [
    "@config-plugins/react-native-dynamic-app-icon",
    {
      "AppIcon1": {
        "image": "./path/to/image.png",
        "prerendered": true
      }
    }
  ]
}
```

> Note: Icon URLs will be downloaded and embedded at build time, you cannot push new icons OTA.

<!-- Android support: https://github.com/myinnos/AppIconNameChanger -->
