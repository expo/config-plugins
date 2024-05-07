import { Session } from "ffmpeg-kit-react-native";
import React from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "react-native";

import { useMediaInfo, useResolvedValue } from "./useMediaInfo";

export default function App() {
  const session = useMediaInfo(
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
  );

  if (!session) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator />
        <Text>Loading...</Text>
      </View>
    );
  }

  return <SessionInfo session={session} />;
}

function SessionInfo(props: { session: Session }) {
  const { session } = props;
  const duration = useResolvedValue(session.getDuration.bind(session));
  const output = useResolvedValue(session.getOutput.bind(session));
  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ScrollView>
        <Text>Duration: {duration}</Text>
        <Text>Output: {output}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
