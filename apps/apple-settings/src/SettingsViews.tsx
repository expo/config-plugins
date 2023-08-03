import React from "react";
import { Settings, Switch, TextInput } from "react-native";

export function useSetting<T = string>(key: string): [T, (value: T) => void] {
  const [value, setValue] = React.useState<T>(() => Settings.get(key));
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

export function SettingsSwitch({
  settingsKey,
  ...props
}: { settingsKey: string } & Omit<
  React.ComponentProps<typeof Switch>,
  "value" | "onValueChange"
>) {
  const [value, setValue] = useSetting<boolean>(settingsKey);
  return <Switch {...props} value={!!value} onValueChange={setValue} />;
}

export function SettingsTextInput({
  settingsKey,
  ...props
}: { settingsKey: string } & Omit<
  React.ComponentProps<typeof TextInput>,
  "value" | "onChangeText"
>) {
  const [value, setValue] = useSetting<string>(settingsKey);
  return <TextInput {...props} value={value} onChangeText={setValue} />;
}
