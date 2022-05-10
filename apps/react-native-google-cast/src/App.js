import React from "react";
import { View, Text, Button } from "react-native";
import GoogleCast, {
  CastState,
  CastButton,
  useCastState,
  useRemoteMediaClient,
} from "react-native-google-cast";

export default function HomeScreen() {
  const castState = useCastState();
  const client = useRemoteMediaClient();

  GoogleCast.showIntroductoryOverlay();

  const isConnected = castState === CastState.CONNECTED;

  function cast() {
    client
      .loadMedia({
        mediaInfo: {
          contentUrl:
            "https://commondatastorage.googleapis.com/gtv-videos-bucket/CastVideos/mp4/BigBuckBunny.mp4",
          contentType: "video/mp4",
          metadata: {
            images: [
              {
                url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/CastVideos/images/480x270/BigBuckBunny.jpg",
              },
            ],
            title: "Big Buck Bunny",
            subtitle:
              "A large and lovable rabbit deals with three tiny bullies, led by a flying squirrel, who are determined to squelch his happiness.",
            studio: "Blender Foundation",
            type: "movie",
          },
          streamDuration: 596, // seconds
        },
        startTime: 10, // seconds
      })
      .then(console.log)
      .catch(console.warn);
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>State: {castState}</Text>
      <CastButton style={{ width: 24, height: 24 }} />
      <Button
        title="Overlay"
        onPress={() => {
          GoogleCast.showIntroductoryOverlay();
        }}
      />
      <Button
        title="Expanded Controls"
        onPress={() => {
          GoogleCast.showExpandedControls();
        }}
      />

      <Button
        title="Cast"
        disabled={!isConnected}
        onPress={() => {
          cast();
        }}
      />
      <Button
        title="Pause"
        disabled={!isConnected}
        onPress={() => {
          //   cast()
          client.pause();
        }}
      />
      <Button
        title="Disconnect"
        disabled={!isConnected}
        onPress={() => {
          GoogleCast.sessionManager.endCurrentSession(true);
        }}
      />
    </View>
  );
}
