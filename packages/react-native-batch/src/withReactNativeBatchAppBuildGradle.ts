import { ConfigPlugin, withAppBuildGradle } from "@expo/config-plugins";

export const pushDependencies = (contents: string): string => {
  let newContents = contents + "apply plugin: 'com.google.gms.google-services'";

  newContents = newContents.replace(
    `apply plugin: "com.android.application"`,
    `apply plugin: "com.android.application"\napply plugin: 'com.google.gms.google-services'`
  );

  const defaultConfigContents = newContents.match(
    /defaultConfig {[^{\}]+(?=})/
  );

  if (defaultConfigContents) {
    const endOfDefaultConfigIndex = newContents.indexOf(
      defaultConfigContents[0]
    );
    const start = newContents.substring(0, endOfDefaultConfigIndex);
    const end = newContents.substring(
      endOfDefaultConfigIndex + defaultConfigContents[0].length
    );

    newContents =
      start +
      defaultConfigContents[0] +
      `    resValue "string", "BATCH_API_KEY", "DEV5B322B2924C0CF63AEA9466A8CB"` +
      "\n    " +
      end;
  }

  const dependenciesString = "dependencies {";
  const dependenciesIndex = newContents.indexOf("dependencies {");

  if (dependenciesIndex > -1) {
    const index = dependenciesIndex + dependenciesString.length;
    const start = newContents.substring(0, index);
    const end = newContents.substring(index);

    newContents =
      start +
      `\n    implementation "com.google.firebase:firebase-iid:21.1.0"\n    ${'implementation "com.batch.android:batch-sdk:${rootProject.ext.batchSdkVersion}"'}` +
      end;
  }

  return newContents;
};

export const withReactNativeBatchAppBuildGradle: ConfigPlugin<{} | void> = (
  config
) => {
  return withAppBuildGradle(config, async (conf) => {
    const content = conf.modResults.contents;
    const newContents = pushDependencies(content);

    return {
      ...conf,
      modResults: {
        ...conf.modResults,
        contents: newContents,
      },
    };
  });
};
