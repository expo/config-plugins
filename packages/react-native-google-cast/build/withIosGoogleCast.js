"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addGoogleCastAppDelegateDidFinishLaunchingWithOptions = exports.MATCH_INIT = exports.withIosGoogleCast = void 0;
const config_plugins_1 = require("@expo/config-plugins");
const generateCode_1 = require("@expo/config-plugins/build/utils/generateCode");
/**
 * In Xcode, go to Signing & Capabilities, click + Capability and select Access WiFi Information. (This is required since iOS 12.)
 * Note that "Wireless Accessory Configuration" is unrelated.
 *
 * @param {*} config
 * @returns
 */
const withIosWifiEntitlements = (config) => {
    return config_plugins_1.withEntitlementsPlist(config, (config) => {
        config.modResults["com.apple.developer.networking.wifi-info"] = true;
        return config;
    });
};
const LOCAL_NETWORK_USAGE = "${PRODUCT_NAME} uses the local network to discover Cast-enabled devices on your WiFi network";
// const BLUETOOTH_ALWAYS_USAGE =
//   "${PRODUCT_NAME} uses Bluetooth to discover nearby Cast devices";
// const BLUETOOTH_PERIPHERAL_USAGE =
//   "${PRODUCT_NAME} uses Bluetooth to discover nearby Cast devices";
// const MICROPHONE_USAGE =
//   "${PRODUCT_NAME} uses microphone access to listen for ultrasonic tokens when pairing with nearby Cast devices";
/**
 * On iOS, a dialog asking the user for the local network permission will now be displayed immediately when the app is opened.
 *
 * @param {*} config
 * @param {*} props.receiverAppId If using a custom receiver, make sure to replace `CC1AD845` with your custom receiver app id.
 * @returns
 */
const withIosLocalNetworkPermissions = (config, { receiverAppId = "CC1AD845" } = {}) => {
    return config_plugins_1.withInfoPlist(config, (config) => {
        if (!Array.isArray(config.modResults.NSBonjourServices)) {
            config.modResults.NSBonjourServices = [];
        }
        // Add required values
        config.modResults.NSBonjourServices.push("_googlecast._tcp", `_${receiverAppId}._googlecast._tcp`);
        // Remove duplicates
        config.modResults.NSBonjourServices = [
            ...new Set(config.modResults.NSBonjourServices),
        ];
        // For iOS 14+, you need to add local network permissions to Info.plist:
        // https://developers.google.com/cast/docs/ios_sender/ios_permissions_changes#updating_your_app_on_ios_14
        config.modResults.NSLocalNetworkUsageDescription =
            config.modResults.NSLocalNetworkUsageDescription || LOCAL_NETWORK_USAGE;
        return config;
    });
};
// const withIosGuestMode: ConfigPlugin = (config) => {
//   return withInfoPlist(config, (config) => {
//     config.modResults.NSBluetoothAlwaysUsageDescription =
//       config.modResults.NSBluetoothAlwaysUsageDescription ||
//       BLUETOOTH_ALWAYS_USAGE;
//     config.modResults.NSBluetoothPeripheralUsageDescription =
//       config.modResults.NSBluetoothPeripheralUsageDescription ||
//       BLUETOOTH_PERIPHERAL_USAGE;
//     config.modResults.NSMicrophoneUsageDescription =
//       config.modResults.NSMicrophoneUsageDescription || MICROPHONE_USAGE;
//     return config;
//   });
// };
// TODO: Use AppDelegate swizzling
const withIosAppDelegateLoaded = (config, props) => {
    return config_plugins_1.withAppDelegate(config, (config) => {
        if (!["objc", "objcpp"].includes(config.modResults.language)) {
            throw new Error("react-native-google-cast config plugin does not support AppDelegate' that aren't Objective-C(++) yet.");
        }
        config.modResults.contents =
            addGoogleCastAppDelegateDidFinishLaunchingWithOptions(config.modResults.contents, props).contents;
        config.modResults.contents = addGoogleCastAppDelegateImport(config.modResults.contents).contents;
        return config;
    });
};
const withIosGoogleCast = (config, props) => {
    config = withIosWifiEntitlements(config);
    config = withIosLocalNetworkPermissions(config, {
        receiverAppId: props.receiverAppId,
    });
    config = withIosAppDelegateLoaded(config, {
        receiverAppId: props.receiverAppId,
        // disableDiscoveryAutostart?: boolean;
        // startDiscoveryAfterFirstTapOnCastButton?: boolean;
    });
    // TODO
    //   config = withIosGuestMode(config)
    return config;
};
exports.withIosGoogleCast = withIosGoogleCast;
// From expo-cli RNMaps setup
exports.MATCH_INIT = /(?:(self\.|_)(\w+)\s?=\s?\[\[UMModuleRegistryAdapter alloc\])|(?:RCTBridge\s?\*\s?(\w+)\s?=\s?\[\[RCTBridge alloc\])|(\[self\.reactDelegate createBridgeWithDelegate:self launchOptions:launchOptions\])/g;
function addGoogleCastAppDelegateDidFinishLaunchingWithOptions(src, { receiverAppId = null, disableDiscoveryAutostart = false, startDiscoveryAfterFirstTapOnCastButton = true, } = {}) {
    let newSrc = [];
    newSrc.push(
    // For extra safety
    "#if __has_include(<GoogleCast/GoogleCast.h>)", 
    // TODO: This should probably read safely from a static file like the Info.plist
    `  NSString *receiverAppID = ${receiverAppId
        ? `@"${receiverAppId}"`
        : "kGCKDefaultMediaReceiverApplicationID"};`, "  GCKDiscoveryCriteria *criteria = [[GCKDiscoveryCriteria alloc] initWithApplicationID:receiverAppID];", "  GCKCastOptions* options = [[GCKCastOptions alloc] initWithDiscoveryCriteria:criteria];", 
    // TODO: Same as above, read statically
    // `  options.disableDiscoveryAutostart = ${String(!!disableDiscoveryAutostart)};`,
    `  options.startDiscoveryAfterFirstTapOnCastButton = ${String(!!startDiscoveryAfterFirstTapOnCastButton)};`, "  [GCKCastContext setSharedInstanceWithOptions:options];", "#endif");
    newSrc = newSrc.filter(Boolean);
    return generateCode_1.mergeContents({
        tag: "react-native-google-cast-didFinishLaunchingWithOptions",
        src,
        newSrc: newSrc.join("\n"),
        anchor: exports.MATCH_INIT,
        offset: 0,
        comment: "//",
    });
}
exports.addGoogleCastAppDelegateDidFinishLaunchingWithOptions = addGoogleCastAppDelegateDidFinishLaunchingWithOptions;
function addGoogleCastAppDelegateImport(src) {
    const newSrc = [];
    newSrc.push("#if __has_include(<GoogleCast/GoogleCast.h>)", "#import <GoogleCast/GoogleCast.h>", "#endif");
    return generateCode_1.mergeContents({
        tag: "react-native-google-cast-import",
        src,
        newSrc: newSrc.join("\n"),
        anchor: /#import "AppDelegate\.h"/,
        offset: 1,
        comment: "//",
    });
}
