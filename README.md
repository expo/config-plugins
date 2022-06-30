# Expo Config Plugins

- A collection of [Expo config plugins](https://docs.expo.dev/guides/config-plugins/) for configuring the `expo prebuild` command.
- This repo is to Expo config plugins as [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped) is to TypeScript.
- We prefer packages ship their own Expo config plugin (to ensure versioning is aligned), but if they haven't adopted the system yet, the community can add a package here.
- All packages here are community maintained. Feel free to improve docs, packages, tests, etc.
- We maintain a 1-1 mapping of **native packages** ⇔ `@config-plugins/*`. This means there should be no general utility packages here -- those are better suited for a different repo / NPM namespace.

## Awesome

Here is a list of known packages that have a built-in Config Plugin. 

> Not all packages need a config plugin, packages that don't appear here might still work with managed EAS.

- [React Native Firebase](https://rnfirebase.io/) (`@react-native-firebase/perf`, `@react-native-firebase/app`)
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
- [@viro-community/react-viro](https://github.com/virocommunity/viro)
- [react-native-msal](https://www.npmjs.com/package/react-native-msal)
- [react-native-spotlight-search](https://www.npmjs.com/package/react-native-spotlight-search)
- [newrelic-react-native-agent](https://www.npmjs.com/package/newrelic-react-native-agent)
- [react-native-videoeditorsdk](https://www.npmjs.com/package/react-native-videoeditorsdk)
- [notifee](https://notifee.app/)
- [App Clips](https://github.com/bndkt/react-native-app-clip/)
- [iOS Safari Extensions](https://github.com/andrew-levy/react-native-safari-extension/)

### Complementary

More out-of-tree plugins which can be used to configure more packages.

- [onesignal-expo-plugin](https://github.com/OneSignal/onesignal-expo-plugin) (for use with `react-native-onesignal`)
- [@lyrahealth-inc/react-native-orientation-plugin](@lyrahealth-inc/react-native-orientation-plugin) (for use with `react-native-orientation-plugin`)
- [airship-expo-plugin](https://www.npmjs.com/package/airship-expo-plugin) (for use with `urbanairship-react-native`)
- [config-plugin-react-native-intercom](https://www.npmjs.com/package/config-plugin-react-native-intercom) (for use with `intercom-react-native`)
- [@allboatsrise/expo-marketingcloudsdk](https://www.npmjs.com/package/@allboatsrise/expo-marketingcloudsdk) (for use with `react-native-marketingcloudsdk`)
- [@ouvio/react-native-background-location-plugin](https://www.npmjs.com/package/@ouvio/react-native-background-location-plugin) (for use with `react-native-background-location-plugin`)
- [expo-community-flipper](https://www.npmjs.com/package/expo-community-flipper) (for use with Flipper)


## Contributing!

See the [contributing guide](/CONTRIBUTING.md).
