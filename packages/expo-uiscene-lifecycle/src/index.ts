import plist from "@expo/plist";
import {
  ConfigPlugin,
  IOSConfig,
  withDangerousMod,
  withFinalizedMod,
  withInfoPlist,
} from "expo/config-plugins";
import fs from "fs";
import path from "path";

export type ExpoUIScenePluginOptions = {
  enabled?: boolean;
};

const PLUGIN_NAME = "expo-uiscene-lifecycle";
const ORIGINAL_APP_DELEGATE_DECLARATION =
  "class AppDelegate: ExpoAppDelegate {";
const OWNED_APP_DELEGATE_DECLARATION =
  "class AppDelegate: ExpoAppDelegate, ExpoReactNativeFactoryProvider {";
const ORIGINAL_APP_DELEGATE_ANCHOR = `@main
${ORIGINAL_APP_DELEGATE_DECLARATION}`;
const OWNED_APP_DELEGATE_ANCHOR = `@main
${OWNED_APP_DELEGATE_DECLARATION}`;
const FACTORY_INITIALIZER =
  "let factory = ExpoReactNativeFactory(delegate: delegate)";
const FACTORY_ASSIGNMENT = "    reactNativeFactory = factory";
const LEGACY_STARTUP = `    window = UIWindow(frame: UIScreen.main.bounds)
    factory.startReactNative(
      withModuleName: "main",
      in: window,
      launchOptions: launchOptions)
`;
const LEGACY_STARTUP_ANCHOR = `${FACTORY_ASSIGNMENT}\n\n${LEGACY_STARTUP}\n    return super.application`;
const DEFERRED_STARTUP_ANCHOR = `${FACTORY_ASSIGNMENT}\n\n    return super.application`;

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

type OwnershipState = {
  ownedAtStart: boolean;
  appInfoPlistPaths: string[];
};

function assertSdk57(sdkVersion: string | undefined): void {
  if (!sdkVersion || !/^57(?:\.|$)/.test(sdkVersion)) {
    throw new Error(
      `${PLUGIN_NAME} is experimental and supports Expo SDK 57 only (received ${JSON.stringify(
        sdkVersion ?? "unknown",
      )}).`,
    );
  }
}

function countOccurrences(contents: string, value: string): number {
  return contents.split(value).length - 1;
}

function stripSwiftComments(contents: string): string {
  return contents.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
}

function replaceExactlyOnce(
  contents: string,
  anchor: string,
  replacement: string,
  operation: string,
): string {
  if (countOccurrences(contents, anchor) !== 1) {
    throw new Error(
      `${PLUGIN_NAME} could not ${operation} because the expected AppDelegate anchor was not found exactly once.`,
    );
  }
  const result = contents.replace(anchor, replacement);
  if (result === contents) {
    throw new Error(`${PLUGIN_NAME} could not ${operation} the AppDelegate.`);
  }
  return result;
}

function isOwnedAppDelegate(contents: string): boolean {
  const code = stripSwiftComments(contents);
  return (
    countOccurrences(contents, OWNED_APP_DELEGATE_ANCHOR) === 1 &&
    countOccurrences(contents, ORIGINAL_APP_DELEGATE_ANCHOR) === 0 &&
    countOccurrences(code, FACTORY_INITIALIZER) === 1 &&
    countOccurrences(contents, FACTORY_ASSIGNMENT) === 1 &&
    !code.includes("factory.startReactNative(") &&
    !code.includes("window = UIWindow(frame: UIScreen.main.bounds)")
  );
}

function assertSupportedAppDelegate(language: string, contents: string): void {
  if (language !== "swift") {
    throw new Error(
      `${PLUGIN_NAME} requires the standard SDK 57 Swift AppDelegate; Objective-C AppDelegates are not supported.`,
    );
  }

  const code = stripSwiftComments(contents);
  const isOriginal =
    countOccurrences(contents, ORIGINAL_APP_DELEGATE_ANCHOR) === 1 &&
    countOccurrences(contents, OWNED_APP_DELEGATE_ANCHOR) === 0 &&
    countOccurrences(contents, LEGACY_STARTUP_ANCHOR) === 1;
  const isOwned = isOwnedAppDelegate(contents);
  const factoryIndex = code.indexOf(FACTORY_INITIALIZER);
  const delegateAssignmentIndex = code.indexOf(
    "reactNativeDelegate = delegate",
    factoryIndex,
  );
  const factoryAssignmentIndex = code.indexOf(
    "reactNativeFactory = factory",
    delegateAssignmentIndex,
  );
  const hasStandardShape =
    code.includes("var window: UIWindow?") &&
    code.includes("var reactNativeFactory: RCTReactNativeFactory?") &&
    countOccurrences(code, FACTORY_INITIALIZER) === 1 &&
    factoryIndex >= 0 &&
    delegateAssignmentIndex > factoryIndex &&
    factoryAssignmentIndex > delegateAssignmentIndex;

  if ((!isOriginal && !isOwned) || !hasStandardShape) {
    throw new Error(
      `${PLUGIN_NAME} could not recognize the AppDelegate shape. Only the standard Expo SDK 57 Swift template is supported.`,
    );
  }
}

