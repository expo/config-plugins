import { getFixture } from "../../../../fixtures/getFixtures";
import { addMainApplicationFeatureFlagOverrides } from "../withReactNativeFeatureFlags";

const MainApplication = getFixture("MainApplication.kt");

const nativeFlagOverrides = {
  fuseboxFrameRecordingEnabled: true,
  enableMicrotasks: false,
};

describe("withReactNativeFeatureFlagsAndroid", () => {
  test("adds imports and override to MainApplication.kt", () => {
    const result = addMainApplicationFeatureFlagOverrides(
      MainApplication,
      nativeFlagOverrides,
    );
    expect(result).toMatchSnapshot();
    expect(result).toContain("ReactNativeNewArchitectureFeatureFlagsDefaults");
  });

  test("is idempotent on repeated runs", () => {
    const firstPass = addMainApplicationFeatureFlagOverrides(
      MainApplication,
      nativeFlagOverrides,
    );
    const secondPass = addMainApplicationFeatureFlagOverrides(
      firstPass,
      nativeFlagOverrides,
    );
    expect(secondPass).toBe(firstPass);
  });
});
