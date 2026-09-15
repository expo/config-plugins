import {
  type ConfigPlugin,
  withAppDelegate,
  withInfoPlist,
} from "expo/config-plugins";
import semver from "semver";

export type ExpoUIScenePluginOptions = {
  enabled?: boolean;
};

const PLUGIN_NAME = "expo-uiscene-lifecycle";
const MINIMUM_EXPO_VERSION = "57.0.23";
const ORIGINAL_APP_DELEGATE = "class AppDelegate: ExpoAppDelegate {";
const SCENE_APP_DELEGATE =
  "class AppDelegate: ExpoAppDelegate, ExpoReactNativeFactoryProvider {";
const FACTORY_ASSIGNMENT = "    reactNativeFactory = factory";
const LEGACY_STARTUP = `    window = UIWindow(frame: UIScreen.main.bounds)
    factory.startReactNative(
      withModuleName: "main",
      in: window,
      launchOptions: launchOptions)
`;
const LEGACY_STARTUP_BLOCK = `#if os(iOS) || os(tvOS)\n${LEGACY_STARTUP}#endif\n`;

const SCENE_MANIFEST = {
  UIApplicationSupportsMultipleScenes: false,
  UISceneConfigurations: {
    UIWindowSceneSessionRoleApplication: [
      {
        UISceneConfigurationName: "Default Configuration",
        UISceneDelegateClassName: "EXExpoAppSceneDelegate",
      },
    ],
  },
};

export function assertSdk57(installedExpoVersion: string | undefined): void {
  if (
    !installedExpoVersion ||
    semver.gt(MINIMUM_EXPO_VERSION, installedExpoVersion) ||
    semver.gte(installedExpoVersion, "58.0.0")
  ) {
    throw new Error(
      `${PLUGIN_NAME} supports Expo ${MINIMUM_EXPO_VERSION} through SDK 57 only (installed: ${JSON.stringify(installedExpoVersion ?? "unknown")}).`,
    );
  }
}

function getInstalledExpoVersion(): string | undefined {
  try {
    return (require("expo/package.json") as { version?: string }).version;
  } catch {
    return undefined;
  }
}

function isOwnedManifest(manifest: unknown): boolean {
  return JSON.stringify(manifest) === JSON.stringify(SCENE_MANIFEST);
}

function updateAppDelegate(contents: string, enabled: boolean): string {
  const isEnabled = contents.includes(SCENE_APP_DELEGATE);

  if (enabled && isEnabled) {
    return contents;
  }
  if (!enabled && !isEnabled) {
    return contents;
  }

  if (enabled) {
    const startup = `\n${LEGACY_STARTUP_BLOCK}`;
    if (
      !contents.includes(ORIGINAL_APP_DELEGATE) ||
      !contents.includes(startup)
    ) {
      throw new Error(
        `${PLUGIN_NAME} requires the standard Expo SDK 57 Swift AppDelegate.`,
      );
    }
    return contents
      .replace(ORIGINAL_APP_DELEGATE, SCENE_APP_DELEGATE)
      .replace(startup, "");
  }

  return contents
    .replace(SCENE_APP_DELEGATE, ORIGINAL_APP_DELEGATE)
    .replace(
      `${FACTORY_ASSIGNMENT}\n\n`,
      `${FACTORY_ASSIGNMENT}\n\n${LEGACY_STARTUP_BLOCK}\n`,
    );
}

const withExpoUIScene: ConfigPlugin<ExpoUIScenePluginOptions | void> = (
  config,
  options,
) => {
  assertSdk57(getInstalledExpoVersion());
  const enabled = options?.enabled !== false;

  config = withAppDelegate(config, (config) => {
    if (config.modResults.language !== "swift") {
      throw new Error(
        `${PLUGIN_NAME} requires the standard Expo SDK 57 Swift AppDelegate.`,
      );
    }
    config.modResults.contents = updateAppDelegate(
      config.modResults.contents,
      enabled,
    );
    return config;
  });

  return withInfoPlist(config, (config) => {
    const manifest = config.modResults.UIApplicationSceneManifest;
    if (enabled) {
      if (manifest !== undefined && !isOwnedManifest(manifest)) {
        throw new Error(
          `${PLUGIN_NAME} cannot enable because UIApplicationSceneManifest is already declared by the app.`,
        );
      }
      config.modResults.UIApplicationSceneManifest = SCENE_MANIFEST;
    } else if (isOwnedManifest(manifest)) {
      delete config.modResults.UIApplicationSceneManifest;
    }
    return config;
  });
};

export default withExpoUIScene;
