# config-plugins/react-native-pdf

> Consider using a WebView or WebBrowser to quickly display a PDF in your app. Read the alternatives section to learn more.

Config plugin to auto-configure [`react-native-pdf`][lib] when the native code is generated (`npx expo prebuild`).

## Versioning

Ensure you use versions that work together!

| `expo` | `react-native-pdf` | `@config-plugins/react-native-pdf` |
| ------ | ------------------ | ---------------------------------- |
| 53.0.0 | 6.7.7              | 10.0.0                             |
| 52.0.0 | 6.7.6              | 9.0.0                              |
| 51.0.0 | 6.7.5              | 8.0.0                              |
| 50.0.0 | 6.7.4              | 7.0.0                              |
| 49.0.0 | 6.7.1              | 6.0.0                              |
| 48.0.0 | 6.6.2              | 5.0.0                              |

### Add the package to your npm dependencies

> This package cannot be used in the "Expo Go" app because [it requires custom native code](https://docs.expo.io/workflow/customizing/).

First install the package with yarn, npm, or [`npx expo install`](https://docs.expo.io/workflow/expo-cli/#expo-install).

```
npx expo install react-native-pdf react-native-blob-util @config-plugins/react-native-pdf @config-plugins/react-native-blob-util
```

After installing this npm package, add the [config plugin](https://docs.expo.io/guides/config-plugins/) to the [`plugins`](https://docs.expo.io/versions/latest/config/app/#plugins) array of your `app.json` or `app.config.js`:

```json
{
  "plugins": [
    "@config-plugins/react-native-blob-util",
    "@config-plugins/react-native-pdf"
  ]
}
```

Next, rebuild your app as described in the ["Adding custom native code"](https://docs.expo.io/workflow/customizing/) guide.

[lib]: https://www.npmjs.com/package/react-native-pdf

### Alternatives

Consider opening a WebBrowser to display a PDF:

```js
import * as WebBrowser from "expo-web-browser";
import { Text } from "react-native";

export default function HomeScreen() {
  return (
    <Text
      onPress={() => {
        WebBrowser.openBrowserAsync(
          "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
        );
      }}
    >
      Open in-app browser
    </Text>
  );
}
```

Or inside a `WebView` for a contained view:

```js
import { WebView } from "react-native-webview";

export default function HomeScreen() {
  return (
    <WebView
      style={{ width: 100, height: 100 }}
      source={{
        uri: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      }}
    />
  );
}
```

Alternatively, if users have a favorite PDF viewer app than consider using `Share` API to let users open the PDF in their preferred app. This is akin to how `UIDocumentInteractionController` is intended to be used on iOS.

Finally, you could use [DOM Components](https://docs.expo.dev/guides/dom-components/) for a custom web experience.
