import plist from "@expo/plist";
import type { ExpoConfig } from "expo/config";
import {
  compileModsAsync,
  IOSConfig,
  withInfoPlist,
} from "expo/config-plugins";
import fs from "fs";
import { vol } from "memfs";
import path from "path";

import withExpoUIScene, { type ExpoUIScenePluginOptions } from "..";
import getSdk57ProjectWithoutUISceneLifecycle from "./fixtures/sdk57ProjectWithoutUISceneLifecycle";

jest.mock("fs");

const projectRoot = "/app";
const appDelegatePath = "/app/ios/HelloWorld/AppDelegate.swift";
const infoPlistPath = "/app/ios/HelloWorld/Info.plist";
const projectPath = "/app/ios/HelloWorld.xcodeproj/project.pbxproj";
const generatedSourcePath = "/app/ios/HelloWorld/ExpoUIScene/ExpoUIScene.swift";

function loadProject(
  mutate?: (files: Record<string, string | Buffer>) => void,
) {
  const files = getSdk57ProjectWithoutUISceneLifecycle();
  mutate?.(files);
  vol.fromJSON(files, projectRoot);
}

async function runPlugin(
  options?: ExpoUIScenePluginOptions,
  {
    sdkVersion = "57.0.0",
    infoPlist,
  }: { sdkVersion?: string; infoPlist?: Record<string, unknown> } = {},
) {
  let config: ExpoConfig = {
    name: "HelloWorld",
    slug: "hello-world",
    sdkVersion,
    ios: { bundleIdentifier: "dev.expo.HelloWorld", infoPlist },
    _internal: { projectRoot },
  };
  config = withExpoUIScene(config, options);
  return compileModsAsync(config, {
    projectRoot,
    platforms: ["ios"],
    assertMissingModProviders: false,
  });
}

async function runWithLaterManifest() {
  let config: ExpoConfig = {
    name: "HelloWorld",
    slug: "hello-world",
    sdkVersion: "57.0.0",
    ios: { bundleIdentifier: "dev.expo.HelloWorld" },
    _internal: { projectRoot },
  };
  config = withExpoUIScene(config);
  config = withInfoPlist(config, (config) => {
    config.modResults.UIApplicationSceneManifest = {
      UIApplicationSupportsMultipleScenes: true,
    };
    return config;
  });
  return compileModsAsync(config, {
    projectRoot,
    platforms: ["ios"],
    assertMissingModProviders: false,
  });
}

function snapshotProject() {
  return {
    appDelegate: fs.readFileSync(appDelegatePath, "utf8"),
    infoPlist: plist.parse(fs.readFileSync(infoPlistPath, "utf8")),
    project: fs.readFileSync(projectPath, "utf8"),
    generatedSourceExists: fs.existsSync(generatedSourcePath),
  };
}

function configureNondefaultAppInfoPlistWithExtension() {
  const appInfoPlistPath = "/app/ios/Config/App-Info.plist";
  fs.mkdirSync(path.dirname(appInfoPlistPath), { recursive: true });
  fs.writeFileSync(appInfoPlistPath, fs.readFileSync(infoPlistPath));

  const extensionInfoPlist = plist.parse(
    fs.readFileSync(infoPlistPath, "utf8"),
  );
  extensionInfoPlist.CFBundleIdentifier = "dev.expo.HelloWorld.extension";
  fs.writeFileSync(infoPlistPath, plist.build(extensionInfoPlist));

  const project = IOSConfig.XcodeUtils.getPbxproj(projectRoot);
  const objects = project.hash.project.objects;
  const applicationTarget = project
    .getFirstProject()
    .firstProject.targets.map(
      ({ value }: { value: string }) => objects.PBXNativeTarget[value],
    )
    .find(
      (target: any) =>
        target.productType.replace(/^"|"$/g, "") ===
        "com.apple.product-type.application",
    );
  const applicationConfigurations =
    objects.XCConfigurationList[applicationTarget.buildConfigurationList]
      .buildConfigurations;
  for (const { value: configurationId } of applicationConfigurations) {
    objects.XCBuildConfiguration[configurationId].buildSettings.INFOPLIST_FILE =
      "Config/App-Info.plist";
  }

  const extensionTarget = project.addTarget(
    "HelloWorldExtension",
    "app_extension",
    "HelloWorldExtension",
  );
  const extensionConfigurations =
    objects.XCConfigurationList[
      extensionTarget.pbxNativeTarget.buildConfigurationList
    ].buildConfigurations;
  for (const { value: configurationId } of extensionConfigurations) {
    objects.XCBuildConfiguration[configurationId].buildSettings.INFOPLIST_FILE =
      "HelloWorld/Info.plist";
  }
  fs.writeFileSync(projectPath, project.writeSync());
  return appInfoPlistPath;
}

