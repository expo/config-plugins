import React from "react";
import { Button, Linking, StyleSheet, View } from "react-native";

import {
  SettingsRadioGroup,
  SettingsSlider,
  SettingsSwitch,
  SettingsTextInput,
  SettingsTitle,
} from "./SettingsViews";

const App = () => {
  return (
    <View style={styles.container}>
      {/* <SettingsTitle settingsKey="title_preference" /> */}
      <SettingsTextInput
        style={{
          height: 40,
          borderColor: "gray",
          borderWidth: 1,
          padding: 8,
        }}
        settingsKey="name_preference"
      />
      <SettingsSwitch settingsKey="enabled_preference" />
      <SettingsSlider settingsKey="slider_preference" />
      <View />
      {/* Broken https://forums.developer.apple.com/forums/thread/764519 */}
      {/*<SettingsRadioGroup settingsKey="radio_preference">*/}
      {/*  <SettingsRadioGroup.Item label="Option 1" value="option1" />*/}
      {/*  <SettingsRadioGroup.Item label="Option 2" value="option2" />*/}
      {/*</SettingsRadioGroup>*/}
      <View />
      <Button
        title="Launch Settings"
        onPress={() => {
          void Linking.openSettings();
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "stretch",
    paddingHorizontal: 56,
    gap: 12,
  },
  value: {
    fontSize: 24,
    marginVertical: 12,
  },
});

export default App;
