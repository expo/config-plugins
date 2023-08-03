import {
  BaseMods,
  ConfigPlugin,
  createRunOncePlugin,
  Mod,
  withMod,
} from "expo/config-plugins";
import * as fs from "fs";
import path from "path";

import * as strings from "./strings";

export type SettingsStrings = Record<string, string>;

export function createModSetForSettingsStrings({
  name,
  lang = "en",
}: {
  /** Like `Root` */
  name: string;
  /** Like `en` */
  lang?: string;
}) {
  const customModName = "settings" + lang + "_" + name + "Strings";

  const withBaseModInternal: ConfigPlugin = (config) => {
    return BaseMods.withGeneratedBaseMods(config, {
      platform: "ios",
      saveToInternal: true,
      skipEmptyMod: false,
      providers: {
        [customModName]: BaseMods.provider<SettingsStrings>({
          isIntrospective: true,
          async getFilePath({ modRequest }) {
            return path.join(
              modRequest.platformProjectRoot,
              modRequest.projectName!,
              `Settings.bundle/${lang}.lproj/${name}.strings`
            );
          },
          async read(filePath) {
            try {
              if (fs.existsSync(filePath) === false) {
                return {};
              }
              return strings.openAsync(filePath, false) as unknown as Record<
                string,
                string
              >;
            } catch (error: any) {
              throw new Error(
                `Failed to parse the Settings.bundle/${lang}.lproj/${name}.strings: "${filePath}". ${error.message}}`
              );
            }
          },
          async write(filePath, { modResults, modRequest: { introspect } }) {
            if (introspect) {
              return;
            }
            // Ensure Settings.bundle/en.lproj
            await fs.promises.mkdir(path.dirname(filePath), {
              recursive: true,
            });
            await strings.writeAsync(filePath, modResults);
          },
        }),
      },
    });
  };

  const withStrings: ConfigPlugin<Mod<SettingsStrings>> = (config, action) => {
    return withMod(config, {
      platform: "ios",
      mod: customModName,
      action,
    });
  };

  const baseName = `withAppleSettings${lang}_${name}StringsBaseMod`;

  return {
    withStrings,
    withBaseMod: createRunOncePlugin(withBaseModInternal, baseName),
  };
}
