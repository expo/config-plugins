import {
  ConfigPlugin,
  ExportedConfigWithProps,
  InfoPlist,
  withInfoPlist,
} from "expo/config-plugins";

import { MissingParamsException } from "./MissingParamsException";

export type IosParams = {
  iosClientId?: string;
  iosUrlScheme?: string;
};

export function setupGoogleSigninIos(
  config: ExportedConfigWithProps<InfoPlist>,
  { iosClientId, iosUrlScheme }: IosParams,
) {
  if (!config.ios) {
    return config;
  }
  if (!iosClientId) {
    throw new MissingParamsException("iosClientId");
  }

  if (!iosUrlScheme) {
    throw new MissingParamsException("iosUrlScheme");
  }

  if (!config.ios?.infoPlist) config.ios.infoPlist = {};

  config.ios.infoPlist["GIDClientID"] = iosClientId;
  config.ios.infoPlist["CFBundleURLTypes"] =
    config.ios.infoPlist["CFBundleURLTypes"] ?? [];
  config.ios.infoPlist["CFBundleURLTypes"].push({
    CFBundleURLSchemes: [iosUrlScheme],
  });

  return config;
}

export const withGoogleSigninIos: ConfigPlugin<IosParams> = (
  config,
  params,
) => {
  return withInfoPlist(config, (config) =>
    setupGoogleSigninIos(config, params),
  );
};
