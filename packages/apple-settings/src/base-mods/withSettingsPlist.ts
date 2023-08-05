import * as plist from "@expo/plist";
import {
  BaseMods,
  ConfigPlugin,
  createRunOncePlugin,
  Mod,
  withMod,
} from "expo/config-plugins";
import * as fs from "fs";
import path from "path";
import { validate } from "schema-utils";

import { SettingsPlist } from "../schema/SettingsPlist";
import schema from "../schema/SettingsPlist.json";

export function createModSetForSettingsPage({ name }: { name: string }) {
  const customModName = "settings" + name + "Plist";

  const withSettingsPlist: ConfigPlugin<Mod<SettingsPlist>> = (
    config,
    action
  ) => {
    return withMod(config, {
      platform: "ios",
      mod: customModName,
      action,
    });
  };

  const withBaseModInternal: ConfigPlugin = (config) => {
    return BaseMods.withGeneratedBaseMods(config, {
      platform: "ios",
      saveToInternal: true,
      skipEmptyMod: false,
      providers: {
        [customModName]: BaseMods.provider<SettingsPlist>({
          isIntrospective: true,

          async getFilePath({ modRequest }) {
            return path.join(
              modRequest.platformProjectRoot,
              modRequest.projectName!,
              `Settings.bundle/${name}.plist`
            );
          },
          async read(filePath) {
            try {
              if (fs.existsSync(filePath) === false) {
                return {
                  PreferenceSpecifiers: [],
                };
              }
              return plist.default.parse(
                await fs.promises.readFile(filePath, "utf-8")
              );
            } catch (error: any) {
              throw new Error(
                `Failed to parse the iOS Settings.bundle/${name}.plist: "${filePath}". ${error.message}}`
              );
            }
          },
          async write(filePath, { modResults, modRequest: { introspect } }) {
            // Perform strict validation.
            validate(schema as any, modResults);

            if (introspect) {
              return;
            }
            const contents = plist.default.build(modResults);
            // Ensure Settings.bundle
            await fs.promises.mkdir(path.dirname(filePath), {
              recursive: true,
            });
            await fs.promises.writeFile(filePath, contents);
          },
        }),
      },
    });
  };

  const baseName = `withAppleSettings${name}PlistBaseMod`;

  return {
    withSettingsPlist,
    withBaseMod: createRunOncePlugin(withBaseModInternal, baseName),
  };
}
