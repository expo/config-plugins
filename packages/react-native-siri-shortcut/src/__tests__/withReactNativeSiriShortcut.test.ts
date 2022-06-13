import {
  addSiriShortcutAppDelegateImport,
  addSiriShortcutAppDelegateInit,
} from "../withReactNativeSiriShortcut";
import { ExpoModulesAppDelegate } from "./fixtures/AppDelegate";

describe(addSiriShortcutAppDelegateImport, () => {
  it(`adds import to Expo Modules AppDelegate`, () => {
    const results = addSiriShortcutAppDelegateImport(ExpoModulesAppDelegate);
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
    expect(() => addSiriShortcutAppDelegateImport(`foobar`)).toThrow(/foobar/);
  });
});
describe(addSiriShortcutAppDelegateInit, () => {
  it(`adds init to Expo Modules AppDelegate`, () => {
    const results = addSiriShortcutAppDelegateInit(ExpoModulesAppDelegate);
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
    expect(() => addSiriShortcutAppDelegateInit(`foobar`)).toThrow(/foobar/);
  });
});
