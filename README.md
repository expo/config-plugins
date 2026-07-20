# Expo Config Plugins

This repository is a collection of assorted [Expo config plugins](https://docs.expo.dev/guides/config-plugins/) for configuring the `npx expo prebuild` command. It is meant to be a temporary home for packages that don't have a built-in Config Plugin.

- **We prefer packages to ship their own Expo config plugin**. This helps ensure that plugin and package versions are always aligned, and that new features are made available in both the package and plugin simultaneously. If packages haven't adopted config plugins yet, the community can add a package here as a temporary home.

- **All packages here are community maintained.** They are not maintained by Expo. Feel free to improve docs, packages, tests, etc.

- **We maintain a one-to-one mapping between native packages and `@config-plugins/*`**. This means there should be no general utility packages here — those are better suited for a different repository or npm namespace.


## Expo SDK compatibility

Each plugin documents its own version mapping in its package README. Use those tables when pinning versions — mismatched Expo SDK and `@config-plugins/*` majors are a common cause of prebuild/native build failures.

**Latest published major for Expo SDK 56** (see each package README for full history and matching upstream library versions):

| Package | `@config-plugins/*` (SDK 56) |
| --- | --- |
| [`apple-settings`](./packages/apple-settings/README.md) | ^8.0.0 |
| [`ios-stickers`](./packages/ios-stickers/README.md) | 14.0.0 |
| [`react-native-adjust`](./packages/react-native-adjust/README.md) | 14.0.0 |
| [`react-native-blob-util`](./packages/react-native-blob-util/README.md) | 14.0.0 |
| [`react-native-branch`](./packages/react-native-branch/README.md) | 13.0.0 |
| [`react-native-callkeep`](./packages/react-native-callkeep/README.md) | 14.0.0 |
| [`react-native-pdf`](./packages/react-native-pdf/README.md) | 14.0.0 |
| [`react-native-siri-shortcut`](./packages/react-native-siri-shortcut/README.md) | 13.0.0 |
| [`react-native-webrtc`](./packages/react-native-webrtc/README.md) | 15.0.0 |

When upgrading Expo SDK, bump the matching `@config-plugins/*` major from the package README (and the upstream native library version listed there) before running `npx expo prebuild`.

## Looking for other config plugins?

Many React Native libraries ship their own built-in config plugins. You can find them on the [React Native Directory](https://reactnative.directory/).

## Contributing!

See the [contributing guide](/CONTRIBUTING.md).
