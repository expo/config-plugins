# @config-plugins/react-native-android-per-app-language

### How it works
This plugin automates the manual setup process described in the [Android documentation](https://developer.android.com/guide/topics/resources/app-languages#use-localeconfig) for implementing per-app language preferences:

1. Modifies the `AndroidManifest.xml` to add the `android:localeConfig` attribute to the `<application>` tag.
2. Creates a `res/xml/locales_config.xml` file with the specified supported languages.

## Expo installation
To use this plugin in your Expo project, follow these steps:

1. Install the plugin:
   ```
   expo install @config-plugins/react-native-android-per-app-language
   ```

2. Add the plugin to your `app.json` or `app.config.js`:
   ```json
   {
     "expo": {
       "plugins": [
         [
           "@config-plugins/react-native-android-per-app-language",
           {
             "supportedLanguages": ["en", "es", "fr"]
           }
         ]
       ]
     }
   }
   ```

   The `supportedLanguages` parameter is required and should be an array of language codes that your app supports.

3. Rebuild your app:
   ```
   expo prebuild
   ```

This will configure your Android project to support per-app language preferences for the specified languages.

