import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import * as Localization from "expo-localization";
import i18n from "i18n-js";
// Set the key-value pairs for the different languages you want to support.
i18n.translations = {
    "en-US": { welcome: "Welcome", hello: "Hello", world: "World" },
    "nl-NL": { welcome: "Welkom", hello: "Hallo", world: "Wereld" },
    "zh-CN": { welcome: "欢迎", hello: "你好", world: "世界" },
};
// Set the locale once at the beginning of your app.
i18n.locale = Localization.locale;

export default function App() {
    const [greeting, setGreeting] = React.useState("");

    if (greeting) {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>{greeting}!!!</Text>
            </View>
        );
    }

    return (
        <View testID="welcome" style={styles.container}>
            <Text style={styles.text}>
                {i18n.t("welcome")} {JSON.stringify(Localization.locales)}
            </Text>
            <TouchableOpacity
                testID="hello_button"
                onPress={() => setGreeting(i18n.t("hello"))}
            >
                <Text style={styles.buttonText}>Say {i18n.t("hello")}</Text>
            </TouchableOpacity>
            <TouchableOpacity
                testID="world_button"
                onPress={() => setGreeting(i18n.t("world"))}
            >
                <Text style={styles.buttonText}>Say {i18n.t("world")}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
        fontSize: 25,
        marginBottom: 30,
    },
    buttonText: {
        color: "blue",
        marginBottom: 20,
    },
});
