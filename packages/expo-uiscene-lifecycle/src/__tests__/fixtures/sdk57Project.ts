import plist from "@expo/plist";
import path from "path";

const fs = jest.requireActual("fs") as typeof import("fs");
const templateRoot = path.join(__dirname, "sdk57-template");

const sdk57AppDelegate = `internal import Expo
import React
import ReactAppDependencyProvider

@main
class AppDelegate: ExpoAppDelegate {
  var window: UIWindow?

  var reactNativeDelegate: ExpoReactNativeFactoryDelegate?
  var reactNativeFactory: RCTReactNativeFactory?

  public override func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    let delegate = ReactNativeDelegate()
    let factory = ExpoReactNativeFactory(delegate: delegate)
    delegate.dependencyProvider = RCTAppDependencyProvider()

    reactNativeDelegate = delegate
    reactNativeFactory = factory

    window = UIWindow(frame: UIScreen.main.bounds)
    factory.startReactNative(
      withModuleName: "main",
      in: window,
      launchOptions: launchOptions)

    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }
}

class ReactNativeDelegate: ExpoReactNativeFactoryDelegate {
  override func sourceURL(for bridge: RCTBridge) -> URL? {
    bridge.bundleURL ?? bundleURL()
  }

  override func bundleURL() -> URL? {
#if DEBUG
    return RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: ".expo/.virtual-metro-entry")
#else
    return Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }
}
`;

export default function getSdk57Project(): Record<string, string | Buffer> {
  const files: Record<string, string | Buffer> = {};

  function readEntry(relativePath: string) {
    const absolutePath = path.join(templateRoot, relativePath);
    if (fs.statSync(absolutePath).isDirectory()) {
      for (const child of fs.readdirSync(absolutePath)) {
        readEntry(path.join(relativePath, child));
      }
      return;
    }
    files[relativePath] = fs.readFileSync(absolutePath);
  }

  readEntry("ios");

  files["ios/HelloWorld/AppDelegate.swift"] = sdk57AppDelegate;
  delete files["ios/HelloWorld/SceneDelegate.swift"];

  const infoPlistPath = "ios/HelloWorld/Info.plist";
  const infoPlist = plist.parse(files[infoPlistPath].toString());
  delete infoPlist.UIApplicationSceneManifest;
  files[infoPlistPath] = plist.build(infoPlist);

  const projectPath = "ios/HelloWorld.xcodeproj/project.pbxproj";
  files[projectPath] = files[projectPath]
    .toString()
    .split("\n")
    .filter((line) => !line.includes("SceneDelegate.swift"))
    .join("\n");

  return files;
}
