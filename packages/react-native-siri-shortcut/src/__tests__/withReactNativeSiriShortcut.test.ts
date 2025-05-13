import { getFixture } from "../../../../fixtures/getFixtures";
import {
  addSiriShortcutAppDelegateImport,
  addSiriShortcutAppDelegateInit,
  addSiriShortcutBridgingHeaderImport,
} from "../withReactNativeSiriShortcut";

const BridgingHeader = getFixture("app-Bridging-Header.h");
const ExpoModulesAppDelegate = getFixture("AppDelegate.mm");
const ExpoModulesSwiftAppDelegate = getFixture("AppDelegate.swift");

describe(addSiriShortcutBridgingHeaderImport, () => {
  it(`adds import to swift Expo Modules AppDelegate`, () => {
    const results = addSiriShortcutBridgingHeaderImport(BridgingHeader);
    // matches a static snapshot
    expect(results.contents).toMatchSnapshot();
    expect(results.contents).toMatch(/react-native-siri-shortcut/);
    expect(results.contents).toMatch(/RNSiriShortcuts\/RNSiriShortcuts\.h/);
    // did add new content
    expect(results.didMerge).toBe(true);
    // didn't remove old content
    expect(results.didClear).toBe(false);
  });
});

describe(addSiriShortcutAppDelegateImport, () => {
  it(`adds import to swift Expo Modules AppDelegate`, () => {
    expect(
      addSiriShortcutAppDelegateImport(ExpoModulesSwiftAppDelegate, "swift")
    ).toBe(null);
  });

  it(`adds import to objcpp Expo Modules AppDelegate`, () => {
    const results = addSiriShortcutAppDelegateImport(
      ExpoModulesAppDelegate,
      "objcpp"
    )!;
    // matches a static snapshot
    expect(results.contents).toMatchSnapshot();
    expect(results.contents).toMatch(/react-native-siri-shortcut/);
    expect(results.contents).toMatch(/RNSiriShortcuts\/RNSiriShortcuts\.h/);
    // did add new content
    expect(results.didMerge).toBe(true);
    // didn't remove old content
    expect(results.didClear).toBe(false);
  });

  it(`fails to add to a malformed app delegate`, () => {
    expect(() => addSiriShortcutAppDelegateImport(`foobar`, "objcpp")).toThrow(
      /foobar/
    );
  });
});
describe(addSiriShortcutAppDelegateInit, () => {
  it(`adds init to swift Expo Modules AppDelegate`, () => {
    const results = addSiriShortcutAppDelegateInit(
      ExpoModulesSwiftAppDelegate,
      "swift"
    );
    // matches a static snapshot
    expect(results.contents).toMatchSnapshot();
    expect(results.contents).toMatch(/react-native-siri-shortcut-delegate/);

    // did add new content
    expect(results.didMerge).toBe(true);
    // didn't remove old content
    expect(results.didClear).toBe(false);
  });
  it(`adds init to objcpp Expo Modules AppDelegate`, () => {
    const results = addSiriShortcutAppDelegateInit(
      ExpoModulesAppDelegate,
      "objcpp"
    );
    // matches a static snapshot
    expect(results.contents).toMatchSnapshot();
    expect(results.contents).toMatch(/react-native-siri-shortcut-delegate/);
    expect(results.contents).toMatch(
      /RNSSSiriShortcuts application:application/
    );
    // did add new content
    expect(results.didMerge).toBe(true);
    // didn't remove old content
    expect(results.didClear).toBe(false);
  });

  it(`fails to add to a malformed app delegate`, () => {
    expect(() => addSiriShortcutAppDelegateInit(`foobar`, "objcpp")).toThrow(
      /foobar/
    );
  });
});
