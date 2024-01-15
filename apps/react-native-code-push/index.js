import { registerRootComponent } from "expo";
import codePush from "react-native-code-push";

import App from "./src/App";

const appWithCodePush = codePush({
  checkFrequency: codePush.CheckFrequency.ON_APP_START,
  installMode: codePush.InstallMode.IMMEDIATE,
})(App);

registerRootComponent(appWithCodePush);
