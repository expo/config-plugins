const iosName = "app";
const emulator = process.env.CI ? "app" : "Pixel_3a_API_30";
const simulator = "iPhone 11 Pro";
const derivedDataPath = "ios/build";
const sdk = "iphonesimulator";

module.exports = {
  testRunner: "jest",
  runnerConfig: require.resolve("./e2e/jest.config.js"),
  specs: "e2e",
  behavior: {
    init: {
      exposeGlobals: false,
    },
  },
  apps: {
    "ios.release": {
      type: "ios.app",
      binaryPath: `${derivedDataPath}/Build/Products/Release-${sdk}/${iosName}.app`,
      build: `export RCT_NO_LAUNCH_PACKAGER=true && xcodebuild -workspace ios/${iosName}.xcworkspace -scheme ${iosName} -configuration Release -sdk ${sdk} -derivedDataPath ${derivedDataPath} | npx excpretty ./`,
    },
    "ios.debug": {
      type: "ios.app",
      binaryPath: `${derivedDataPath}/Build/Products/Debug-${sdk}/${iosName}.app`,
      build: `xcodebuild -workspace ios/${iosName}.xcworkspace -scheme ${iosName} -configuration Debug -sdk ${sdk} -derivedDataPath ${derivedDataPath} | npx excpretty ./`,
    },
    "android.debug": {
      type: "android.apk",
      binaryPath: "android/app/build/outputs/apk/debug/app-debug.apk",
      build:
        "pushd android; ./gradlew app:assembleDebug app:assembleAndroidTest -DtestBuildType=debug; popd",
    },
    "android.release": {
      type: "android.apk",
      binaryPath: "android/app/build/outputs/apk/release/app-release.apk",
      build:
        "pushd android; ./gradlew app:assembleRelease app:assembleAndroidTest -DtestBuildType=release; popd",
    },
  },
  devices: {
    simulator: {
      type: "ios.simulator",
      device: {
        type: simulator,
      },
    },
    emulator: {
      type: "android.emulator",
      device: {
        avdName: emulator,
      },
    },
  },
  configurations: {
    "ios.sim.release": {
      device: "simulator",
      app: "ios.release",
    },
    "ios.sim.debug": {
      device: "simulator",
      app: "ios.debug",
    },
    "android.emu.debug": {
      device: "emulator",
      app: "android.debug",
    },
    "android.emu.release": {
      device: "emulator",
      app: "android.release",
    },
  },
};
