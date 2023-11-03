import { ResourceXML } from "@expo/config-plugins/build/android/Resources";
import {
  AndroidConfig,
  ConfigPlugin,
  withStringsXml,
} from "expo/config-plugins";

import { PluginConfigType } from "../pluginConfig";

/** Helper to add string.xml JSON items or overwrite existing items with the same name. */
function setStrings(strings: ResourceXML, name: string, value: string) {
  return AndroidConfig.Strings.setStringItem(
    [
      // XML represented as JSON
      // <string moduleConfig="true" name="">value</string>
      { $: { name }, _: value },
    ],
    strings
  );
}

/**
 * Update `<project>/app/src/main/res/values/strings.xml` by adding react-native-code-push deployment key
 */
export const withAndroidStringsDependency: ConfigPlugin<PluginConfigType> = (
  config,
  props
) => {
  return withStringsXml(config, (xmlProps) => {
    xmlProps.modResults = setStrings(
      xmlProps.modResults,
      "CodePushDeploymentKey",
      props.android.CodePushDeploymentKey
    );

    /** This prop is optional */
    if (props.android.CodePushPublicKey) {
      xmlProps.modResults = setStrings(
        xmlProps.modResults,
        "CodePushPublicKey",
        props.android.CodePushPublicKey
      );
    }

    return xmlProps;
  });
};
