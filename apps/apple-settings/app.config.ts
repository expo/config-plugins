import withAppleSettings, {
  ChildPane,
  Group,
  RadioGroup,
  Slider,
  Switch,
  TextField,
  Title,
} from "@config-plugins/apple-settings";
import { ConfigContext, ExpoConfig } from "expo/config";
import path from "node:path";

const folderName = path.basename(__dirname);
const cleanName = folderName.replace(/[_\s-]/g, "");
const appId = "dev.bacon." + cleanName;

function withWhiteLabel(config: Partial<ExpoConfig>) {
  if (!config.extra) config.extra = {};
  // Expose CI env variables to the app
  config.extra.CI = process.env.CI;

  if (!config.ios) config.ios = {};
  config.ios.bundleIdentifier = appId;
  if (!config.android) config.android = {};
  config.android.package = appId;

  return config;
}

module.exports = ({ config }: ConfigContext): Partial<ExpoConfig> => {
  config = withWhiteLabel(config);

  config = withAppleSettings(config as ExpoConfig, {
    // The name of the .plist file to generate. Root is the default and must be provided.
    Root: {
      // The locales object is optional. If provided, it will be used to generate the localized .strings files.
      locales: {
        // The Apple locale code. This will be used to generate the .strings file.
        en: {
          // Name of the localized key.
          Name: "Text Field",
        },
      },
      // The page object is required. It will be used to generate the .plist file.
      // The contents will be converted directly to plist.
      page: {
        // The `PreferenceSpecifiers` defines the UI elements to generate.
        PreferenceSpecifiers: [
          Title({
            title: "Title",
            value: "Default Title",
            key: "title_preference",
          }),
          // Helper models can be used to generate the UI elements using a syntax that's
          // similar to React Native.
          TextField({
            title: "Name",
            key: "name_preference",
            value: "",
            keyboardType: "Alphabet",
            autoCapitalize: "None",
            autoCorrect: "No",
          }),
          Switch({
            title: "Enabled",
            key: "enabled_preference",
            value: true,
          }),
          Slider({
            key: "slider_preference",
            value: 0.5,
          }),
          RadioGroup({
            value: "option1",
            key: "radio_preference",
            items: [
              {
                title: "Option 1",
                value: "option1",
              },

              {
                title: "Option 2",
                value: "option2",
              },
            ],
          }),
          // Child panes can be used to create nested pages.
          ChildPane({
            title: "About",
          }),
        ],
      },
    },
    // About page
    About: {
      page: {
        PreferenceSpecifiers: [
          Group({
            title: "About Info",
          }),
        ],
      },
    },
  });

  return config;
};
