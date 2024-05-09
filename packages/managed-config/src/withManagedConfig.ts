import {
  ConfigPlugin,
  createRunOncePlugin,
  withDangerousMod,
  withAndroidManifest,
  AndroidConfig,
} from "@expo/config-plugins";
import fs from "fs";
import path from "path";

import { AppRestriction } from "./appRestrictionTypes";
import {
  AppRestrictionsFileName,
  AppRestrictionsFileNameRoot,
} from "./constants";
import { generateAppRestrictionsContent } from "./generateAppRestrictionsContent";

const pkg = {
  // Prevent this plugin from being run more than once.
  // This pattern enables users to safely migrate off of this
  // out-of-tree `@config-plugins/managed-config` to a future
  // upstream plugin in `managed-config`
  name: "managed-config",
  // Indicates that this plugin is dangerously linked to a module,
  // and might not work with the latest version of that module.
  version: "UNVERSIONED",
};

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
        path.join(folder, AppRestrictionsFileName),
        generateAppRestrictionsContent(restrictions),
        {
          encoding: "utf8",
        }
      );
      return config;
    },
  ]);
};

const withManagedConfig: ConfigPlugin<{
  restrictions: AppRestriction[];
}> = (config, props) => {
  if (
    typeof props.restrictions === "object" &&
    props.restrictions.length === 0
  ) {
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
        "android:resource": `@xml/${AppRestrictionsFileNameRoot}`,
      },
    });
    return config;
  });
};

export default createRunOncePlugin(withManagedConfig, pkg.name, pkg.version);
