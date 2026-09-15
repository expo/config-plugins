# @config-plugins/expo-uiscene-lifecycle

> Experimental SDK 57 compatibility plugin for Xcode 27's UIKit scene lifecycle requirements.

This plugin is opt-in. Install it only for Expo SDK 57 iOS apps that build with Xcode 27 and need UIKit scene lifecycle support. SDK 58 and newer include the native lifecycle support and are deliberately rejected by this plugin.

## Installation

```sh
npx expo install @config-plugins/expo-uiscene-lifecycle
```

Add the plugin to the Expo configuration:

```json
{
  "expo": {
    "plugins": ["@config-plugins/expo-uiscene-lifecycle"]
  }
}
```

Run a clean iOS prebuild afterward. The plugin supports the standard SDK 57 Swift AppDelegate template. It rejects a custom scene manifest or unsupported AppDelegate rather than replacing user-owned lifecycle code.

The installed Expo SDK 57 patch must include `ExpoAppSceneDelegate` and `ExpoReactNativeFactoryProvider`. The minimum published patch version will be documented once the runtime backport is released.

The plugin makes the AppDelegate expose its existing `ExpoReactNativeFactory`, defers React Native startup to Expo's runtime scene delegate, and adds the scene manifest. It does not generate Swift source or modify the Xcode project.

## Compatibility

| Expo SDK | Plugin support                                       |
| -------- | ---------------------------------------------------- |
| 57       | Experimental                                         |
| 58+      | Not supported; use Expo's built-in lifecycle support |

## Lifecycle validation

The package contains AppDelegate and Info.plist mutation tests. A DeviceHub/Xcode 27 SDK 57 integration harness is maintained separately while cold/warm URL, Universal Link, and Home Screen quick-action delivery are exercised on a device. A real Universal Link requires an associated domain and valid hosted `apple-app-site-association`; it cannot be proven from a local-only simulator fixture.
