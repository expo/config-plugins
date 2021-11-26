import { WarningAggregator } from "@expo/config-plugins";
import { setMinBuildScriptExtVersion } from "../withBuildScriptExtMinimumVersion";

const EXAMPLE_PROJECT_BUILD_GRADLE = `
buildscript {
    ext {
        buildToolsVersion = "29.0.3"
        minSdkVersion = 21
        compileSdkVersion = 30
        targetSdkVersion = 30
        oddFormat = 30.2
    }
    repositories {
    }
    dependencies {
    }
}

allprojects {
    repositories {
        mavenLocal()
        maven {
            // Android JSC is installed from npm
            url(new File(["node", "--print", "require.resolve('jsc-android/package.json')"].execute(null, rootDir).text.trim(), "../dist"))
        }
    }
}
`;

describe(setMinBuildScriptExtVersion, () => {
  beforeEach(() => {
    // @ts-ignore: jest
    // eslint-disable-next-line import/namespace
    WarningAggregator.addWarningAndroid = jest.fn();
  });

  it(`sets the minSdkVersion in build.gradle if minSdkVersion is given`, () => {
    expect(
      setMinBuildScriptExtVersion(EXAMPLE_PROJECT_BUILD_GRADLE, {
        name: "minSdkVersion",
        minVersion: 22,
      })
    ).toMatch(/minSdkVersion = 22/);
    expect(WarningAggregator.addWarningAndroid).not.toHaveBeenCalled();
  });

  it(`sets the oddFormat in build.gradle if oddFormat is given`, () => {
    expect(
      setMinBuildScriptExtVersion(EXAMPLE_PROJECT_BUILD_GRADLE, {
        name: "oddFormat",
        minVersion: 30.3,
      })
    ).toMatch(/oddFormat = 30\.3/);
    expect(WarningAggregator.addWarningAndroid).not.toHaveBeenCalled();
  });
  it(`does not change the compileSdkVersion in build.gradle if compileSdkVersion is lower than the existing value`, () => {
    expect(
      setMinBuildScriptExtVersion(EXAMPLE_PROJECT_BUILD_GRADLE, {
        name: "compileSdkVersion",
        minVersion: 12,
      })
    ).toBe(EXAMPLE_PROJECT_BUILD_GRADLE);
    expect(WarningAggregator.addWarningAndroid).not.toHaveBeenCalled();
  });
  it(`warns when it cannot find the requested value`, () => {
    expect(
      setMinBuildScriptExtVersion(EXAMPLE_PROJECT_BUILD_GRADLE, {
        name: "foobar",
        minVersion: 12,
      })
    ).toBe(EXAMPLE_PROJECT_BUILD_GRADLE);
    expect(WarningAggregator.addWarningAndroid).toBeCalledWith(
      "withBuildScriptExtVersion",
      'Cannot set minimum buildscript.ext.foobar version because the property "foobar" cannot be found or does not have a numeric value.'
    );
  });
  it(`does warns when targeting a property with a string value`, () => {
    expect(
      setMinBuildScriptExtVersion(EXAMPLE_PROJECT_BUILD_GRADLE, {
        name: "buildToolsVersion",
        minVersion: 12,
      })
    ).toBe(EXAMPLE_PROJECT_BUILD_GRADLE);
    expect(WarningAggregator.addWarningAndroid).toBeCalledWith(
      "withBuildScriptExtVersion",
      'Cannot set minimum buildscript.ext.buildToolsVersion version because the property "buildToolsVersion" cannot be found or does not have a numeric value.'
    );
  });
});