describe(withExpoUIScene, () => {
  afterEach(() => vol.reset());

  it.each([
    ["omitted options", undefined],
    ["enabled explicitly", { enabled: true }],
  ] as const)(
    "enables the SDK 57 runtime scene delegate with %s",
    async (_label, options) => {
      loadProject();
      const originalProject = fs.readFileSync(projectPath, "utf8");
      await runPlugin(options);

      const infoPlist = plist.parse(fs.readFileSync(infoPlistPath, "utf8"));
      expect(infoPlist.UIApplicationSceneManifest).toEqual({
        UIApplicationSupportsMultipleScenes: false,
        UISceneConfigurations: {
          UIWindowSceneSessionRoleApplication: [
            {
              UISceneConfigurationName: "Default Configuration",
              UISceneDelegateClassName: "EXExpoAppSceneDelegate",
            },
          ],
        },
      });
      const appDelegate = fs.readFileSync(appDelegatePath, "utf8");
      expect(appDelegate).toContain(
        "class AppDelegate: ExpoAppDelegate, ExpoReactNativeFactoryProvider {",
      );
      expect(appDelegate).toContain(
        "let factory = ExpoReactNativeFactory(delegate: delegate)",
      );
      expect(appDelegate).toContain("reactNativeFactory = factory");
      expect(appDelegate).not.toContain(
        "window = UIWindow(frame: UIScreen.main.bounds)",
      );
      expect(appDelegate).not.toContain("factory.startReactNative(");
      expect(fs.existsSync(generatedSourcePath)).toBe(false);
      expect(fs.readFileSync(projectPath, "utf8")).toBe(originalProject);
    },
  );

  it("preserves unrelated Info.plist configuration", async () => {
    loadProject();
    await runPlugin(undefined, {
      infoPlist: { UserConfiguredValue: "preserved" },
    });
    const infoPlist = plist.parse(fs.readFileSync(infoPlistPath, "utf8"));
    expect(infoPlist.UserConfiguredValue).toBe("preserved");
    expect(infoPlist.UIApplicationSceneManifest).toBeDefined();
  });

  it("rejects an existing scene manifest", async () => {
    loadProject();
    await expect(
      runPlugin(undefined, {
        infoPlist: {
          UIApplicationSceneManifest: {
            UIApplicationSupportsMultipleScenes: true,
          },
        },
      }),
    ).rejects.toThrow(/expo-uiscene.*UIApplicationSceneManifest/i);
  });

  it("rejects a manifest supplied by a later plugin before changing AppDelegate", async () => {
    loadProject();
    const originalAppDelegate = fs.readFileSync(appDelegatePath, "utf8");
    const originalProject = fs.readFileSync(projectPath, "utf8");
    await expect(runWithLaterManifest()).rejects.toThrow(
      /expo-uiscene.*UIApplicationSceneManifest/i,
    );
    expect(fs.readFileSync(appDelegatePath, "utf8")).toBe(originalAppDelegate);
    expect(fs.readFileSync(projectPath, "utf8")).toBe(originalProject);
    expect(fs.existsSync(generatedSourcePath)).toBe(false);
  });

  it("restores the standard SDK 57 AppDelegate when disabled", async () => {
    loadProject();
    const original = snapshotProject();
    await runPlugin({ enabled: true });
    await runPlugin({ enabled: false });
    expect(snapshotProject()).toEqual(original);
  });

  it("rejects the standard startup block when its required blank line is missing", async () => {
    loadProject((files) => {
      files["ios/HelloWorld/AppDelegate.swift"] = files[
        "ios/HelloWorld/AppDelegate.swift"
      ]
        .toString()
        .replace(
          "      launchOptions: launchOptions)\n\n    return super.application",
          "      launchOptions: launchOptions)\n    return super.application",
        );
    });
    const original = snapshotProject();
    await expect(runPlugin()).rejects.toThrow(
      /expo-uiscene.*AppDelegate.*shape/i,
    );
    expect(snapshotProject()).toEqual(original);
  });

  it("restores startup when an integration comment is inserted before return", async () => {
    loadProject();
    await runPlugin({ enabled: true });
    const appDelegate = fs
      .readFileSync(appDelegatePath, "utf8")
      .replace(
        "    return super.application",
        "    // Preserve this integration hook.\n    return super.application",
      );
    fs.writeFileSync(appDelegatePath, appDelegate);

    await runPlugin({ enabled: false });

    const restored = fs.readFileSync(appDelegatePath, "utf8");
    expect(restored).toContain("class AppDelegate: ExpoAppDelegate {");
    expect(restored).toContain(
      "window = UIWindow(frame: UIScreen.main.bounds)",
    );
    expect(restored).toContain("factory.startReactNative(");
    expect(restored).toContain("// Preserve this integration hook.");
  });

  it("does not mutate an AppDelegate declaration inside a comment", async () => {
    loadProject((files) => {
      files["ios/HelloWorld/AppDelegate.swift"] = files[
        "ios/HelloWorld/AppDelegate.swift"
      ]
        .toString()
        .replace("@main", "// class AppDelegate: ExpoAppDelegate {\n@main");
    });

    await runPlugin();

    const appDelegate = fs.readFileSync(appDelegatePath, "utf8");
    expect(appDelegate).toContain("// class AppDelegate: ExpoAppDelegate {");
    expect(appDelegate).toContain(
      "@main\nclass AppDelegate: ExpoAppDelegate, ExpoReactNativeFactoryProvider {",
    );
  });

  it("updates only the application target's nondefault Info.plist", async () => {
    loadProject();
    const appInfoPlistPath = configureNondefaultAppInfoPlistWithExtension();
    const originalProject = fs.readFileSync(projectPath, "utf8");

    await runPlugin();

    const appInfoPlist = plist.parse(fs.readFileSync(appInfoPlistPath, "utf8"));
    const extensionInfoPlist = plist.parse(
      fs.readFileSync(infoPlistPath, "utf8"),
    );
    expect(appInfoPlist.UIApplicationSceneManifest).toEqual({
      UIApplicationSupportsMultipleScenes: false,
      UISceneConfigurations: {
        UIWindowSceneSessionRoleApplication: [
          {
            UISceneConfigurationName: "Default Configuration",
            UISceneDelegateClassName: "EXExpoAppSceneDelegate",
          },
        ],
      },
    });
    expect(extensionInfoPlist.UIApplicationSceneManifest).toBeUndefined();
    expect(fs.readFileSync(projectPath, "utf8")).toBe(originalProject);
  });

  it("does not touch a user-owned scene manifest when disabled", async () => {
    loadProject((files) => {
      const infoPlist = plist.parse(
        files["ios/HelloWorld/Info.plist"].toString(),
      );
      infoPlist.UIApplicationSceneManifest = {
        UIApplicationSupportsMultipleScenes: true,
      };
      files["ios/HelloWorld/Info.plist"] = plist.build(infoPlist);
    });
    const original = snapshotProject();
    await runPlugin({ enabled: false });
    expect(snapshotProject()).toEqual(original);
  });

  it("rejects disabling partially edited plugin-owned integration", async () => {
    loadProject();
    await runPlugin({ enabled: true });
    const appDelegate = fs
      .readFileSync(appDelegatePath, "utf8")
      .replace(
        "class AppDelegate: ExpoAppDelegate, ExpoReactNativeFactoryProvider",
        "class AppDelegate: ExpoAppDelegate, UserProtocol, ExpoReactNativeFactoryProvider",
      );
    fs.writeFileSync(appDelegatePath, appDelegate);
    const beforeDisable = snapshotProject();
    await expect(runPlugin({ enabled: false })).rejects.toThrow(
      /expo-uiscene.*AppDelegate/i,
    );
    expect(snapshotProject()).toEqual(beforeDisable);
  });

  it("rejects disabling a modified plugin-owned manifest", async () => {
    loadProject();
    await runPlugin({ enabled: true });
    const infoPlist = plist.parse(fs.readFileSync(infoPlistPath, "utf8"));
    infoPlist.UIApplicationSceneManifest.UIApplicationSupportsMultipleScenes = true;
    fs.writeFileSync(infoPlistPath, plist.build(infoPlist));
    const beforeDisable = snapshotProject();

    await expect(runPlugin({ enabled: false })).rejects.toThrow(
      /expo-uiscene.*UIApplicationSceneManifest.*edited/i,
    );
    expect(snapshotProject()).toEqual(beforeDisable);
  });

  it.each([
    ["enabled", { enabled: true }],
    ["disabled", { enabled: false }],
  ] as const)("is idempotent when %s", async (_label, options) => {
    loadProject();
    await runPlugin(options);
    const once = snapshotProject();
    await runPlugin(options);
    expect(snapshotProject()).toEqual(once);
  });

  it.each(["56.0.0", "58.0.0"])(
    "rejects SDK %s with an actionable error",
    async (sdkVersion) => {
      loadProject();
      await expect(runPlugin(undefined, { sdkVersion })).rejects.toThrow(
        /expo-uiscene.*SDK 57/i,
      );
    },
  );

  it("rejects a non-Swift AppDelegate", async () => {
    loadProject((files) => {
      files["ios/HelloWorld/AppDelegate.mm"] =
        files["ios/HelloWorld/AppDelegate.swift"];
      delete files["ios/HelloWorld/AppDelegate.swift"];
      files["ios/HelloWorld.xcodeproj/project.pbxproj"] = files[
        "ios/HelloWorld.xcodeproj/project.pbxproj"
      ]
        .toString()
        .replaceAll("AppDelegate.swift", "AppDelegate.mm")
        .replaceAll("sourcecode.swift", "sourcecode.cpp.objcpp");
    });
    await expect(runPlugin()).rejects.toThrow(
      /expo-uiscene.*Swift AppDelegate/i,
    );
  });

  it("rejects an unrecognized Swift AppDelegate shape", async () => {
    loadProject((files) => {
      files["ios/HelloWorld/AppDelegate.swift"] = files[
        "ios/HelloWorld/AppDelegate.swift"
      ]
        .toString()
        .replace(
          "class AppDelegate: ExpoAppDelegate",
          "class AppDelegate: UIApplicationDelegate",
        );
    });
    await expect(runPlugin()).rejects.toThrow(
      /expo-uiscene.*AppDelegate.*shape/i,
    );
  });
});
