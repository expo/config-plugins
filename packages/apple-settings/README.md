# @config-plugins/apple-settings

Config plugin to generate custom [Apple settings UI](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/UserDefaults/Preferences/Preferences.html).

## Install

> Tested against Expo SDK 49

```
yarn add @config-plugins/apple-settings
```

## Example

This plugin accepts a nested JSON,

To use this plugin, create a new wrapper Config Plugin:

```js
const {
  default: withAppleSettings,
  TextField,
  Switch,
  Slider,
  ChildPane,
  Group,
} = require("@config-plugins/apple-settings");

module.exports = (config) => {
  return withAppleSettings(config, {
    // The name of the .plist file to generate. Root is the default and must be provided.
    Root: {
      // The locales object is optional. If provided, it will be used to generate the localized .strings files.
      locales: {
        // The Apple locale code. This will be used to generate the .strings file.
        en: {
          // Name of the localized key.
          Name: "Text Field",
        },
      },
      // The page object is required. It will be used to generate the .plist file.
      // The contents will be converted directly to plist.
      page: {
        // The `PreferenceSpecifiers` defines the UI elements to generate.
        PreferenceSpecifiers: [
          // Helper models can be used to generate the UI elements using a syntax that's
          // similar to React Native.
          TextField({
            title: "Name",
            key: "name_preference",
            value: "",
            keyboardType: "Alphabet",
            autoCapitalize: "None",
            autoCorrect: "No",
          }),
          Switch({
            title: "Enabled",
            key: "enabled_preference",
            value: true,
          }),
          Slider({
            key: "slider_preference",
            value: 0.5,
          }),
          // Child panes can be used to create nested pages.
          ChildPane({
            title: "About",
          }),
        ],
      },
    },
    About: {
      page: {
        PreferenceSpecifiers: [
          Group({
            title: "About Info",
          }),
        ],
      },
    },
  });
};
```

## API

The following helper models are available:

```js
const {
  ChildPane,
  Title,
  Group,
  TextField,
  Slider,
  Switch,
  RadioGroup,
  MultiValue,
} = require("@config-plugins/apple-settings");
```

## Types

The entire Apple settings spec is typed according to the [official docs](https://developer.apple.com/library/archive/documentation/PreferenceSettings/Conceptual/SettingsApplicationSchemaReference/Introduction/Introduction.html#//apple_ref/doc/uid/TP40007005-SW1) and generated from a strict JSON schema.

```ts
import {
  // Settings plist object
  SettingsPlist,
  // Models
  PSGroupSpecifier,
  PSTextFieldSpecifier,
  PSToggleSwitchSpecifier,
  PSSliderSpecifier,
  PSChildPaneSpecifier,
  PSTitleValueSpecifier,
  PSMultiValueSpecifier,
  PSRadioGroupSpecifier,
  // Additional types
  AnyPreferenceSpecifier,
  UserInterfaceIdiom,
  ScalarType,
} from "@config-plugins/apple-settings";
```

## Dynamic usage

The dynamic values can be interacted with using the [`Settings`](https://reactnative.dev/docs/settings) module from `react-native`:

```js
import React from "react";
import { Button, Settings, StyleSheet, Text, View } from "react-native";

function useSetting(key: string) {
  const [value, setValue] = React.useState(() => Settings.get(key));
  React.useEffect(() => {
    let isMounted = true;
    const callback = Settings.watchKeys(key, () => {
      if (isMounted) {
        setValue(Settings.get(key));
      }
    });
    return () => {
      Settings.clearWatch(callback);
      isMounted = false;
    };
  }, [key]);

  return [
    value,
    (value) => {
      Settings.set({ [key]: value });
      setValue(value);
    },
  ];
}

const App = () => {
  const [data, setData] = useSetting("enabled_preference");

  return (
    <View style={styles.container}>
      <Text>Stored value:</Text>
      <Text style={styles.value}>{data}</Text>
      <Button
        onPress={() => {
          setData("Updated: " + Date.now());
        }}
        title="Update Setting"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  value: {
    fontSize: 24,
    marginVertical: 12,
  },
});

export default App;
```
