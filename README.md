# Expo Config Plugins

This repository is a collection of assorted [Expo config plugins](https://docs.expo.dev/guides/config-plugins/) for configuring the `npx expo prebuild` command.

- **We prefer packages to ship their own Expo config plugin**. This helps ensure that plugin and package versions are always aligned, and that new features are made available in both the package and plugin simultaneously. If packages haven't adopted config plugins yet, the community can add a package here as a temporary home.

- **All packages here are community maintained.** They are not maintained by Expo. Feel free to improve docs, packages, tests, etc.

- **We maintain a one-to-one mapping between native packages and `@config-plugins/*`**. This means there should be no general utility packages here — those are better suited for a different repository or npm namespace.

## First-party plugins

The following are some examples of libraries that have a built-in Config Plugin. This is far from an exhaustive list, and most React Native libraries have a built-in Config Plugin if one is needed (in many cases, it is not required).

- [React Native Firebase](https://rnfirebase.io/) (`@react-native-firebase/perf`, `@react-native-firebase/app`, `@react-native-firebase/crashlytics`)
- [react-native-google-cast](https://github.com/react-native-google-cast/react-native-google-cast)
- [react-native-nfc-manager](https://github.com/revtel/react-native-nfc-manager)
- [react-native-health](https://github.com/agencyenterprise/react-native-health)
- [@react-native-mapbox-gl/maps](https://github.com/rnmapbox/maps)
- [@logrocket/react-native](https://www.npmjs.com/package/@logrocket/react-native)
- [sentry-expo](https://www.npmjs.com/package/sentry-expo)
- [@leanplum/react-native-sdk](https://github.com/Leanplum/Leanplum-ReactNative-SDK#readme)
- [react-native-fbsdk-next](https://www.npmjs.com/package/react-native-fbsdk-next)
- [@stripe/stripe-react-native](https://www.npmjs.com/package/@stripe/stripe-react-native)
- [@react-native-voice/voice](https://www.npmjs.com/package/@react-native-voice/voice)
- [react-native-imglysdk](https://www.npmjs.com/package/react-native-imglysdk)
- [@viro-community/react-viro](https://github.com/virocommunity/viro) -- [Guide](https://viro-community.readme.io/docs/integrating-with-expo)
- [react-native-msal](https://www.npmjs.com/package/react-native-msal)
- [react-native-spotlight-search](https://www.npmjs.com/package/react-native-spotlight-search)
- [newrelic-react-native-agent](https://www.npmjs.com/package/newrelic-react-native-agent)
- [react-native-videoeditorsdk](https://www.npmjs.com/package/react-native-videoeditorsdk)
- [notifee](https://notifee.app/)
- [App Clips](https://github.com/bndkt/react-native-app-clip/)
- [iOS Safari Extensions](https://github.com/andrew-levy/react-native-safari-extension/)
- [react-native-ble-plx](https://github.com/dotintent/react-native-ble-plx)
- ... and [many more](https://reactnative.directory/)

### Complementary

In some cases, libraries will ship plugins as separate packages. For example:

- [onesignal-expo-plugin](https://github.com/OneSignal/onesignal-expo-plugin) (for use with `react-native-onesignal`)
  - Configures **iOS Notification Service Extensions** for rich push notification and custom notification actions.
- [@lyrahealth-inc/react-native-orientation-plugin](https://www.npmjs.com/package/@lyrahealth-inc/react-native-orientation-plugin) (for use with `react-native-orientation-plugin`)
- [airship-expo-plugin](https://www.npmjs.com/package/airship-expo-plugin) (for use with `urbanairship-react-native`)
- [config-plugin-react-native-intercom](https://www.npmjs.com/package/config-plugin-react-native-intercom) (for use with `intercom-react-native`)
- [@allboatsrise/expo-marketingcloudsdk](https://www.npmjs.com/package/@allboatsrise/expo-marketingcloudsdk) (for use with `react-native-marketingcloudsdk`)
- [@ouvio/react-native-background-location-plugin](https://www.npmjs.com/package/@ouvio/react-native-background-location-plugin) (for use with `react-native-background-location-plugin`)
- [expo-community-flipper](https://www.npmjs.com/package/expo-community-flipper) (for use with Flipper)
- [expo-appcenter](https://www.npmjs.com/package/expo-appcenter) (for use with `appcenter`)
- [expo-react-native-freshchat](https://www.npmjs.com/package/expo-react-native-freshchat) (for use with `react-native-freshchat-sdk`)
- [react-native-keyevent-expo-config-plugin](https://github.com/chronsyn/react-native-keyevent-expo-config-plugin) (for use with `react-native-keyevent`)
- [watermelondb-expo-plugin](https://github.com/morrowdigital/watermelondb-expo-plugin) (for use with `@nozbe/watermelondb`)
- ... and [many more](https://reactnative.directory/)

### No Plugin Required

Just install and rebuild! If a package doesn't require any futher setup then it most likely doesn't need an Expo config plugin. Most packages work without a config plugin (including packages not listed below):

- [react-native-share](https://github.com/react-native-share/react-native-share)
- [@react-native-menu/menu](https://github.com/react-native-menu/menu)
- [react-native-blurhash](https://github.com/mrousavy/react-native-blurhash)
- [react-native-app-shortcuts](https://github.com/lokyoung/react-native-app-shortcuts)
- [react-native-multiple-image-picker](https://github.com/baronha/react-native-multiple-image-picker)
- [`@shopify/flash-list`](https://github.com/Shopify/flash-list)
- ... and [many more](https://reactnative.directory/)

## Contributing!

See the [contributing guide](/CONTRIBUTING.md).
