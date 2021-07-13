import QuickActions from "react-native-quick-actions";
import React from "react";
import { Text, View } from "react-native";

import { DeviceEventEmitter } from "react-native";

function useQuickAction(): QuickActions.ShortcutItem | null {
    const [item, setItem] = React.useState<QuickActions.ShortcutItem | null>(null);
    const isMounted = React.useRef(true)
    React.useEffect(() => {
        QuickActions.popInitialAction().then(action => {
            if (isMounted.current) setItem(action);
        })
        const sub = DeviceEventEmitter.addListener("quickActionShortcut", data => {
            if (isMounted.current) {
                setItem(data);
            }
        });
        return () => {
            isMounted.current = false;
            sub.remove();
        }
    }, []);
    return item;
}

function App() {
    const action = useQuickAction();

    React.useEffect(() => {
        QuickActions.setShortcutItems([
            {
                title: 'Play Song',
                subtitle: 'NDA - Billie Eilish',
                icon: 'Play',
                type: 'alpha',
            } as any,
            {
                title: 'Shuffle',
                icon: 'Shuffle',
                type: 'beta',
            } as any,
            {
                title: 'Like Song',
                icon: 'Love',
                type: 'gamma',
            } as any,
        ])
    }, [])

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text>Quick Actions</Text>
            {action && <Text>{JSON.stringify(action, null, 2)}</Text>}
        </View>
    );
}
export default App;
