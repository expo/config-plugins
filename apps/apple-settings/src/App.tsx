import React from "react";
import { Button, Linking, StyleSheet, View } from "react-native";

import {
  SettingsRadioGroup,
  SettingsSwitch,
  SettingsTextInput,
  SettingsTitle,
} from "./SettingsViews";

const App = () => {
  return (
    <View style={styles.container}>
      {/* <SettingsTitle settingsKey="title_preference" /> */}
      <SettingsRadioGroup style={{ width: 200 }} settingsKey="radio_preference">
        <SettingsRadioGroup.Item label="Option 1" value="option1" />
        <SettingsRadioGroup.Item label="Option 2" value="option2" />
      </SettingsRadioGroup>
      <SettingsSwitch settingsKey="enabled_preference" />
      <SettingsTextInput
        style={{
          width: 200,
          height: 40,
          borderColor: "gray",
          borderWidth: 1,
          padding: 8,
        }}
        settingsKey="name_preference"
      />
      <Button
        title="Launch Settings"
        onPress={() => {
          Linking.openSettings();
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  value: {
    fontSize: 24,
    marginVertical: 12,
  },
});

export default App;
