import { getFixture } from "../../../../fixtures/getFixtures";
import {
  addQuickActionsAppDelegateImport,
  addQuickActionsAppDelegateInit,
} from "../withReactNativeQuickActions";

const ExpoModulesAppDelegate = getFixture("AppDelegate.mm");

describe(addQuickActionsAppDelegateInit, () => {
  it(`adds init to Expo Modules AppDelegate`, () => {
    const results = addQuickActionsAppDelegateInit(ExpoModulesAppDelegate);
    // matches a static snapshot
    expect(results.contents).toMatchSnapshot();
    expect(results.contents).toMatch(/RNQuickActionManager/);
    expect(results.contents).toMatch(/application:application/);
    // did add new content
    expect(results.didMerge).toBe(true);
    // didn't remove old content
    expect(results.didClear).toBe(false);
  });
  it(`fails to add to a malformed app delegate`, () => {
    expect(() => addQuickActionsAppDelegateInit(`foobar`)).toThrow(/foobar/);
  });
});

describe(addQuickActionsAppDelegateImport, () => {
  it(`adds import to Expo Modules AppDelegate`, () => {
    const results = addQuickActionsAppDelegateImport(ExpoModulesAppDelegate);
    // matches a static snapshot
    expect(results.contents).toMatchSnapshot();
    expect(results.contents).toMatch(/RNQuickActionManager/);
    // did add new content
    expect(results.didMerge).toBe(true);
    // didn't remove old content
    expect(results.didClear).toBe(false);
  });

  it(`fails to add to a malformed app delegate`, () => {
    expect(() => addQuickActionsAppDelegateImport(`foobar`)).toThrow(/foobar/);
  });
});
