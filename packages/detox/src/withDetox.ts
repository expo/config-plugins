import {
  ConfigPlugin,
  createRunOncePlugin,
  withPlugins,
} from "expo/config-plugins";

import withDetoxProjectGradle from "./withDetoxProjectGradle";
import withDetoxTestAppGradle from "./withDetoxTestAppGradle";
import { withDetoxTestClass } from "./withDetoxTestClass";
import withKotlinGradle from "./withKotlinGradle";
import {
  withNetworkSecurityConfigManifest,
  SubdomainsType,
} from "./withNetworkSecurityConfig";
import withProguardGradle from "./withProguardGradle";

const withDetox: ConfigPlugin<
  {
    /**
     * Disable adding proguard minification to the `app/build.gradle`.
     *
     * @default false
     */
    skipProguard?: boolean;
    /**
     * Subdomains to add to the network security config.
     * Pass `['10.0.3.2', 'localhost']` to use Genymotion emulators instead of Google emulators.
     * Pass `*` to allow all domains.
     *
     * @default ['10.0.2.2', 'localhost'] // (Google emulators)
     */
    subdomains?: SubdomainsType;
  } | void
> = (config, { skipProguard, subdomains } = {}) => {
  return withPlugins(
    config,
    [
      // 3.
      withDetoxProjectGradle,
      // 3.
      withDetoxTestAppGradle,
      // 4.
      [
        withKotlinGradle,
        // Minimum version of Kotlin required to work with expo packages in SDK 49
        // React Native 72 https://github.com/wix/Detox/blob/f26b13ebacdbb9ca2beafbc2c8b4c8ea1bbb3139/detox/android/build.gradle#L6C26-L6C32
        "1.8.22",
      ],
      // 5.
      withDetoxTestClass,
      // 6.
      [withNetworkSecurityConfigManifest, { subdomains }],
      // 7.
      !skipProguard && withProguardGradle,
    ].filter(Boolean) as ([ConfigPlugin, any] | ConfigPlugin)[]
  );
};

let pkg: { name: string; version?: string } = {
  name: "detox",
  // UNVERSIONED...
};
try {
  const detoxPkg = require("detox/package.json");
  pkg = detoxPkg;
} catch {}

export default createRunOncePlugin(withDetox, pkg.name, pkg.version);
