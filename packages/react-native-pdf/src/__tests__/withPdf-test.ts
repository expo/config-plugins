import { addAndroidPackagingOptions } from "../withPdf";

describe(addAndroidPackagingOptions, () => {
  it(`adds packaging options to the app build.gradle`, () => {
    const result = addAndroidPackagingOptions(`
      android {
          defaultConfig {
              applicationId 'com.example.app'
          }
      }
  `);
    expect(result.contents).toMatchSnapshot();
    expect(result.didMerge).toBe(true);
    expect(result.didClear).toBe(false);

    const secondResults = addAndroidPackagingOptions(result.contents);

    expect(secondResults.contents).toBe(result.contents);
    expect(secondResults.didMerge).toBe(false);
    expect(secondResults.didClear).toBe(false);
  });
});
