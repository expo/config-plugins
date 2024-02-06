import { getFixture } from "../../../../fixtures/getFixtures";
import { addPackageName } from "../withAndroidFFMPEGPackage";

describe(addPackageName, () => {
  it(`adds undefined package`, () => {
    expect(
      addPackageName(getFixture("build.gradle"), undefined),
    ).toMatchSnapshot();
  });
  it(`redefines the package`, () => {
    let value = addPackageName(getFixture("build.gradle"), "video");
    value = addPackageName(value, "audio");
    value = addPackageName(value, undefined);
    value = addPackageName(value, "min");
    expect(value).toMatchSnapshot();
  });
});
