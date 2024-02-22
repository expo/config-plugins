import { ConfigPlugin, withStringsXml } from "expo/config-plugins";

import { MissingParamsException } from "./MissingParamsException";
import { IosParams } from "./withGoogleSigninIos";

export type AndroidParams = {
  serverClientId?: string;
};

export function setupGoogleSigninAndroid(
  string: any[],
  serverClientId?: string,
) {
  if (!serverClientId) {
    throw new MissingParamsException("serverClientId");
  }
  const serverClientIdXml = {
    $: { name: "server_client_id" },
    _: serverClientId,
  };
  return [...string, serverClientIdXml];
}

export const withGoogleSigninAndroid: ConfigPlugin<
  AndroidParams & IosParams
> = (config, { serverClientId }) => {
  return withStringsXml(config, (config) => {
    if (!config.android) {
      return config;
    }
    config.modResults.resources.string = setupGoogleSigninAndroid(
      config.modResults.resources.string ?? [],
      serverClientId,
    );
    return config;
  });
};
