# config-plugins/detox

Config plugin to auto configure Detox when the native code is generated (`expo prebuild`).

### Add the package to your npm dependencies

> Tested against Expo SDK 43

```
yarn add detox @config-plugins/detox
```

Detox is an end-to-end (e2e) testing library for iOS and Android. You can use it to automate usage of your native project. This example demonstrates how to use Detox and Jest in a native project that you build locally.

## 🚀 How to use

- Install with `yarn` or `npm install`
  - Install iOS packages: `npx pod-install`
- Run `yarn e2e:ios` to build and test the iOS app on a simulator (macOS only).
  - This combines `yarn build:ios` and `yarn test:ios`.
  - You can run `yarn test:ios --watch` after building to keep the tests in watch mode.
- Run `yarn e2e:android` to build and test the Android app on a Google emulator (Genymotion requires extra config).
  - This combines `yarn build:android` and `yarn test:android`.
  - You can run `yarn test:android --watch` after building to keep the tests in watch mode.
- Run `yarn e2e:android-release` to build and test the Android app in release mode.

## Recreate this example

- `npx create-react-native-app -t blank`
  - `cd` into the project
- Install packages:
  - `yarn add -D detox @config-plugins/detox @babel/core @babel/runtime @types/jest babel-jest jest jest-circus ts-jest`
  - touch `tsconfig.json`
  - Run `expo start` to ensure TS is setup correctly.
- Add the following plugin to your `app.json` plugins array (before prebuilding). This'll automatically configure the Android native code to support Detox:
  ```json
  {
    "plugins": ["@config-plugins/detox"]
  }
  ```
- Generate the native code `expo prebuild`
- Run `yarn detox init -r jest`

## FAQ

If the following commands fail, you can get better debug info by running a subset command:

- `yarn e2e:ios`: `yarn ios` (builds the iOS app). xcodebuild compile errors may show in a more helpful format (using xcpretty).
- `yarn e2e:android`: `yarn android` (builds the Android app). Android compile errors may show in a more helpful format.

### `yarn e2e:android` failed

If you get the error:

```sh
detox[98696] ERROR: DetoxRuntimeError: Cannot boot Android Emulator with the name: 'Pixel_API_28'

HINT: Make sure you choose one of the available emulators: Pixel_3_API_30,Pixel_3a_API_30,Pixel_C_API_30
```

Be sure to change the first emulator name (in my case "Pixel_API_28") with one of the suggested emulators (in my case Pixel_3_API_30, Pixel_3a_API_30, Pixel_C_API_30), in the `detox.config.js` file under `devices.emulator.device.avdName`. More emulators can be created in Android Studio.

---

If you get the error:

```sh
Error: app binary not found at '/Users/.../with-detox/android/app/build/outputs/apk/debug/app-debug.apk', did you build it
```

It means the build step failed, ensure running `yarn android`, and `yarn build:android` works before trying `yarn e2e:android` again.

---

If you get the error:

```sh
PKIX path building failed: sun.security.provider.certpath.SunCertPathBuilderException: unable to find valid certification path to requested target
```

Be sure to disable any proxies running on your computer that may be blocking requests (i.e. Charles Proxy). You may need to run `yarn clean:android` before attempting to build again.

## 📝 Notes

- [Detox docs](https://github.com/wix/Detox/blob/master/docs/Introduction.GettingStarted.md)
