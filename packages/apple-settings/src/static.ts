import { ConfigPlugin, withPlugins } from "@expo/config-plugins";

import { createModSetForSettingsPage } from "./base-mods/withSettingsPlist";
import { createModSetForSettingsStrings } from "./base-mods/withSettingsStrings";
import { withXcodeProjectBetaBaseMod } from "./base-mods/withXcparse";
import { SettingsPlist } from "./schema/SettingsPlist";
import { withLinkedSettingsBundle } from "./withLinkedSettingsBundle";

/**
 * Locale codes used in `lproj` directories for Apple software.
 * **Related:**
 * - [Swift locale interpretation routine](https://github.com/apple/swift-corelibs-foundation/blob/main/CoreFoundation/PlugIn.subproj/CFBundle_Locale.c)
 * - [Preferences doc](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/UserDefaults/Preferences/Preferences.html#//apple_ref/doc/uid/10000059i-CH6-SW9)
 */
export type AppleLocale =
  | "ar"
  | "ca"
  | "zh_Hans"
  | "zh_Hant"
  | "zh_HK"
  | "hr"
  | "cs"
  | "da"
  | "nl"
  | "en"
  | "en_GB"
  | "en_AU"
  | "en_CA"
  | "en_IN"
  | "en_IE"
  | "en_NZ"
  | "en_SG"
  | "en_ZA"
  | "fi"
  | "fr"
  | "fr_CA"
  | "de"
  | "el"
  | "he"
  | "hi"
  | "hu"
  | "id"
  | "it"
  | "ja"
  | "ko"
  | "ms"
  | "nb"
  | "pl"
  | "pt"
  | "pt_BR"
  | "ro"
  | "ru"
  | "sk"
  | "es"
  | "es_419"
  | "es_MX"
  | "sv"
  | "th"
  | "tr"
  | "uk"
  | "vi";

export type StaticSettings = Record<
  /** Name of the file / bundle. */
  string,
  {
    /** Plist contents */
    page: SettingsPlist;
    /** Linked locales that will be written as a `*.strings` file (without comments). */
    locales?: Record<
      /** Apple locale code. */
      AppleLocale,
      /** Strings content with key/value. */
      Record<string, string>
    >;
  }
>;

export const withStaticSettings: ConfigPlugin<
  Record<
    string,
    { page: SettingsPlist; locales?: Record<string, Record<string, string>> }
  >
> = (config, panes) => {
  if (!panes || !("Root" in panes)) {
    throw new Error("Panes must include a 'Root' pane");
  }

  const postMods: any[] = [];

  Object.entries(panes).map(([key, pane]) => {
    const mods = createModSetForSettingsPage({
      // e.g. "Root"
      name: key,
    });

    const locales = pane.locales || {};

    if (Object.keys(locales).length) {
      const name = pane.page.StringsTable ?? key;
      pane.page.StringsTable = name;

      Object.entries(locales).map(([lang, strings]) => {
        const stringsMods = createModSetForSettingsStrings({
          name,
          lang,
        });

        stringsMods.withStrings(config, (config) => {
          config.modResults = strings;

          return config;
        });

        postMods.push(stringsMods.withBaseMod);
      });
    } else {
      // Allow using the default strings table.
      //   delete pane.page.StringsTable;
    }

    config = mods.withSettingsPlist(config, (config) => {
      config.modResults = pane.page;

      return config;
    });

    postMods.push(mods.withBaseMod);
  });

  // Link Settings.bundle to the Xcode project.
  withLinkedSettingsBundle(config);

  // These must be last...
  withXcodeProjectBetaBaseMod(config);

  return withPlugins(config, postMods);
};

export default withStaticSettings;
