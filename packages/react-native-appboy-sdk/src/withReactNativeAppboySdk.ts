import {
  ConfigPlugin,
  AndroidConfig,
  createRunOncePlugin,
  withProjectBuildGradle,
  withStringsXml,
  withInfoPlist,
} from "@expo/config-plugins";
import { withPermissions } from "@expo/config-plugins/build/android/Permissions";
import {
  createGeneratedHeaderComment,
  MergeResults,
  removeGeneratedContents,
} from "@expo/config-plugins/build/utils/generateCode";

const { buildResourceItem } = AndroidConfig.Resources;
const { setStringItem, removeStringItem } = AndroidConfig.Strings;

const STRING_COM_BRAZE_API_KEY = "com_braze_api_key";
const STRING_COM_BRAZE_CUSTOM_ENDPOINT = "com_braze_custom_endpoint";
const STRING_COM_BRAZE_FIREBASE_CLOUD_MESSAGING_SENDER_ID =
  "com_braze_firebase_cloud_messaging_sender_id";
// <bool translatable="false" name="com_braze_firebase_cloud_messaging_registration_enabled">true</bool>
// <string translatable="false" name="com_braze_firebase_cloud_messaging_sender_id">your_fcm_sender_id_here</string>

type ConfigProps = {
  apiKey: string;
  customEndpoint: string;
  fcmSenderID?: string;
};

const withAndroidAppboySdk: ConfigPlugin<ConfigProps> = (config, props) => {
  config = withProjectBuildGradle(config, (config) => {
    if (config.modResults.language === "groovy") {
      config.modResults.contents = addBrazeImport(
        config.modResults.contents
      ).contents;
    } else {
      throw new Error(
        "Cannot add camera maven gradle because the build.gradle is not groovy"
      );
    }
    return config;
  });

  config = withStringsXml(config, (config) => {
    config.modResults = applyApiKeyString(props, config.modResults);
    config.modResults = applyCustomEndpointString(props, config.modResults);
    config.modResults = applyFCMSenderID(props, config.modResults);

    return config;
  });
  config = withPermissions(config, [
    "android.permission.ACCESS_NETWORK_STATE",
    "android.permission.INTERNET",
  ]);

  return config;
};

const withIOSAppboySdk: ConfigPlugin<ConfigProps> = (config, props) => {
  config = withInfoPlist(config, (config) => {
    delete config.modResults.Braze;
    const { apiKey, customEndpoint } = props;
    if (apiKey) {
      config.modResults.Braze = {
        ApiKey: apiKey,
      };
      if (customEndpoint) {
        config.modResults.Braze.Endpoint = customEndpoint;
      }
    }

    return config;
  });
  return config;
};

function applyApiKeyString(
  props: ConfigProps,
  stringsJSON: AndroidConfig.Resources.ResourceXML
) {
  if (props.apiKey) {
    return setStringItem(
      [
        buildResourceItem({
          name: STRING_COM_BRAZE_API_KEY,
          value: props.apiKey,
        }),
      ],
      stringsJSON
    );
  }

  return removeStringItem(STRING_COM_BRAZE_API_KEY, stringsJSON);
}

function applyCustomEndpointString(
  props: ConfigProps,
  stringsJSON: AndroidConfig.Resources.ResourceXML
) {
  if (props.customEndpoint) {
    return setStringItem(
      [
        buildResourceItem({
          name: STRING_COM_BRAZE_CUSTOM_ENDPOINT,
          translatable: false,
          value: props.customEndpoint,
        }),
      ],
      stringsJSON
    );
  }

  return removeStringItem(STRING_COM_BRAZE_CUSTOM_ENDPOINT, stringsJSON);
}

function applyFCMSenderID(
  props: ConfigProps,
  stringsJSON: AndroidConfig.Resources.ResourceXML
) {
  if (props.fcmSenderID) {
    return setStringItem(
      [
        buildResourceItem({
          name: STRING_COM_BRAZE_FIREBASE_CLOUD_MESSAGING_SENDER_ID,
          translatable: false,
          value: props.fcmSenderID,
        }),
      ],
      stringsJSON
    );
  }

  return removeStringItem(STRING_COM_BRAZE_FIREBASE_CLOUD_MESSAGING_SENDER_ID, stringsJSON);
}

const gradleMaven = [
  `allprojects { repositories { maven { url "https://appboy.github.io/appboy-android-sdk/sdk" } } }`,
].join("\n");

export function addBrazeImport(src: string): MergeResults {
  return appendContents({
    tag: "react-native-appboy-sdk-import",
    src,
    newSrc: gradleMaven,
    comment: "//",
  });
}

function appendContents({
  src,
  newSrc,
  tag,
  comment,
}: {
  src: string;
  newSrc: string;
  tag: string;
  comment: string;
}): MergeResults {
  const header = createGeneratedHeaderComment(newSrc, tag, comment);
  if (!src.includes(header)) {
    // Ensure the old generated contents are removed.
    const sanitizedTarget = removeGeneratedContents(src, tag);
    const contentsToAdd = [
      // @something
      header,
      // contents
      newSrc,
      // @end
      `${comment} @generated end ${tag}`,
    ].join("\n");

    return {
      contents: sanitizedTarget ?? src + contentsToAdd,
      didMerge: true,
      didClear: !!sanitizedTarget,
    };
  }
  return { contents: src, didClear: false, didMerge: false };
}

/**
 * Apply react-native-appboy-sdk configuration for Expo SDK 42 projects.
 */
const withReactNativeAppboySdk: ConfigPlugin<ConfigProps> = (
  config,
  _props
) => {
  const props = _props || {};

  config = withAndroidAppboySdk(config, props);
  config = withIOSAppboySdk(config, props);

  return config;
};

const pkg = {
  // Prevent this plugin from being run more than once.
  // This pattern enables users to safely migrate off of this
  // out-of-tree `@config-plugins/react-native-appboy-sdk` to a future
  // upstream plugin in `react-native-appboy-sdk`
  name: "react-native-appboy-sdk",
  // Indicates that this plugin is dangerously linked to a module,
  // and might not work with the latest version of that module.
  version: "UNVERSIONED",
};

export default createRunOncePlugin(
  withReactNativeAppboySdk,
  pkg.name,
  pkg.version
);
