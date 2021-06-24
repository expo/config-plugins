import {
  AndroidConfig,
  ConfigPlugin,
  withAndroidManifest,
  withAppBuildGradle,
  withDangerousMod,
} from "@expo/config-plugins";
import { mergeContents } from "@expo/config-plugins/build/utils/generateCode";
import fs from "fs";

const { addMetaDataItemToMainApplication, getMainApplicationOrThrow } =
  AndroidConfig.Manifest;

const META_PROVIDER_CLASS =
  "com.google.android.gms.cast.framework.OPTIONS_PROVIDER_CLASS_NAME";
const META_RECEIVER_APP_ID =
  "com.reactnative.googlecast.RECEIVER_APPLICATION_ID";

type Props = {
  receiverAppId?: string;
};

const CUSTOM_ACTIVITY =
  "com.reactnative.googlecast.RNGCExpandedControllerActivity";

async function ensureCustomActivityAsync({
  mainApplication,
}: {
  mainApplication: AndroidConfig.Manifest.ManifestApplication;
}) {
  if (Array.isArray(mainApplication.activity)) {
    // Remove all activities matching the custom name
    mainApplication.activity = mainApplication.activity.filter((activity) => {
      return activity.$?.["android:name"] !== CUSTOM_ACTIVITY;
    });
  } else {
    mainApplication.activity = [];
  }

  // `<activity android:name="${CUSTOM_ACTIVITY}" />`
  mainApplication.activity.push({
    $: {
      "android:name": CUSTOM_ACTIVITY,
    },
  });
  return mainApplication;
}

const withAndroidManifestCast: ConfigPlugin<Props> = (
  config,
  { receiverAppId } = {}
) => {
  return withAndroidManifest(config, async (config) => {
    const mainApplication = getMainApplicationOrThrow(config.modResults);

    ensureCustomActivityAsync({ mainApplication });

    addMetaDataItemToMainApplication(
      mainApplication,
      META_PROVIDER_CLASS,
      // This is the native Java class
      "com.reactnative.googlecast.GoogleCastOptionsProvider"
    );
    if (receiverAppId) {
      addMetaDataItemToMainApplication(
        mainApplication,
        META_RECEIVER_APP_ID,
        receiverAppId
      );
    }
    return config;
  });
};

const withAppBuildGradleImport: ConfigPlugin<{ version?: string }> = (
  config,
  { version }
) => {
  return withAppBuildGradle(config, (config) => {
    if (config.modResults.language !== "groovy")
      throw new Error(
        "react-native-google-cast config plugin does not support Kotlin app/build.gradle yet."
      );
    config.modResults.contents = addGoogleCastImport(
      config.modResults.contents,
      {
        version,
      }
    ).contents;

    return config;
  });
};

const withMainActivityLazyLoading: ConfigPlugin = (config) => {
  return withDangerousMod(config, [
    "android",
    async (config) => {
      const file = await AndroidConfig.Paths.getMainActivityAsync(
        config.modRequest.projectRoot
      );
      if (file.language === "java") {
        let src = AndroidConfig.UserInterfaceStyle.addJavaImports(
          file.contents,
          ["com.google.android.gms.cast.framework.CastContext"],
          true
        );

        src = addGoogleCastLazyLoadingImport(src).contents;
        await fs.promises.writeFile(file.path, src, "utf-8");
      } else {
        throw new Error(
          "react-native-google-cast config plugin does not support kotlin MainActivity yet."
        );
      }
      return config;
    },
  ]);
};

export const withAndroidGoogleCast: ConfigPlugin<{
  /**
   * @default '+'
   */
  androidPlayServicesCastFrameworkVersion?: string;

  /**
   * ??
   */
  receiverAppId?: string;
}> = (config, props) => {
  config = withAndroidManifestCast(config, {
    receiverAppId: props.receiverAppId,
  });
  config = withMainActivityLazyLoading(config);
  config = withAppBuildGradleImport(config, {
    // gradle dep version
    version: props.androidPlayServicesCastFrameworkVersion ?? "+",
  });

  return config;
};

function addGoogleCastLazyLoadingImport(src: string) {
  const newSrc = [];
  newSrc.push("    CastContext.getSharedInstance(this);");

  return mergeContents({
    tag: "react-native-google-cast-onCreate",
    src,
    newSrc: newSrc.join("\n"),
    anchor: /super\.onCreate\(\w+\);/,
    offset: 1,
    comment: "//",
  });
}

// TODO: Add this ability to autolinking
// dependencies { implementation "com.google.android.gms:play-services-cast-framework:+" }
function addGoogleCastImport(
  src: string,
  { version }: { version?: string } = {}
) {
  const newSrc = [];
  newSrc.push(
    `    implementation "com.google.android.gms:play-services-cast-framework:${
      version || "+"
    }"`
  );

  return mergeContents({
    tag: "react-native-google-cast-dependencies",
    src,
    newSrc: newSrc.join("\n"),
    anchor: /dependencies(?:\s+)?\{/,
    offset: 1,
    comment: "//",
  });
}
