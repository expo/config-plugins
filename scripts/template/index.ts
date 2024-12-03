import { ConfigPlugin, createRunOncePlugin } from "expo/config-plugins";

/**
 * Apply %NPM_MODULE% configuration for Expo SDK %SDK_VERSION% projects.
 */
const _MODULE_NAME_: ConfigPlugin<{} | void> = (config, _props = {}) => {
  // Support passing no props to the plugin.
  const props = _props || {};

  // Return the modified config.
  return config;
};

const pkg = {
  // Prevent this plugin from being run more than once.
  // This pattern enables users to safely migrate off of this
  // out-of-tree `@config-plugins/%CONFIG_PLUGIN%` to a future
  // upstream plugin in `%NPM_MODULE%`
  name: "%NPM_MODULE%",
  // Indicates that this plugin is dangerously linked to a module,
  // and might not work with the latest version of that module.
  version: "UNVERSIONED",
};

export default createRunOncePlugin(_MODULE_NAME_, pkg.name, pkg.version);
