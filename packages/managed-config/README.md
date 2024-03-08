# @config-plugins/managed-config

Expo Config Plugin to auto-configure [Managed Configurations](https://developer.android.com/work/managed-configurations) on Android, facilitating the integration with Mobile Device Management (MDM) solutions like [Microsoft Intune](https://www.microsoft.com/en-us/mem/intune) and [VMware Workspace ONE](https://www.vmware.com/products/workspace-one.html). This allows enterprises to remotely manage and configure apps. It can be used with libraries such as [react-native-emm](https://github.com/mattermost/react-native-emm) or [react-native-mdm](https://github.com/robinpowered/react-native-mdm) to allow your app to be managed by an MDM solution.

## Expo Installation

> Note: This package cannot be utilized in the "Expo Go" app due to its reliance on custom native code, as detailed in Expo's [customizing the build process guide](https://docs.expo.io/workflow/customizing/).

First, install the package using yarn, npm, or [`npx expo install`](https://docs.expo.io/workflow/expo-cli/#expo-install) for better version compatibility:

```sh
npm install @config-plugins/managed-config
```

Or

```sh
yarn add @config-plugins/managed-config
```

After installation, add the [config plugin](https://docs.expo.io/guides/config-plugins/) to the [`plugins`](https://docs.expo.io/versions/latest/config/app/#plugins) array in your project's `app.json` or `app.config.js`:

```json
{
  "expo": {
    "plugins": [
      [
        "@config-plugins/managed-config",
        {
          "restrictions": [
            {
              "key": "test_key",
              "title": "Test Title",
              "restrictionType": "string",
              "description": "A test description",
              "defaultValue": "Default value"
            }
            // Add more restrictions as needed
          ]
        }
      ]
    ]
  }
}
```

Lastly, you'll need to rebuild your app to apply these changes. Refer to Expo's guide on ["Adding custom native code"](https://docs.expo.io/workflow/customizing/) for instructions on rebuilding your app.

## API

The plugin is configured through the `plugins` section of your `app.json` or `app.config.js`. The configuration object accepts a `restrictions` array, where each object represents a managed configuration that your app supports. The structure for each restriction object is as follows:

### Properties

- **`key`** (string): A unique identifier for the restriction.
- **`title`** (string): A human-readable title for the restriction, used by the MDM solution to display to admins.
- **`restrictionType`** (string): The type of the restriction. Possible values include `bool`, `string`, `integer`, `choice`, `multi-select`, `hidden`, `bundle`, and `bundle_array`.
- **`description`** (optional, string): A detailed description of the restriction.
- **`defaultValue`** (optional, string | boolean | number | string[] | null): The default value for the restriction. The type depends on the `restrictionType`.
- **`entries`** (optional, string[]): Applicable to `choice` and `multi-select` types. An array of human-readable options.
- **`entryValues`** (optional, string[]): Applicable to `choice` and `multi-select` types. An array of values corresponding to each option in `entries`.

### Example:

Adding a configuration for a "dark mode" setting that allows users to choose between 'enabled' and 'disabled'.

```json
{
  "expo": {
    "plugins": [
      [
        "@config-plugins/managed-config",
        {
          "restrictions": [
            {
              "key": "dark_mode",
              "title": "Dark Mode",
              "restrictionType": "choice",
              "entries": ["Enabled", "Disabled"],
              "entryValues": ["enabled", "disabled"],
              "defaultValue": "disabled",
              "description": "Allow users to select dark mode preference"
            }
          ]
        }
      ]
    ]
  }
}
```

This plugin simplifies the process of making your app manageable through MDM solutions by automating the setup of managed configurations.

For further details or support, check the [official documentation](https://developer.android.com/work/managed-configurations) on managed configurations.
