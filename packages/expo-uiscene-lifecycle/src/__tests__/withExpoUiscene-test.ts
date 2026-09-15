import plist from "@expo/plist";
import type { ExpoConfig } from "expo/config";
import { compileModsAsync } from "expo/config-plugins";
import fs from "fs";
import { vol } from "memfs";

import withExpoUIScene from "..";
import getSdk57ProjectWithoutUISceneLifecycle from "./fixtures/sdk57ProjectWithoutUISceneLifecycle";

jest.mock("fs");

const projectRoot = "/app";
const appDelegatePath = "/app/ios/HelloWorld/AppDelegate.swift";
const infoPlistPath = "/app/ios/HelloWorld/Info.plist";

function loadProject() {
  vol.fromJSON(getSdk57ProjectWithoutUISceneLifecycle(), projectRoot);
}

async function runPlugin(enabled = true, sdkVersion = "57.0.23") {
  let config: ExpoConfig = {
    name: "HelloWorld",
    slug: "hello-world",
    sdkVersion,
    _internal: { projectRoot },
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

    expect(fs.readFileSync(appDelegatePath, "utf8")).toBe(
      originalAppDelegate
        .replace(
          "class AppDelegate: ExpoAppDelegate {",
          "class AppDelegate: ExpoAppDelegate, ExpoReactNativeFactoryProvider {",
        )
        .replace(
          `\n    window = UIWindow(frame: UIScreen.main.bounds)\n    factory.startReactNative(\n      withModuleName: "main",\n      in: window,\n      launchOptions: launchOptions)\n`,
          "",
        ),
    );
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

  it("requires Expo >=57.0.23 <58.0.0", async () => {
    loadProject();
    await expect(runPlugin(true, "57.0.23")).resolves.toBeDefined();
    await expect(runPlugin(true, "57.0.22")).rejects.toThrow(/57\.0\.23/);
    await expect(runPlugin(true, "58.0.0")).rejects.toThrow(/SDK 57 only/);
  });
});
