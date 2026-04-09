import { getTemplateFile } from "../withAndroidPerAppLanguage";

describe("getTemplateFile", () => {
  it("returns the expected XML content", () => {
    const supportedLanguages = ["en", "fr"];
    const expectedContent = `<?xml version="1.0" encoding="utf-8"?>
<locale-config xmlns:android="http://schemas.android.com/apk/res/android">
   <locale android:name="en"/>
   <locale android:name="fr"/>
</locale-config>`;
    const content = getTemplateFile(supportedLanguages);
    expect(content).toEqual(expectedContent);
  });
});
