import { ConfigPlugin, withInfoPlist } from "expo/config-plugins";

import { MissingParamsException } from "./MissingParamsException";

export type IosParams = {
  iosClientId?: string;
  iosUrlScheme?: string;
};

export const withGoogleSigninIos: ConfigPlugin<IosParams> = (
  config,
  { iosClientId, iosUrlScheme },
) => {
  return withInfoPlist(config, (config) => {
    if (!config.ios) {
      return config;
    }

    if (!iosClientId) {
      throw new MissingParamsException("iosClientId");
    }

    if (!iosUrlScheme) {
      throw new MissingParamsException("iosUrlScheme");
    }

    if (!config.ios?.infoPlist) config.ios.infoPlist = [];

    config.ios.infoPlist["GIDClientID"] = iosClientId;
    config.ios.infoPlist["CFBundleURLTypes"].push({
      CFBundleURLSchemes: [iosUrlScheme],
    });
    return config;
  });
};
