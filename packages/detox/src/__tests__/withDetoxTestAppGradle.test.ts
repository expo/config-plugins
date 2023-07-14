import { getFixture } from "../../../../fixtures/getFixtures";
import { setGradleAndroidTestImplementation } from "../withDetoxTestAppGradle";

describe(setGradleAndroidTestImplementation, () => {
  it(`appends`, () => {
    const result = setGradleAndroidTestImplementation(
      getFixture("app-build.gradle")
    );
    expect(result).toContain("androidTestImplementation('com.wix:detox:+')");
    expect(result).toContain(
      "implementation 'androidx.appcompat:appcompat:1.6.1'"
    );
    expect(result).toMatchSnapshot();
  });
});
