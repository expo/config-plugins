import React from "react";
import { useState } from "react";
import { Text, Button, View } from "react-native";

import AppIcon from "react-native-dynamic-app-icon";

function useIconName() {
    const [icon, _setIcon] = React.useState(null);

    React.useEffect(() => {
        let isMounted = true;
        AppIcon.getIconName((result) => {
            if (isMounted) _setIcon(result.iconName);
        });
        return () => (isMounted = false);
    }, []);

    const setIcon = React.useCallback((icon) => {
        AppIcon.setAppIcon(icon);
        _setIcon(icon)
    }, [_setIcon])
    return [icon, setIcon];
}

export default function App() {
    const [icon, setIcon] = useIconName();
    const [index, setIndex] = React.useState(0)
    const icons = [null, '0', '1', '2'];

    React.useEffect(() => {
        setIcon(icons[index % icons.length]);
    }, [index]);

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text>Current: {icon}</Text>
            <Button
                onPress={() => {
                    setIndex(() => index + 1);
                }}
                title="Toggle Icon"
            />
        </View>
    );
}
