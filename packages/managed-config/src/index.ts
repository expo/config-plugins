import { ConfigPlugin } from "@expo/config-plugins";

import { AppRestriction } from "./appRestrictionTypes";
import { withAppRestrictions } from "./withAppRestrictionsFile";

export type WithEMMConfig = {
  restrictions: AppRestriction[];
};

const withEmm: ConfigPlugin<WithEMMConfig> = (config, { restrictions }) => {
  config = withAppRestrictions(config, { restrictions });

  return config;
};

export default withEmm;
