import { getFixture } from "../../../../fixtures/getFixtures";
import {
  addSwiftFeatureFlagOverrideCall,
  generateFeatureFlagOverrideHeaderIOS,
  generateFeatureFlagOverrideSourceIOS,
} from "../withReactNativeFeatureFlags";

const SwiftAppDelegate = getFixture("AppDelegate.swift");

const nativeFlagOverrides = {
  fuseboxFrameRecordingEnabled: true,
  enableMicrotasks: false,
};

describe("withReactNativeFeatureFlagsIOS", () => {
  test("generates RNFeatureFlagsOverride.h", () => {
    const header = generateFeatureFlagOverrideHeaderIOS();
    expect(header).toMatchSnapshot();
    expect(header).toContain("void RNFeatureFlagsOverride_apply(void);");
  });

  test("generates RNFeatureFlagsOverride.mm", () => {
    const source = generateFeatureFlagOverrideSourceIOS(nativeFlagOverrides);
    expect(source).toMatchSnapshot();
    expect(source).toContain("ReactNativeFeatureFlagsOverridesOSSStable");
    expect(source).toContain(
      "bool fuseboxFrameRecordingEnabled() override { return true; }",
    );
    expect(source).toContain(
      "bool enableMicrotasks() override { return false; }",
    );
    expect(source).toContain("RNFeatureFlagsOverride_apply");
  });

  test("inserts override call into Swift AppDelegate", () => {
    const result = addSwiftFeatureFlagOverrideCall(SwiftAppDelegate);
    expect(result).toMatchSnapshot();
    expect(result).toContain("RNFeatureFlagsOverride_apply()");
  });

  test("is idempotent on repeated runs", () => {
    const firstPass = addSwiftFeatureFlagOverrideCall(SwiftAppDelegate);
    const secondPass = addSwiftFeatureFlagOverrideCall(firstPass);
    expect(secondPass).toBe(firstPass);
  });
});
