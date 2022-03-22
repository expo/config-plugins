import { XML } from "@expo/config-plugins";

import { appendDownloadCompleteAction } from "../withReactNativeBlobUtil";

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
      /<action android:name="android\.intent\.action\.DOWNLOAD_COMPLETE"\/>/
    );

    // Doesn't mutate original.
    appendDownloadCompleteAction(manifest);
    const secondResults = XML.format(manifest);
    expect(secondResults).toMatch(firstResults);
  });
});
