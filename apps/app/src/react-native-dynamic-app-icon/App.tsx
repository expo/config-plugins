import Entypo from '@expo/vector-icons/Entypo';
import React from 'react';
import { Image, SafeAreaView, Text, View } from 'react-native';
import AppIcon from 'react-native-dynamic-app-icon';
import TouchableBounce from 'react-native/Libraries/Components/Touchable/TouchableBounce';

function useIconName() {
    const [icon, _setIcon] = React.useState(null);

    React.useEffect(() => {
        let isMounted = true;
        AppIcon.getIconName((result) => {
            if (isMounted) _setIcon(result.iconName);
        });
        return () => (isMounted = false);
    }, []);

    const setIcon = React.useCallback(
        (icon) => {
            AppIcon.setAppIcon(icon);
            _setIcon(icon || null);
        },
        [_setIcon]
    );
    return [icon === "default" ? null : icon, setIcon];
}

const icons = [
    {
        name: "Automatic",
        source: require("../../assets/icon.png"),
        iconId: null,
        color: "#FFBB8E",
    },
    {
        name: "Spring",
        source: require("../../assets/stickers/avocool.png"),
        iconId: "0",
        color: "#A2A3F1",
    },
    {
        name: "Summer",
        source: { uri: "https://pbs.twimg.com/profile_images/1308332115919020032/jlqFOD33_400x400.jpg", },
        color: "#FFDB8A",
        iconId: "1",
    },
    {
        name: "Autumn",
        source: { uri: "https://s3.amazonaws.com/assets.materialup.com/users/pictures/000/361/144/preview/open-uri20180613-4-1yz52gq?1528892052" },
        color: "#FFBB8E",
        iconId: "2",
    },
];

export default function App() {
    const [_icon, setIcon] = useIconName();

    return (
        <SafeAreaView
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <View style={{ width: "100%" }}>
                {icons.map((icon, index) => {
                    return (
                        <Item
                            onPress={() => {
                                setIcon(icon.iconId);
                            }}
                            isSelected={icon.iconId === _icon}
                            name={icon.name}
                            color={icon.color}
                            source={icon.source}
                            key={String(index)}
                        />
                    );
                })}
            </View>
        </SafeAreaView>
    );
}

function Item({ ...props }) {
    return (
        <TouchableBounce
            onPress={props.onPress}
            style={{ marginVertical: 8, marginHorizontal: 24 }}
        >
            <View

                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "stretch",
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 4,
                    },
                    shadowOpacity: props.isSelected ? 0.35 : 0.2,
                    shadowRadius: 8.46,

                    backgroundColor: props.isSelected ? "#000" : "#F1F1F1",
                    elevation: 9,
                    paddingHorizontal: 12,
                    paddingVertical: 12,
                    borderRadius: 20,
                }}
            >
                <View
                    style={{
                        flexDirection: "row",
                        flex: 1,
                        alignItems: "center",
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            flex: 1,
                            alignItems: "center",
                        }}
                    >
                        <Image
                            source={props.source}
                            style={{
                                width: 64,
                                aspectRatio: 1,
                                resizeMode: "cover",
                                borderRadius: 16,
                            }}
                        />
                        <Text
                            style={{
                                marginLeft: 20,
                                fontSize: 18,
                                fontWeight: "700",
                                color: props.isSelected ? "white" : "black",
                            }}
                        >
                            {props.name}
                        </Text>
                    </View>
                    {props.isSelected && (
                        <Entypo
                            style={{ marginRight: 8 }}
                            name="check"
                            size={20}
                            color="white"
                        />
                    )}
                </View>
            </View>
        </TouchableBounce>
    );
}
