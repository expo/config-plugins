import React from "react";
import { Button, Settings, StyleSheet, Text, View, Switch } from "react-native";

function useSetting(key: string) {
  const [value, setValue] = React.useState(() => Settings.get(key));
  React.useEffect(() => {
    let isMounted = true;
    const callback = Settings.watchKeys(key, () => {
      if (isMounted) {
        setValue(Settings.get(key));
      }
    });
    return () => {
      Settings.clearWatch(callback);
      isMounted = false;
    };
  }, [key]);

  return [
    value,
    (value) => {
      Settings.set({ [key]: value });
      setValue(value);
    },
  ];
}

const App = () => {
  const [data, setData] = useSetting("name_preference");

  return (
    <View style={styles.container}>
      <Text>Stored value:</Text>
      <Text style={styles.value}>{data}</Text>
      {/* <Switch value={data} onValueChange={setData} /> */}
      <Button
        onPress={() => {
          setData("Updated: " + Date.now());
        }}
        title="Update Setting"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  value: {
    fontSize: 24,
    marginVertical: 12,
  },
});

export default App;
