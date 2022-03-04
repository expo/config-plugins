import React, { useCallback } from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  Alert,
  TouchableHighlight,
} from "react-native";
import { LoginButton, Settings, ShareDialog } from "react-native-fbsdk-next";
import type { ShareContent } from "react-native-fbsdk-next";

const SHARE_LINK_CONTENT: ShareContent = {
  contentType: "link",
  contentUrl: "https://www.facebook.com/",
};

// Ask for consent first if necessary
// Possibly only do this for iOS if no need to handle a GDPR-type flow
Settings.initializeSDK();

export default function App() {
  const shareLinkWithShareDialog = useCallback(async () => {
    const canShow = await ShareDialog.canShow(SHARE_LINK_CONTENT);
    if (canShow) {
      try {
        const { isCancelled, postId } = await ShareDialog.show(
          SHARE_LINK_CONTENT
        );
        if (isCancelled) {
          Alert.alert("Share cancelled");
        } else {
          Alert.alert("Share success with postId: " + postId);
        }
      } catch (error) {
        Alert.alert("Share fail with error: " + error);
      }
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <LoginButton
        testID="facebook-login"
        onLoginFinished={(error, data) => {
          Alert.alert(JSON.stringify(error || data, null, 2));
        }}
      />
      <TouchableHighlight onPress={shareLinkWithShareDialog}>
        <Text style={styles.shareText}>Share link with ShareDialog</Text>
      </TouchableHighlight>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
  shareText: {
    fontSize: 20,
    margin: 10,
  },
});
