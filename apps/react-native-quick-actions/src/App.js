import QuickActions from "react-native-quick-actions";
import React from "react";
import { Text, View } from "react-native";

import { DeviceEventEmitter } from "react-native";

function useQuickAction() {
  const [item, setItem] = React.useState(null);
  const isMounted = React.useRef(true);
  React.useEffect(() => {
    QuickActions.popInitialAction().then((action) => {
      if (isMounted.current) setItem(action);
    });
    const sub = DeviceEventEmitter.addListener(
      "quickActionShortcut",
      (data) => {
        if (isMounted.current) {
          setItem(data);
        }
      }
    );
    return () => {
      isMounted.current = false;
      sub.remove();
    };
  }, []);
  return item;
}

function App() {
  const action = useQuickAction();

  React.useEffect(() => {
    QuickActions.setShortcutItems([
      {
        title: "Play Song",
        subtitle: "NDA - Billie Eilish",
        icon: "Play",
        type: "alpha",
      },
      {
        title: "Shuffle",
        icon: "Shuffle",
        type: "beta",
      },
      {
        title: "Like Song",
        icon: "Love",
        type: "gamma",
      },
    ]);
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Quick Actions</Text>
      {action && <Text>{JSON.stringify(action, null, 2)}</Text>}
    </View>
  );
}
export default App;
