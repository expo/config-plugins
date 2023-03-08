import { ConfigPlugin } from "expo/config-plugins";
/**
 * Lifted from [unimodules-test-core](https://github.com/expo/expo/blob/master/packages/unimodules-test-core/app.plugin.js).
 *
 * @param config Expo config
 * @param version Kotlin version to use
 */
declare const withKotlinGradle: ConfigPlugin<string>;
export default withKotlinGradle;
