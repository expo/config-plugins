import { registerRootComponent } from "expo";

import Constants from "expo-constants";

let App;
// Only use the Detox test in CI
if ((Constants.manifest.extra || {}).CI) {
  App = require("./src/detox/App").default;
} else {
  App = require("./App").default;
}
// import App from "./App";

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
