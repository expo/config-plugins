import React from "react";
import { SafeAreaView, Text, StyleSheet } from "react-native";
import { Adjust, AdjustConfig } from "react-native-adjust";

export default function App() {
  React.useEffect(() => {
    // https://github.com/adjust/react_native_sdk/blob/bd4fe59403a57599767606b2bcaa116852df973d/example/App.js#L45
    const adjustConfig = new AdjustConfig(
      "APP_TOKEN",
      AdjustConfig.EnvironmentSandbox
    );
    Adjust.enable();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text>Adjust SDK</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
