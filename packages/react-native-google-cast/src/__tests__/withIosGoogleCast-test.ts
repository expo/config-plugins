import { getFixture } from "../../../../fixtures/getFixtures";
import {
  addGoogleCastAppDelegateDidFinishLaunchingWithOptions,
  MATCH_INIT,
} from "../withIosGoogleCast";

describe("MATCH_INIT", () => {
  it(`matches unimodules projects`, () => {
    expect(
      `self.moduleRegistryAdapter = [[UMModuleRegistryAdapter alloc] initWithModuleRegistryProvider:[[UMModuleRegistryProvider alloc] init]];`
    ).toMatch(MATCH_INIT);
    // wrapped
    expect(
      `self.moduleRegistryAdapter = [[UMModuleRegistryAdapter alloc]`
    ).toMatch(MATCH_INIT);
    // short hand
    expect(`_moduleRegistryAdapter=[[UMModuleRegistryAdapter alloc]`).toMatch(
      MATCH_INIT
    );
    // any name
    expect(`_mo=[[UMModuleRegistryAdapter alloc]`).toMatch(MATCH_INIT);
  });
  it(`matches RN projects`, () => {
    expect(
      `RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];`
    ).toMatch(MATCH_INIT);
    // wrapped
    expect(`RCTBridge*bri=[[RCTBridge alloc]`).toMatch(MATCH_INIT);
  });
  it(`matches React AppDelegate`, () => {
    expect(
      `RCTBridge *bridge = [self.reactDelegate createBridgeWithDelegate:self launchOptions:launchOptions];`
    ).toMatch(MATCH_INIT);
  });
});

describe(addGoogleCastAppDelegateDidFinishLaunchingWithOptions, () => {
  it(`adds maps import to Expo Modules SDK 44 AppDelegate`, () => {
    const results = addGoogleCastAppDelegateDidFinishLaunchingWithOptions(
      getFixture("AppDelegate.mm"),
      {
        receiverAppId: "foobar-bacon",
      }
    );
    // matches a static snapshot
    expect(results.contents).toMatchSnapshot();
    expect(results.contents).toMatch(/foobar-bacon/);
    // did add new content
    expect(results.didMerge).toBe(true);
    // didn't remove old content
    expect(results.didClear).toBe(false);
  });

  it(`fails to add to a malformed app delegate`, () => {
    expect(() =>
      addGoogleCastAppDelegateDidFinishLaunchingWithOptions(`foobar`, {})
    ).toThrow(/foobar/);
  });
});
