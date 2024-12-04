import { AppRestriction } from "../appRestrictionTypes";
import { generateAppRestrictionsContent } from "../generateAppRestrictionsContent";

describe("generateAppRestrictionsContent", () => {
  describe("string", () => {
    it('correctly generates XML content for "string" type restriction with all possible fields', () => {
      const restrictions: AppRestriction[] = [
        {
          key: "user_nickname",
          title: "User Nickname",
          restrictionType: "string",
          description: "The nickname of the user",
          defaultValue: "ExpoFan",
        },
      ];

      const expectedXmlContent = `<?xml version="1.0" encoding="utf-8"?>
<restrictions xmlns:android="http://schemas.android.com/apk/res/android">
<restriction
    android:key="user_nickname"
    android:title="User Nickname"
    android:restrictionType="string"
    android:description="The nickname of the user"
    android:defaultValue="ExpoFan"/>
</restrictions>`.trim();

      const generatedXmlContent =
        generateAppRestrictionsContent(restrictions).trim();

      expect(generatedXmlContent).toEqual(expectedXmlContent);
    });

    it("correctly generates XML content for 'string' type restriction with only required fields", () => {
      const restrictions: AppRestriction[] = [
        {
          key: "user_nickname",
          title: "User Nickname",
          restrictionType: "string",
        },
      ];

      const expectedXmlContent = `<?xml version="1.0" encoding="utf-8"?>
<restrictions xmlns:android="http://schemas.android.com/apk/res/android">
<restriction
    android:key="user_nickname"
    android:title="User Nickname"
    android:restrictionType="string"/>
</restrictions>`.trim();

      const generatedXmlContent =
        generateAppRestrictionsContent(restrictions).trim();

      expect(generatedXmlContent).toEqual(expectedXmlContent);
    });
  });

  describe("integer", () => {
    it("correctly generates XML content for 'integer' type restriction with all possible fields", () => {
      const restrictions: AppRestriction[] = [
        {
          key: "user_age",
          title: "User Age",
          restrictionType: "integer",
          description: "The age of the user",
          defaultValue: 25,
        },
      ];

      const expectedXmlContent = `<?xml version="1.0" encoding="utf-8"?>
<restrictions xmlns:android="http://schemas.android.com/apk/res/android">
<restriction
    android:key="user_age"
    android:title="User Age"
    android:restrictionType="integer"
    android:description="The age of the user"
    android:defaultValue="25"/>
</restrictions>`.trim();

      const generatedXmlContent =
        generateAppRestrictionsContent(restrictions).trim();

      expect(generatedXmlContent).toEqual(expectedXmlContent);
    });

    it("correctly generates XML content for 'integer' type restriction with only required fields", () => {
      const restrictions: AppRestriction[] = [
        {
          key: "user_age",
          title: "User Age",
          restrictionType: "integer",
        },
      ];

      const expectedXmlContent = `<?xml version="1.0" encoding="utf-8"?>
<restrictions xmlns:android="http://schemas.android.com/apk/res/android">
<restriction
    android:key="user_age"
    android:title="User Age"
    android:restrictionType="integer"/>
</restrictions>`.trim();

      const generatedXmlContent =
        generateAppRestrictionsContent(restrictions).trim();

      expect(generatedXmlContent).toEqual(expectedXmlContent);
    });
  });

  describe("bool", () => {
    it("correctly generates XML content for 'bool' type restriction with all possible fields", () => {
      const restrictions: AppRestriction[] = [
        {
          key: "user_is_active",
          title: "User Active",
          restrictionType: "bool",
          description: "Whether the user is active or not",
          defaultValue: true,
        },
      ];

      const expectedXmlContent = `<?xml version="1.0" encoding="utf-8"?>
<restrictions xmlns:android="http://schemas.android.com/apk/res/android">
<restriction
    android:key="user_is_active"
    android:title="User Active"
    android:restrictionType="bool"
    android:description="Whether the user is active or not"
    android:defaultValue="true"/>
</restrictions>`.trim();

      const generatedXmlContent =
        generateAppRestrictionsContent(restrictions).trim();
      expect(generatedXmlContent).toEqual(expectedXmlContent);
    });

    it("correctly generates XML content for 'bool' type restriction with only required fields", () => {
      const restrictions: AppRestriction[] = [
        {
          key: "user_is_active",
          title: "User Active",
          restrictionType: "bool",
        },
      ];

      const expectedXmlContent = `<?xml version="1.0" encoding="utf-8"?>
<restrictions xmlns:android="http://schemas.android.com/apk/res/android">
<restriction
    android:key="user_is_active"
    android:title="User Active"
    android:restrictionType="bool"/>
</restrictions>`.trim();

      const generatedXmlContent =
        generateAppRestrictionsContent(restrictions).trim();
      expect(generatedXmlContent).toEqual(expectedXmlContent);
    });
  });

  describe("hidden", () => {
    it("correctly generates XML content for 'hidden' type restriction with string type", () => {
      const restrictions: AppRestriction[] = [
        {
          key: "user_secret",
          title: "User Secret",
          restrictionType: "hidden",
          defaultValue: "4a5678",
        },
      ];

      const expectedXmlContent = `<?xml version="1.0" encoding="utf-8"?>
<restrictions xmlns:android="http://schemas.android.com/apk/res/android">
<restriction
    android:key="user_secret"
    android:title="User Secret"
    android:restrictionType="hidden"
    android:defaultValue="4a5678"/>
</restrictions>`.trim();

      const generatedXmlContent =
        generateAppRestrictionsContent(restrictions).trim();
      expect(generatedXmlContent).toEqual(expectedXmlContent);
    });

    it("correctly generates XML content for 'hidden' type restriction with integer type", () => {
      const restrictions: AppRestriction[] = [
        {
          key: "user_secret",
          title: "User Secret",
          restrictionType: "hidden",
          defaultValue: false,
        },
      ];

      const expectedXmlContent = `<?xml version="1.0" encoding="utf-8"?>
<restrictions xmlns:android="http://schemas.android.com/apk/res/android">
<restriction
    android:key="user_secret"
    android:title="User Secret"
    android:restrictionType="hidden"
    android:defaultValue="false"/>
</restrictions>`.trim();

      const generatedXmlContent =
        generateAppRestrictionsContent(restrictions).trim();
      expect(generatedXmlContent).toEqual(expectedXmlContent);
    });

    it("correctly generates XML content for 'hidden' type restriction with bool type", () => {
      const restrictions: AppRestriction[] = [
        {
          key: "user_secret",
          title: "User Secret",
          restrictionType: "hidden",
          defaultValue: 123456,
        },
      ];

      const expectedXmlContent = `<?xml version="1.0" encoding="utf-8"?>
<restrictions xmlns:android="http://schemas.android.com/apk/res/android">
<restriction
    android:key="user_secret"
    android:title="User Secret"
    android:restrictionType="hidden"
    android:defaultValue="123456"/>
</restrictions>`.trim();

      const generatedXmlContent =
        generateAppRestrictionsContent(restrictions).trim();
      expect(generatedXmlContent).toEqual(expectedXmlContent);
    });
  });

  describe("bundle and bundle_array", () => {
    it("correctly generates XML content for 'bundle' type restriction with nested restrictions", () => {
      const restrictions: AppRestriction[] = [
        {
          key: "user_settings",
          title: "User Settings",
          restrictionType: "bundle",
          restrictions: [
            {
              key: "user_theme",
              title: "User Theme",
              restrictionType: "string",
              defaultValue: "dark",
            },
            {
              key: "notifications_enabled",
              title: "Notifications Enabled",
              restrictionType: "bool",
              defaultValue: true,
            },
          ],
        },
      ];

      const expectedXmlContent = `<?xml version="1.0" encoding="utf-8"?>
<restrictions xmlns:android="http://schemas.android.com/apk/res/android">
<restriction
    android:key="user_settings"
    android:title="User Settings"
    android:restrictionType="bundle">
<restriction
    android:key="user_theme"
    android:title="User Theme"
    android:restrictionType="string"
    android:defaultValue="dark"/>
<restriction
    android:key="notifications_enabled"
    android:title="Notifications Enabled"
    android:restrictionType="bool"
    android:defaultValue="true"/>
</restriction>
</restrictions>`.trim();

      const generatedXmlContent =
        generateAppRestrictionsContent(restrictions).trim();
      expect(generatedXmlContent).toEqual(expectedXmlContent);
    });

    it("correctly generates XML content for 'bundle_array' type restriction with nested restrictions", () => {
      const restrictions: AppRestriction[] = [
        {
          key: "user_accounts",
          title: "User Accounts",
          restrictionType: "bundle_array",
          restrictions: [
            {
              key: "account_1",
              title: "Account 1",
              restrictionType: "bundle",
              restrictions: [
                {
                  key: "username",
                  title: "Username",
                  restrictionType: "string",
                  defaultValue: "user1",
                },
                {
                  key: "active",
                  title: "Active",
                  restrictionType: "bool",
                  defaultValue: true,
                },
              ],
            },
            {
              key: "account_2",
              title: "Account 2",
              restrictionType: "bundle",
              restrictions: [
                {
                  key: "username",
                  title: "Username",
                  restrictionType: "string",
                  defaultValue: "user2",
                },
                {
                  key: "active",
                  title: "Active",
                  restrictionType: "bool",
                  defaultValue: false,
                },
              ],
            },
          ],
        },
      ];

      const expectedXmlContent = `<?xml version="1.0" encoding="utf-8"?>
<restrictions xmlns:android="http://schemas.android.com/apk/res/android">
<restriction
    android:key="user_accounts"
    android:title="User Accounts"
    android:restrictionType="bundle_array">
<restriction
    android:key="account_1"
    android:title="Account 1"
    android:restrictionType="bundle">
<restriction
    android:key="username"
    android:title="Username"
    android:restrictionType="string"
    android:defaultValue="user1"/>
<restriction
    android:key="active"
    android:title="Active"
    android:restrictionType="bool"
    android:defaultValue="true"/>
</restriction>
<restriction
    android:key="account_2"
    android:title="Account 2"
    android:restrictionType="bundle">
<restriction
    android:key="username"
    android:title="Username"
    android:restrictionType="string"
    android:defaultValue="user2"/>
<restriction
    android:key="active"
    android:title="Active"
    android:restrictionType="bool"
    android:defaultValue="false"/>
</restriction>
</restriction>
</restrictions>`.trim();

      const generatedXmlContent =
        generateAppRestrictionsContent(restrictions).trim();
      expect(generatedXmlContent).toEqual(expectedXmlContent);
    });
  });

  describe("choice", () => {
    it("correctly generates XML content for 'choice' type restriction with all fields", () => {
      const restrictions: AppRestriction[] = [
        {
          key: "user_color_preference",
          title: "User Color Preference",
          restrictionType: "choice",
          description: "The preferred color theme for the user interface",
          entries: ["Light", "Dark", "System default"],
          entryValues: ["light", "dark", "default"],
          defaultValue: "default",
        },
      ];

      const expectedXmlContent = `<?xml version="1.0" encoding="utf-8"?>
<restrictions xmlns:android="http://schemas.android.com/apk/res/android">
<restriction
    android:key="user_color_preference"
    android:title="User Color Preference"
    android:restrictionType="choice"
    android:description="The preferred color theme for the user interface"
    android:defaultValue="default"
    android:entries="Light|Dark|System default"
    android:entryValues="light|dark|default"/>
</restrictions>`.trim();

      const generatedXmlContent =
        generateAppRestrictionsContent(restrictions).trim();
      expect(generatedXmlContent).toEqual(expectedXmlContent);
    });
  });

  describe("multi-select", () => {
    it("correctly generates XML content for 'multi-select' type restriction with all fields", () => {
      const restrictions: AppRestriction[] = [
        {
          key: "user_interests",
          title: "User Interests",
          restrictionType: "multi-select",
          description: "The interests selected by the user",
          entries: ["Technology", "Sports", "Arts", "Science"],
          entryValues: ["tech", "sports", "arts", "science"],
          defaultValue: ["tech", "science"],
        },
      ];

      const expectedXmlContent = `<?xml version="1.0" encoding="utf-8"?>
<restrictions xmlns:android="http://schemas.android.com/apk/res/android">
<restriction
    android:key="user_interests"
    android:title="User Interests"
    android:restrictionType="multi-select"
    android:description="The interests selected by the user"
    android:defaultValue="tech|science"
    android:entries="Technology|Sports|Arts|Science"
    android:entryValues="tech|sports|arts|science"/>
</restrictions>`.trim();

      const generatedXmlContent =
        generateAppRestrictionsContent(restrictions).trim();
      expect(generatedXmlContent).toEqual(expectedXmlContent);
    });
  });
});
