import {
  ConfigPlugin,
  withInfoPlist,
  createRunOncePlugin,
} from "@expo/config-plugins";

let pkg: { name: string; version?: string } = {
  name: "react-native-razorpay",
};

try {
  pkg = require("react-native-razorpay/package.json");
} catch {
  // empty catch block
}

type TPaymentApps = "tez" | "phonepe" | "paytmmp";

/**
 * Add UPI Intent apps on iOS
 */
const withReactNativeRazorpay: ConfigPlugin<{ paymentApps: TPaymentApps[] }> = (
  config,
  { paymentApps }
) => {
  return withInfoPlist(config, (cfg) => {
    if (!paymentApps.length) {
      cfg.modResults.LSApplicationQueriesSchemes = [];
      return cfg;
    }

    cfg.modResults.LSApplicationQueriesSchemes = paymentApps;
    return cfg;
  });
};

export default createRunOncePlugin(
  withReactNativeRazorpay,
  pkg.name,
  pkg.version
);
