# @config-plugins/react-native-feature-flags

Expo Config Plugin to override native feature flags in React Native Core ([`ReactNativeFeatureFlags`](https://github.com/facebook/react-native/blob/main/packages/react-native/scripts/featureflags/ReactNativeFeatureFlags.config.js)).

> **⚠️ Advanced users only**: `ReactNativeFeatureFlags` controls internal React Native behavior and experimental features that may affect the stability of your app in production. Only override flags if you understand their purpose and have tested the impact.

## Expo installation

> This package cannot be used in the Expo Go app because [it requires custom native code](https://docs.expo.io/workflow/customizing/).

```sh
npx expo install @config-plugins/react-native-feature-flags
```

After installing this package, add the [config plugin](https://docs.expo.io/guides/config-plugins/) to the [`plugins`](https://docs.expo.io/versions/latest/config/app/#plugins) array of your `app.json` or `app.config.js`:

```json
{
  "plugins": [
    [
      "@config-plugins/react-native-feature-flags",
      {
        "nativeFlagOverrides": {
          "fuseboxFrameRecordingEnabled": true
        }
      }
    ]
  ]
}
```

## Configuration

| Option | Type | Default | Description |
|---|---|---|---|
| `nativeFlagOverrides` | `Record<string, boolean>` | *(required)* | One or more flag name/value pairs to override. Flag names must match method names on the base provider class (see below). |

The override runs before React Native initializes, so flags take effect from the very first render. If a flag name doesn't exist in the installed React Native version, the native build will fail with a compile error — remove the unrecognized flag to fix.

### Base classes

When this plugin is applied, overrides will extend from the following base classes, which provide the complete set of flag defaults for your app.

**⚠️ Important**: The resulting merged flags will override any earlier `ReactNativeFeatureFlags` overrides (e.g by `ReactNativeFactory` or other customisation in your Expo app init), as these are applied via `dangerouslyForceOverride`.

- **iOS**: [`ReactNativeFeatureFlagsOverridesOSSStable`](https://github.com/facebook/react-native/blob/main/packages/react-native/ReactCommon/react/featureflags/ReactNativeFeatureFlagsOverridesOSSStable.h)
- **Android**: [`ReactNativeNewArchitectureFeatureFlagsDefaults`](https://github.com/facebook/react-native/blob/main/packages/react-native/ReactAndroid/src/main/java/com/facebook/react/internal/featureflags/ReactNativeNewArchitectureFeatureFlagsDefaults.kt)

Next, rebuild your app as described in the ["Adding custom native code"](https://docs.expo.io/workflow/customizing/) guide.
