import { getFixture } from "../../../../fixtures/getFixtures";
import { addGoogleCastAppDelegateDidFinishLaunchingWithOptions } from "../withIosGoogleCast";

describe(addGoogleCastAppDelegateDidFinishLaunchingWithOptions, () => {
  it(`adds maps import to Expo Modules SDK 48 AppDelegate`, () => {
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
