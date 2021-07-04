import { device } from "detox";
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

    it("should load app", async () => {
      // await expect(element(by.id("welcome"))).toBeVisible();
      await captureAsync();
    });
  });
}
