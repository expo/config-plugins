import { ConfigPlugin } from "@expo/config-plugins";
/**
 * [Step 5](https://github.com/wix/Detox/blob/master/docs/Introduction.Android.md#5-create-a-detox-test-class). Create `DetoxTest.java`
 */
declare const withDetoxTestClass: (includeTestButler?: boolean) => ConfigPlugin;
export default withDetoxTestClass;
