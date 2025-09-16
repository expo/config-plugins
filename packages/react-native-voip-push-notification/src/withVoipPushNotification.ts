import {
  type ConfigPlugin,
  withAppDelegate,
  withXcodeProject,
  withInfoPlist,
} from "@expo/config-plugins";
import {
  addSwiftImports,
  insertContentsInsideSwiftClassBlock,
  insertContentsInsideSwiftFunctionBlock,
  findSwiftFunctionCodeBlock,
  addObjcImports,
} from "@expo/config-plugins/build/ios/codeMod";
import fs from "fs";
import path from "path";

const withVoipAppDelegate: ConfigPlugin = (configuration) => {
  return withAppDelegate(configuration, (config) => {
    if (config.modResults.language !== "swift") {
      console.warn(
        "react-native-voip-push-notification: Objective-C AppDelegate not supported, use Swift",
      );

      return config;
    }

    try {
      // Add PKPushRegistryDelegate to AppDelegate class
      if (!config.modResults.contents.includes("PKPushRegistryDelegate")) {
        config.modResults.contents = config.modResults.contents.replace(
          /public class AppDelegate: ExpoAppDelegate/,
          "public class AppDelegate: ExpoAppDelegate, PKPushRegistryDelegate",
        );
      }

      addToSwiftBridgingHeaderFile(
        config.modRequest.projectRoot,
        config.modRequest.projectName,
        (headerFileContents: string) =>
          addObjcImports(headerFileContents, [
            '"RNVoipPushNotificationManager.h"',
            '"RNCallKeep.h"',
          ]),
      );

      config.modResults.contents = addSwiftImports(config.modResults.contents, [
        "PushKit",
      ]);

      config.modResults.contents = addDidFinishLaunchingWithOptionsRingingSwift(
        config.modResults.contents,
      );

      config.modResults.contents = addDidUpdatePushCredentialsSwift(
        config.modResults.contents,
      );

      config.modResults.contents = addDidReceiveIncomingPushCallbackSwift(
        config.modResults.contents,
      );

      return config;
    } catch (error) {
      throw new Error(
        `Cannot setup react-native-voip-push-notification: ${error}`,
      );
    }
  });
};

function addDidFinishLaunchingWithOptionsRingingSwift(contents: string) {
  const functionSelector = "application(_:didFinishLaunchingWithOptions:)";

  // call the setup of voip push notification
  const voipSetupMethod = "RNVoipPushNotificationManager.voipRegistration()";

  if (!contents.includes(voipSetupMethod)) {
    contents = insertContentsInsideSwiftFunctionBlock(
      contents,
      functionSelector,
      "  " /* indentation */ + voipSetupMethod,
      { position: "head" },
    );
  }

  return contents;
}

function addDidUpdatePushCredentialsSwift(contents: string) {
  const updatedPushCredentialsMethod =
    "RNVoipPushNotificationManager.didUpdate(credentials, forType: type.rawValue)";

  if (!contents.includes(updatedPushCredentialsMethod)) {
    const functionSelector = "pushRegistry(_:didUpdate:for:)";

    const codeBlock = findSwiftFunctionCodeBlock(contents, functionSelector);

    if (!codeBlock) {
      return insertContentsInsideSwiftClassBlock(
        contents,
        "class AppDelegate",
        `
    public func pushRegistry(
      _ registry: PKPushRegistry,
      didUpdate credentials: PKPushCredentials,
      for type: PKPushType
    ) {
      ${updatedPushCredentialsMethod}
    }
            `,
        { position: "tail" },
      );
    } else {
      return insertContentsInsideSwiftFunctionBlock(
        contents,
        functionSelector,
        updatedPushCredentialsMethod,
        { position: "tail" },
      );
    }
  }
  return contents;
}

