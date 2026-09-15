import plist from "@expo/plist";
import type { ExpoConfig } from "expo/config";
import { compileModsAsync } from "expo/config-plugins";
import fs from "fs";
import { vol } from "memfs";

import withExpoUIScene, { assertSdk57 } from "..";
import getSdk57ProjectWithoutUISceneLifecycle from "./fixtures/sdk57ProjectWithoutUISceneLifecycle";

jest.mock("fs");
jest.mock("expo/package.json", () => ({ version: "57.0.23" }), {
  virtual: true,
});

const projectRoot = "/app";
const appDelegatePath = "/app/ios/HelloWorld/AppDelegate.swift";
const infoPlistPath = "/app/ios/HelloWorld/Info.plist";

function loadProject() {
  vol.fromJSON(getSdk57ProjectWithoutUISceneLifecycle(), projectRoot);
}

async function runPlugin(enabled = true) {
  let config: ExpoConfig = {
    name: "HelloWorld",
    slug: "hello-world",
    _internal: { projectRoot } as ExpoConfig["_internal"],
  };
  config = withExpoUIScene(config, { enabled });
  return compileModsAsync(config, {
    projectRoot,
    platforms: ["ios"],
    assertMissingModProviders: false,
  });
}

describe(withExpoUIScene, () => {
  afterEach(() => vol.reset());

  it("updates AppDelegate.swift and Info.plist", async () => {
    loadProject();
    const originalAppDelegate = fs.readFileSync(appDelegatePath, "utf8");
    const originalInfoPlist = fs.readFileSync(infoPlistPath, "utf8");

    await runPlugin();

    const updatedAppDelegate = fs.readFileSync(appDelegatePath, "utf8");
    expect(updatedAppDelegate).toBe(
      originalAppDelegate
        .replace(
          "class AppDelegate: ExpoAppDelegate {",
          "class AppDelegate: ExpoAppDelegate, ExpoReactNativeFactoryProvider {",
        )
        .replace(
          `\n#if os(iOS) || os(tvOS)\n    window = UIWindow(frame: UIScreen.main.bounds)\n    factory.startReactNative(\n      withModuleName: "main",\n      in: window,\n      launchOptions: launchOptions)\n#endif\n`,
          "",
        ),
    );
    expect(updatedAppDelegate).not.toContain("#if os(iOS) || os(tvOS)");
    expect(updatedAppDelegate).not.toContain("#endif");

    expect(plist.parse(fs.readFileSync(infoPlistPath, "utf8"))).toEqual({
      ...plist.parse(originalInfoPlist),
      UIApplicationSceneManifest: {
        UIApplicationSupportsMultipleScenes: false,
        UISceneConfigurations: {
          UIWindowSceneSessionRoleApplication: [
            {
              UISceneConfigurationName: "Default Configuration",
              UISceneDelegateClassName: "EXExpoAppSceneDelegate",
            },
          ],
        },
      },
    });
  });

  it("restores AppDelegate.swift and Info.plist when disabled", async () => {
    loadProject();
    const originalAppDelegate = fs.readFileSync(appDelegatePath, "utf8");
    const originalInfoPlist = fs.readFileSync(infoPlistPath, "utf8");

    await runPlugin();
    await runPlugin(false);

    expect(fs.readFileSync(appDelegatePath, "utf8")).toBe(originalAppDelegate);
    expect(fs.readFileSync(infoPlistPath, "utf8")).toBe(originalInfoPlist);
  });
});

describe(assertSdk57, () => {
  it("accepts 57.0.23 through <58.0.0", () => {
    expect(() => assertSdk57("57.0.23")).not.toThrow();
    expect(() => assertSdk57("57.1.4")).not.toThrow();
    expect(() => assertSdk57("57.99.99")).not.toThrow();
  });

  it("rejects anything below 57.0.23, including other 57.0.x patches", () => {
    expect(() => assertSdk57("57.0.0")).toThrow(/57\.0\.23/);
    expect(() => assertSdk57("57.0.22")).toThrow(/57\.0\.23/);
  });

  it("rejects SDK 58 and newer", () => {
    expect(() => assertSdk57("58.0.0")).toThrow(/SDK 57 only/);
    expect(() => assertSdk57("59.0.0")).toThrow(/SDK 57 only/);
  });

  it("rejects a missing/undefined version", () => {
    expect(() => assertSdk57(undefined)).toThrow(/SDK 57 only/);
  });
});
