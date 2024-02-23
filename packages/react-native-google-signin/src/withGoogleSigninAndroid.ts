import {
  ConfigPlugin,
  ExportedConfigWithProps,
  withStringsXml,
} from "expo/config-plugins";

import { MissingParamsException } from "./MissingParamsException";
import { IosParams } from "./withGoogleSigninIos";

export type AndroidParams = {
  serverClientId?: string;
};

export function setupGoogleSigninAndroid(
  config: ExportedConfigWithProps,
  { serverClientId }: AndroidParams,
) {
  if (!config.android) {
    return config;
  }

  if (!serverClientId) {
    throw new MissingParamsException("serverClientId");
  }

  const string = config.modResults.resources.string ?? [];
  string.push({
    $: { name: "server_client_id" },
    _: serverClientId,
  });
  config.modResults.resources.string = string;

  return config;
}

export const withGoogleSigninAndroid: ConfigPlugin<
  AndroidParams & IosParams
> = (config, params) => {
  return withStringsXml(config, (config) =>
    setupGoogleSigninAndroid(config, params),
  );
};
