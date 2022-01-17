import React from "react";
import { SafeAreaView, Text, StyleSheet } from "react-native";
import { Adjust, AdjustConfig } from "react-native-adjust";

export default function App() {
  React.useEffect(() => {
    const adjustConfig = new AdjustConfig(
      "APP_TOKEN",
      AdjustConfig.EnvironmentSandbox
    );
    Adjust.create(adjustConfig);
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