function enableAppDelegate(contents: string): string {
  assertSupportedAppDelegate("swift", contents);
  if (isOwnedAppDelegate(contents)) {
    return contents;
  }
  let result = replaceExactlyOnce(
    contents,
    ORIGINAL_APP_DELEGATE_ANCHOR,
    OWNED_APP_DELEGATE_ANCHOR,
    "enable scene lifecycle in",
  );
  result = replaceExactlyOnce(
    result,
    LEGACY_STARTUP_ANCHOR,
    DEFERRED_STARTUP_ANCHOR,
    "defer React Native startup in",
  );
  if (!isOwnedAppDelegate(result)) {
    throw new Error(
      `${PLUGIN_NAME} could not verify the enabled AppDelegate integration.`,
    );
  }
  return result;
}

function disableAppDelegate(contents: string): string {
  if (!isOwnedAppDelegate(contents)) {
    throw new Error(
      `${PLUGIN_NAME} cannot disable because the plugin-owned AppDelegate integration was edited. Restore its AppDelegate declaration and deferred startup before disabling.`,
    );
  }
  let result = replaceExactlyOnce(
    contents,
    OWNED_APP_DELEGATE_ANCHOR,
    ORIGINAL_APP_DELEGATE_ANCHOR,
    "disable scene lifecycle in",
  );
  result = replaceExactlyOnce(
    result,
    FACTORY_ASSIGNMENT,
    `${FACTORY_ASSIGNMENT}\n\n${LEGACY_STARTUP.trimEnd()}`,
    "restore React Native startup in",
  );
  const code = stripSwiftComments(result);
  if (
    countOccurrences(result, ORIGINAL_APP_DELEGATE_ANCHOR) !== 1 ||
    countOccurrences(result, OWNED_APP_DELEGATE_ANCHOR) !== 0 ||
    countOccurrences(code, "factory.startReactNative(") !== 1 ||
    countOccurrences(code, "window = UIWindow(frame: UIScreen.main.bounds)") !==
      1
  ) {
    throw new Error(
      `${PLUGIN_NAME} could not verify the restored AppDelegate integration.`,
    );
  }
  return result;
}

function isStructurallyEqual(actual: unknown, expected: unknown): boolean {
  if (Array.isArray(expected)) {
    return (
      Array.isArray(actual) &&
      actual.length === expected.length &&
      actual.every((item, index) => isStructurallyEqual(item, expected[index]))
    );
  }
  if (expected !== null && typeof expected === "object") {
    if (
      actual === null ||
      typeof actual !== "object" ||
      Array.isArray(actual)
    ) {
      return false;
    }
    const actualRecord = actual as Record<string, unknown>;
    const expectedRecord = expected as Record<string, unknown>;
    const expectedKeys = Object.keys(expectedRecord);
    return (
      Object.keys(actualRecord).length === expectedKeys.length &&
      expectedKeys.every((key) =>
        isStructurallyEqual(actualRecord[key], expectedRecord[key]),
      )
    );
  }
  return actual === expected;
}

function isOwnedManifest(value: unknown): boolean {
  return isStructurallyEqual(value, SCENE_MANIFEST);
}

function referencesRuntimeSceneDelegate(value: unknown): boolean {
  if (Array.isArray(value)) {
    return value.some(referencesRuntimeSceneDelegate);
  }
  if (value !== null && typeof value === "object") {
    return Object.values(value).some(referencesRuntimeSceneDelegate);
  }
  return value === "EXExpoAppSceneDelegate";
}

