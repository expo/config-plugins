import { ConfigPlugin, withProjectBuildGradle } from "@expo/config-plugins";

export const modifyBuildScript = (contents: string): string => {
  let newContents = contents;

  const extRegex = "ext {";
  const extIndex = newContents.indexOf(extRegex);
  const extStartIndex = extIndex + extRegex.length;

  newContents =
    newContents.substring(0, extStartIndex) +
    `\nbatchSdkVersion = '1.17+'` +
    newContents.substring(extStartIndex);

  const dependenciesRegex = "dependencies {";
  const dependenciesIndex = newContents.indexOf(dependenciesRegex);
  const dependenciesStartIndex = dependenciesIndex + dependenciesRegex.length;

  newContents =
    newContents.substring(0, dependenciesStartIndex) +
    `\n        classpath("com.google.gms:google-services:4.3.10")` +
    newContents.substring(dependenciesStartIndex);

  return newContents;
};

export const withReactNativeBatchProjectBuildGradle: ConfigPlugin<{} | void> = (
  config
) => {
  return withProjectBuildGradle(config, async (conf) => {
    const content = conf.modResults.contents;
    const newContents = modifyBuildScript(content);

    return {
      ...conf,
      modResults: {
        ...conf.modResults,
        contents: newContents,
      },
    };
  });
};
