import { by, device, element, expect } from "detox";
import * as path from "path";

import { createCapture } from "../lib";

const projectRoot = path.resolve(__dirname, "../../");

// https://developer.apple.com/library/archive/documentation/MacOSX/Conceptual/BPInternational/LanguageandLocaleIDs/LanguageandLocaleIDs.html
const languages = [
  "en-US",
  // "nl-NL", "zh-CN"
];

for (const locale of languages) {
  const { captureAsync, resetAppAsync } = createCapture({
    projectRoot,
    locale,
  });

  describe(locale, () => {
    beforeAll(resetAppAsync);

    beforeEach(async () => {
      await device.reloadReactNative();
    });

    it("should have welcome screen", async () => {
      // await expect(element(by.id("welcome"))).toBeVisible();
      await captureAsync();
    });

    xit("should show hello screen after tap", async () => {
      await element(by.id("hello_button")).tap();
      await captureAsync();
    });

    xit("should show world screen after tap", async () => {
      await element(by.id("world_button")).tap();
      await captureAsync();
    });
  });
}
