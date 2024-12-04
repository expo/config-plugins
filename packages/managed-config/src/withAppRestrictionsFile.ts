import {
  ConfigPlugin,
  withAndroidManifest,
  withDangerousMod,
  AndroidConfig,
} from "@expo/config-plugins";
import fs from "fs";
import path from "path";

import { AppRestriction } from "./appRestrictionTypes";
import { generateAppRestrictionsContent } from "./generateAppRestrictionsContent";

const appRestrictionsFileNameRoot = "app_restrictions";
const appRestrictionsFileExtension = "xml";
const appRestrictionsFileName = `${appRestrictionsFileNameRoot}.${appRestrictionsFileExtension}`;

const withAppRestrictionsConfigFile: ConfigPlugin<{
  restrictions: AppRestriction[];
}> = (config, { restrictions }) => {
  return withDangerousMod(config, [
    "android",
    (config) => {
      const folder = path.join(
        config.modRequest.platformProjectRoot,
        `app/src/main/res/xml`
      );
      fs.mkdirSync(folder, { recursive: true });
      fs.writeFileSync(
        path.join(folder, appRestrictionsFileName),
        generateAppRestrictionsContent(restrictions),
        {
          encoding: "utf8",
        }
      );
      return config;
    },
  ]);
};

export const withAppRestrictions: ConfigPlugin<{
  restrictions: AppRestriction[];
}> = (config, props) => {
  if (
    typeof props.restrictions === "object" &&
    props.restrictions.length === 0
  ) {
    // if restrictions is an empty array, skip...
    return config;
  }

  config = withAppRestrictionsConfigFile(config, props);
  return withAndroidManifest(config, (config) => {
    const application = AndroidConfig.Manifest.getMainApplicationOrThrow(
      config.modResults
    );
    application["meta-data"] = application["meta-data"] || [];
    application["meta-data"].push({
      $: {
        "android:name": "android.content.APP_RESTRICTIONS",
        "android:resource": `@xml/${appRestrictionsFileNameRoot}`,
      },
    });
    return config;
  });
};
