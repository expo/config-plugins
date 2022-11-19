import {
  ConfigPlugin,
  createRunOncePlugin,
  withPlugins,
} from "@expo/config-plugins";

import withDetoxProjectGradle from "./withDetoxProjectGradle";
import withDetoxTestAppGradle from "./withDetoxTestAppGradle";
import withDetoxTestClass from "./withDetoxTestClass";
import withJUnitRunnerClass from "./withJUnitRunnerClass";
import withKotlinGradle from "./withKotlinGradle";
import {
  withNetworkSecurityConfigManifest,
  SubdomainsType,
} from "./withNetworkSecurityConfig";
import withProguardGradle from "./withProguardGradle";
import withTestButlerProbe from "./withTestButlerProbe";

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
    /**
     * Enable Test Butler library injection in `app/build.grade` and modifications to JUnit test runner
     *
     * @default false
     */
    includeTestButler?: boolean;
  } | void
> = (config, { skipProguard, subdomains, includeTestButler } = {}) => {
  return withPlugins(
    config,
    [
      // 3.
      withDetoxProjectGradle,
      // 3.
      withDetoxTestAppGradle(includeTestButler),
      // 4.
      [
        withKotlinGradle,
        // Minimum version of Kotlin required to work with expo packages in SDK 45
        "1.6.10",
      ],
      // 5.
      withDetoxTestClass(includeTestButler),
      // 6.
      [withNetworkSecurityConfigManifest, { subdomains }],
      // 7.
      !skipProguard && withProguardGradle,
      includeTestButler && withTestButlerProbe,
      includeTestButler && withJUnitRunnerClass,
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
