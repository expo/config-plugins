import React from "react";
import { Text, View } from "react-native";
import { DateTime } from "luxon";

const currentDate = DateTime.fromObject({
  locale: "en-US",
  zone: "America/New_York",
});

export default function App() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "blue",
      }}
    >
      <Text style={{ fontSize: 18, color: "white", textAlign: "center" }}>
        Intl support for Android, without Hermes 🤖
      </Text>
      <Text style={{ fontSize: 18, color: "white", textAlign: "center" }}>
        {currentDate.toISO()}
      </Text>
    </View>
  );
}
