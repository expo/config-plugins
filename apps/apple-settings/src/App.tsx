import React from "react";
import { StyleSheet, View } from "react-native";

import { SettingsSwitch, SettingsTextInput } from "./SettingsViews";

const App = () => {
  return (
    <View style={styles.container}>
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
