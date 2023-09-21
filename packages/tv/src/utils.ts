import { boolish } from "getenv";

import { ConfigData } from "./types";

class Env {
  /** Enable prebuild for TV */
  get EXPO_TV() {
    return boolish("EXPO_TV", false);
  }
}

const env = new Env();

export function isTVEnabled(params: ConfigData): boolean {
  return env.EXPO_TV || (params?.isTV ?? false);
}

export function showVerboseWarnings(params: ConfigData): boolean {
  return params?.showVerboseWarnings ?? false;
}
