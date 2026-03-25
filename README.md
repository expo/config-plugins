# Expo Config Plugins

This repository is a collection of assorted [Expo config plugins](https://docs.expo.dev/guides/config-plugins/) for configuring the `npx expo prebuild` command. It is meant to be a temporary home for packages that don't have a built-in Config Plugin.

- **We prefer packages to ship their own Expo config plugin**. This helps ensure that plugin and package versions are always aligned, and that new features are made available in both the package and plugin simultaneously. If packages haven't adopted config plugins yet, the community can add a package here as a temporary home.

- **All packages here are community maintained.** They are not maintained by Expo. Feel free to improve docs, packages, tests, etc.

- **We maintain a one-to-one mapping between native packages and `@config-plugins/*`**. This means there should be no general utility packages here — those are better suited for a different repository or npm namespace.

## Looking for other config plugins?

Many React Native libraries ship their own built-in config plugins. You can find them on the [React Native Directory](https://reactnative.directory/).

## Contributing!

See the [contributing guide](/CONTRIBUTING.md).
