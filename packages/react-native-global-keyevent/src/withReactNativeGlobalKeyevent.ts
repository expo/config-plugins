import {
  ConfigPlugin,
  createRunOncePlugin,
  withMainActivity,
} from "@expo/config-plugins";
import { addImports } from "@expo/config-plugins/build/android/codeMod";
import { mergeContents } from "@expo/config-plugins/build/utils/generateCode";

const MAIN_ACTIVITY_LANGUAGES: Record<
  string,
  { code: string; anchor: RegExp }
> = {
  java: {
    code: `
    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        GlobalKeyEventModule instance = GlobalKeyEventModule.getInstance();
        if (instance != null) instance.onKeyDownEvent(keyCode, event);
        return super.onKeyDown(keyCode, event);
    }

    @Override
    public boolean onKeyUp(int keyCode, KeyEvent event) {
        GlobalKeyEventModule instance = GlobalKeyEventModule.getInstance();
        if (instance != null) instance.onKeyUpEvent(keyCode, event);
        return super.onKeyUp(keyCode, event);
    }
`,
    anchor: /return "main";\n\s*};/,
  },
  kt: {
    code: `
  override fun onKeyDown(keyCode: Int, event: KeyEvent): Boolean {
      val instance = GlobalKeyEventModule.getInstance();
      if (instance != null) instance.onKeyDownEvent(keyCode, event);
      return super.onKeyDown(keyCode, event);
  }

  override fun onKeyUp(keyCode: Int , event: KeyEvent): Boolean {
      val instance = GlobalKeyEventModule.getInstance();
      if (instance != null) instance.onKeyUpEvent(keyCode, event);
      return super.onKeyUp(keyCode, event);
  }
`,
    anchor: /override\sfun\sgetMainComponentName\(\).*/,
  },
};

const addKeyBindings = (src: string, language: string) => {
  const mainActivity = MAIN_ACTIVITY_LANGUAGES[language];
  if (!mainActivity) {
    throw new Error(
      `react-native-global-keyevent config plugin does not support MainActivity.${language} yet`,
    );
  }

  const newSrc = [];
  newSrc.push(`    ${mainActivity.code}`);

  return mergeContents({
    tag: "react-native-global-keyevent-onKey",
    src,
    newSrc: newSrc.join("\n"),
    anchor: mainActivity.anchor,
    offset: 1,
    comment: "//",
  });
};

const withAndroidMainActivityKeyboardEvents: ConfigPlugin<void> = (config) => {
  return withMainActivity(config, async (config) => {
    const src = addImports(
      config.modResults.contents,
      ["android.view.KeyEvent", "com.globalkeyevent.GlobalKeyEventModule"],
      config.modResults.language === "java",
    );

    config.modResults.contents = addKeyBindings(
      src,
      config.modResults.language,
    ).contents;

    return config;
  });
};

/**
 * Apply react-native-global-keyevent configuration for Expo SDK 51 projects.
 */
const withReactNativeGlobalKeyevent: ConfigPlugin<void> = (config) => {
  config = withAndroidMainActivityKeyboardEvents(config);

  // Return the modified config.
  return config;
};

const pkg = {
  // Prevent this plugin from being run more than once.
  // This pattern enables users to safely migrate off of this
  // out-of-tree `@config-plugins/react-native-global-keyevent` to a future
  // upstream plugin in `react-native-global-keyevent`
  name: "react-native-global-keyevent",
  // Indicates that this plugin is dangerously linked to a module,
  // and might not work with the latest version of that module.
  version: "UNVERSIONED",
};

export default createRunOncePlugin(
  withReactNativeGlobalKeyevent,
  pkg.name,
  pkg.version,
);