function getApplicationTarget(project: any): any {
  const objects = project.hash.project.objects;
  const targets = project
    .getFirstProject()
    .firstProject.targets.map(
      ({ value }: { value: string }) => objects.PBXNativeTarget[value],
    )
    .filter(
      (target: any) =>
        target?.productType?.replace(/^"|"$/g, "") ===
        "com.apple.product-type.application",
    );

  if (targets.length !== 1) {
    throw new Error(
      `${PLUGIN_NAME} expected exactly one iOS application target, but found ${targets.length}.`,
    );
  }
  return targets[0];
}

function getApplicationInfoPlistPaths(projectRoot: string): string[] {
  const project = IOSConfig.XcodeUtils.getPbxproj(projectRoot);
  const target = getApplicationTarget(project);
  const objects = project.hash.project.objects;
  const configurationList =
    objects.XCConfigurationList[target.buildConfigurationList];
  const paths = configurationList?.buildConfigurations.map(
    ({ value: configurationId, comment: configurationComment }: any) => {
      const buildConfiguration = objects.XCBuildConfiguration[configurationId];
      const configurationName =
        buildConfiguration?.name?.replace(/^"|"$/g, "") ??
        configurationComment ??
        configurationId;
      const infoPlistBuildProperty =
        buildConfiguration?.buildSettings?.INFOPLIST_FILE;
      if (typeof infoPlistBuildProperty !== "string") {
        throw new Error(
          `${PLUGIN_NAME} could not resolve the application target's INFOPLIST_FILE build setting for ${configurationName}.`,
        );
      }

      const relativePath = infoPlistBuildProperty
        .replace(/"/g, "")
        .replace(/^\$\((?:SRCROOT|PROJECT_DIR)\)\/?/, "");
      if (relativePath.includes("$(")) {
        throw new Error(
          `${PLUGIN_NAME} cannot resolve variables in the application target's ${configurationName} INFOPLIST_FILE setting: ${infoPlistBuildProperty}.`,
        );
      }
      const infoPlistPath = path.resolve(projectRoot, "ios", relativePath);
      if (!fs.existsSync(infoPlistPath)) {
        throw new Error(
          `${PLUGIN_NAME} could not find the application target's ${configurationName} Info.plist at ${infoPlistPath}.`,
        );
      }
      return infoPlistPath;
    },
  );
  if (!paths?.length) {
    throw new Error(
      `${PLUGIN_NAME} could not resolve any build configurations for the application target.`,
    );
  }
  return [...new Set<string>(paths)];
}

function readInfoPlist(infoPlistPath: string): Record<string, unknown> {
  return plist.parse(fs.readFileSync(infoPlistPath, "utf8"));
}

function writeInfoPlist(
  infoPlistPath: string,
  contents: Record<string, unknown>,
): void {
  fs.writeFileSync(infoPlistPath, plist.build(contents));
}

const withExpoUIScene: ConfigPlugin<ExpoUIScenePluginOptions | void> = (
  config,
  options,
) => {
  assertSdk57(config.sdkVersion);
  const enabled = options?.enabled !== false;
  const ownership: OwnershipState = {
    ownedAtStart: false,
    appInfoPlistPaths: [],
  };

  config = withDangerousMod(config, [
    "ios",
    async (config) => {
      const projectRoot = config.modRequest.projectRoot;
      const appDelegate = IOSConfig.Paths.getAppDelegate(projectRoot);
      ownership.appInfoPlistPaths = getApplicationInfoPlistPaths(projectRoot);
      const manifests = ownership.appInfoPlistPaths.map(
        (infoPlistPath) =>
          readInfoPlist(infoPlistPath).UIApplicationSceneManifest,
      );
      const configuredManifest =
        config.ios?.infoPlist?.UIApplicationSceneManifest;
      ownership.ownedAtStart = isOwnedAppDelegate(appDelegate.contents);

      if (enabled) {
        assertSupportedAppDelegate(appDelegate.language, appDelegate.contents);
        if (
          (configuredManifest !== undefined &&
            !(ownership.ownedAtStart && isOwnedManifest(configuredManifest))) ||
          manifests.some(
            (manifest) =>
              manifest !== undefined &&
              !(ownership.ownedAtStart && isOwnedManifest(manifest)),
          )
        ) {
          throw new Error(
            `${PLUGIN_NAME} cannot enable because UIApplicationSceneManifest is already declared by the app.`,
          );
        }
      } else if (!ownership.ownedAtStart && manifests.some(isOwnedManifest)) {
        throw new Error(
          `${PLUGIN_NAME} cannot disable because the plugin-owned AppDelegate integration was edited.`,
        );
      } else if (
        ownership.ownedAtStart &&
        manifests.some((manifest) => !isOwnedManifest(manifest))
      ) {
        throw new Error(
          `${PLUGIN_NAME} cannot disable because the plugin-owned UIApplicationSceneManifest was edited. Restore it before disabling.`,
        );
      }
      return config;
    },
  ]);

  config = withInfoPlist(config, (config) => {
    const selectedInfoPlistPath = path.resolve(
      IOSConfig.Paths.getInfoPlistPath(config.modRequest.projectRoot),
    );
    const appInfoPlistPaths = ownership.appInfoPlistPaths.length
      ? ownership.appInfoPlistPaths
      : getApplicationInfoPlistPaths(config.modRequest.projectRoot);
    if (!appInfoPlistPaths.includes(selectedInfoPlistPath)) {
      return config;
    }
    const manifest = config.modResults.UIApplicationSceneManifest;
    if (enabled) {
      if (
        manifest !== undefined &&
        !(ownership.ownedAtStart && isOwnedManifest(manifest))
      ) {
        throw new Error(
          `${PLUGIN_NAME} cannot enable because UIApplicationSceneManifest is already declared by the app.`,
        );
      }
      config.modResults.UIApplicationSceneManifest =
        structuredClone(SCENE_MANIFEST);
    } else if (ownership.ownedAtStart && isOwnedManifest(manifest)) {
      delete config.modResults.UIApplicationSceneManifest;
    }
    return config;
  });

  config = withFinalizedMod(config, [
    "ios",
    async (config) => {
      const projectRoot = config.modRequest.projectRoot;
      const infoPlists = getApplicationInfoPlistPaths(projectRoot).map(
        (infoPlistPath) => ({
          infoPlistPath,
          contents: readInfoPlist(infoPlistPath),
        }),
      );
      const appDelegate = IOSConfig.Paths.getAppDelegate(projectRoot);

      if (enabled) {
        const conflict = infoPlists.find(
          ({ contents }) =>
            contents.UIApplicationSceneManifest !== undefined &&
            !isOwnedManifest(contents.UIApplicationSceneManifest),
        );
        if (conflict) {
          throw new Error(
            `${PLUGIN_NAME} cannot enable because the final UIApplicationSceneManifest in ${conflict.infoPlistPath} is not plugin-owned.`,
          );
        }
        const appDelegateContents = enableAppDelegate(appDelegate.contents);
        for (const { infoPlistPath, contents } of infoPlists) {
          if (!isOwnedManifest(contents.UIApplicationSceneManifest)) {
            contents.UIApplicationSceneManifest =
              structuredClone(SCENE_MANIFEST);
            writeInfoPlist(infoPlistPath, contents);
          }
        }
        fs.writeFileSync(appDelegate.path, appDelegateContents);
      } else if (ownership.ownedAtStart) {
        const runtimeReference = infoPlists.find(
          ({ contents }) =>
            referencesRuntimeSceneDelegate(
              contents.UIApplicationSceneManifest,
            ) && !isOwnedManifest(contents.UIApplicationSceneManifest),
        );
        if (runtimeReference) {
          throw new Error(
            `${PLUGIN_NAME} cannot disable because the final UIApplicationSceneManifest in ${runtimeReference.infoPlistPath} still references EXExpoAppSceneDelegate.`,
          );
        }
        const replacement = infoPlists.find(
          ({ contents }) =>
            contents.UIApplicationSceneManifest !== undefined &&
            !isOwnedManifest(contents.UIApplicationSceneManifest),
        );
        if (replacement) {
          throw new Error(
            `${PLUGIN_NAME} cannot disable because another plugin replaced UIApplicationSceneManifest in ${replacement.infoPlistPath}.`,
          );
        }
        const appDelegateContents = disableAppDelegate(appDelegate.contents);
        for (const { infoPlistPath, contents } of infoPlists) {
          if (isOwnedManifest(contents.UIApplicationSceneManifest)) {
            delete contents.UIApplicationSceneManifest;
            writeInfoPlist(infoPlistPath, contents);
          }
        }
        fs.writeFileSync(appDelegate.path, appDelegateContents);
      }
      return config;
    },
  ]);

  return config;
};

export default withExpoUIScene;
