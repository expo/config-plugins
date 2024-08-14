import {
  ConfigPlugin,
  withAndroidManifest,
  AndroidManifest,
  withDangerousMod,
  AndroidConfig,
} from "expo/config-plugins";
import * as fs from "fs";
import * as path from "path";

type SupportedLanguages = string[];

export const withAndroidPerAppLanguage: ConfigPlugin<{
  supportedLanguages: SupportedLanguages;
}> = (config, { supportedLanguages }) => {
  if (!supportedLanguages || !supportedLanguages.length) {
    return config;
  }

  /**
   * Modify the Android Manifest 'application' to include the localeConfig attribute
   */
  config = withAndroidManifest(config, (config) => {
    config.modResults = addLocaleConfigToManifest(config.modResults);
    return config;
  });

  /**
   * Create `network_security_config.xml` resource file.
   */
  return withDangerousMod(config, [
    "android",
    async (config) => {
      const folder = path.join(
        config.modRequest.platformProjectRoot,
        `app/src/main/res/xml`,
      );
      fs.mkdirSync(folder, { recursive: true });
      fs.writeFileSync(
        path.join(folder, "locales_config.xml"),
        getTemplateFile(supportedLanguages),
        { encoding: "utf8" },
      );
      return config;
    },
  ]);
};

export const addLocaleConfigToManifest = (androidManifest: AndroidManifest) => {
  const application =
    AndroidConfig.Manifest.getMainApplicationOrThrow(androidManifest);

  application.$["android:localeConfig"] = "@xml/locales_config";
  return androidManifest;
};

export const getTemplateFile = (supportedLanguages: SupportedLanguages) => {
  const localesList = supportedLanguages
    .map((lang) => `   <locale android:name="${lang}"/>`)
    .join("\n");

  const content = `<?xml version="1.0" encoding="utf-8"?>
<locale-config xmlns:android="http://schemas.android.com/apk/res/android">
${localesList}
</locale-config>`;
  return content;
};