function addDidReceiveIncomingPushCallbackSwift(contents: string) {
  const onIncomingPush = `
    let uuid = payload.dictionaryPayload["uuid"] as? String ?? UUID().uuidString
    let handle = payload.dictionaryPayload["handle"] as? String ?? "Unknown"
    let callerName = payload.dictionaryPayload["callerName"] as? String ?? "Unknown"
    let hasVideo = payload.dictionaryPayload["hasVideo"] as? Bool ?? true

    RNVoipPushNotificationManager.addCompletionHandler(uuid, completionHandler: completion)
    RNVoipPushNotificationManager.didReceiveIncomingPush(with: payload, forType: type.rawValue)

    RNCallKeep.reportNewIncomingCall(uuid,
                                     handle: handle,
                                     handleType: "generic",
                                     hasVideo: hasVideo,
                                     localizedCallerName: callerName,
                                     supportsHolding: false,
                                     supportsDTMF: false,
                                     supportsGrouping: false,
                                     supportsUngrouping: false,
                                     fromPushKit: true,
                                     payload: nil,
                                     withCompletionHandler: nil)`;
  if (
    !contents.includes("RNVoipPushNotificationManager.didReceiveIncomingPush")
  ) {
    const functionSelector =
      "pushRegistry(_:didReceiveIncomingPushWith:for:completion:)";

    const codeBlock = findSwiftFunctionCodeBlock(contents, functionSelector);

    if (!codeBlock) {
      return insertContentsInsideSwiftClassBlock(
        contents,
        "class AppDelegate",
        `
  public func pushRegistry(
    _ registry: PKPushRegistry,
    didReceiveIncomingPushWith payload: PKPushPayload,
    for type: PKPushType,
    completion: @escaping () -> Void
  ) {
    ${onIncomingPush}
  }
        `,
        { position: "tail" },
      );
    } else {
      return insertContentsInsideSwiftFunctionBlock(
        contents,
        functionSelector,
        onIncomingPush,
        { position: "tail" },
      );
    }
  }

  return contents;
}

function addToSwiftBridgingHeaderFile(
  projectRoot: string,
  projectName: string | undefined,
  action: (contents: string) => string,
) {
  if (!projectName) {
    console.error("No project name provided");
    return;
  }

  const bridgingHeaderPath = path.join(
    projectRoot,
    "ios",
    projectName,
    `${projectName}-Bridging-Header.h`,
  );

  if (!fs.existsSync(bridgingHeaderPath)) {
    console.error(`File not found at: ${bridgingHeaderPath}`);
    return;
  }

  const bridgingHeaderContents = fs.readFileSync(bridgingHeaderPath, "utf8");
  const newBridgingHeaderContents = action(bridgingHeaderContents);

  fs.writeFileSync(bridgingHeaderPath, newBridgingHeaderContents);
}

const withDisabledPrecompileBridgingHeader: ConfigPlugin = (config) => {
  return withXcodeProject(config, (config) => {
    const xcodeProject = config.modResults;

    const configurations = xcodeProject.pbxXCBuildConfigurationSection();

    for (const key in configurations) {
      if (typeof configurations[key].buildSettings !== "undefined") {
        const buildSettings = configurations[key].buildSettings;

        buildSettings.SWIFT_PRECOMPILE_BRIDGING_HEADER = "NO";
      }
    }

    return config;
  });
};

const withVoipBackgroundModes: ConfigPlugin = (config) => {
  return withInfoPlist(config, (config) => {
    if (!config.modResults.UIBackgroundModes) {
      config.modResults.UIBackgroundModes = [];
    }

    if (!config.modResults.UIBackgroundModes.includes("voip")) {
      config.modResults.UIBackgroundModes.push("voip");
    }

    return config;
  });
};

const withVoipPushNotification: ConfigPlugin = (config) => {
  config = withDisabledPrecompileBridgingHeader(config);
  config = withVoipBackgroundModes(config);
  config = withVoipAppDelegate(config);
  return config;
};

export default withVoipPushNotification;
