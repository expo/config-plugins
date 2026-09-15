# Changelog

## Unreleased

- Fix: read the installed `expo` package version to gate SDK support, instead of `config.sdkVersion` (which `@expo/config` always resolves to `<major>.0.0`, so the previous `>=57.0.23` check rejected every install).
- Fix: enabling/disabling the plugin now removes/restores the whole `#if os(iOS) || os(tvOS)` / `#endif` guard around the legacy window/`startReactNative` block, instead of only the lines inside it — the previous version left `#if os(iOS) || os(tvOS)#endif` glued onto one line, which fails to compile.

## 0.1.0

Initial experimental release for Expo SDK 57 UIKit scene lifecycle compatibility on Xcode 27.
