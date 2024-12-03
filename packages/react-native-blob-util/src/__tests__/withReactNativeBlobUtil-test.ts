import { XML } from "expo/config-plugins";

import {
  ensureBlobProviderAuthorityString,
  appendDownloadCompleteAction,
  ensureBlobProviderManifest,
} from "../withReactNativeBlobUtil";

const fixture = `
<manifest xmlns:android="http://schemas.android.com/apk/res/android" package="com.bacon.yolo68">
  <application android:name=".MainApplication" android:label="@string/app_name" android:icon="@mipmap/ic_launcher" android:roundIcon="@mipmap/ic_launcher_round" android:allowBackup="true" android:theme="@style/AppTheme" android:usesCleartextTraffic="true">
    <activity android:name=".MainActivity" android:label="@string/app_name" android:configChanges="keyboard|keyboardHidden|orientation|screenSize|uiMode" android:launchMode="singleTask" android:windowSoftInputMode="adjustResize" android:theme="@style/Theme.App.SplashScreen" android:screenOrientation="portrait">
      <intent-filter>
        <action android:name="android.intent.action.MAIN"/>
        <category android:name="android.intent.category.LAUNCHER"/>
      </intent-filter>
      <intent-filter>
        <action android:name="android.intent.action.VIEW"/>
        <category android:name="android.intent.category.DEFAULT"/>
        <category android:name="android.intent.category.BROWSABLE"/>
        <data android:scheme="com.bacon.yolo68"/>
      </intent-filter>
    </activity>
    <activity android:name="com.facebook.react.devsupport.DevSettingsActivity"/>
  </application>
</manifest>`;

describe(appendDownloadCompleteAction, () => {
  it("should return manifest", async () => {
    const manifest = (await XML.parseXMLAsync(fixture)) as any;
    appendDownloadCompleteAction(manifest);
    const firstResults = XML.format(manifest);
    expect(firstResults).toMatchSnapshot();
    expect(firstResults).toMatch(
      /<action android:name="android\.intent\.action\.DOWNLOAD_COMPLETE"\/>/,
    );

    // Doesn't mutate original.
    appendDownloadCompleteAction(manifest);
    const secondResults = XML.format(manifest);
    expect(secondResults).toMatch(firstResults);
  });
});

describe(ensureBlobProviderManifest, () => {
  it("should ensure the provider is added", async () => {
    const manifest = (await XML.parseXMLAsync(fixture)) as any;

    const first = XML.format(ensureBlobProviderManifest(manifest));
    expect(first).toContain(
      '<provider android:name="com.facebook.react.modules.blob.BlobProvider" android:authorities="@string/blob_provider_authority" android:exported="false"/>',
    );

    // Doesn't add duplicates
    expect(
      XML.format(
        ensureBlobProviderManifest(ensureBlobProviderManifest(manifest)),
      ),
    ).toEqual(first);
  });
});

describe(ensureBlobProviderAuthorityString, () => {
  it("should ensure provider", async () => {
    const res = ensureBlobProviderAuthorityString(
      { resources: {} },
      "app.bacon",
    );
    const result = XML.format(res);
    expect(result).toMatchInlineSnapshot(`
      "<resources>
        <string name="blob_provider_authority">app.bacon</string>
      </resources>"
    `);

    const next = ensureBlobProviderAuthorityString(res, "app.bacon");
    expect(XML.format(next)).toBe(result);

    expect(XML.format(ensureBlobProviderAuthorityString(next, "com.other")))
      .toMatchInlineSnapshot(`
      "<resources>
        <string name="blob_provider_authority">com.other</string>
      </resources>"
    `);
  });
});
