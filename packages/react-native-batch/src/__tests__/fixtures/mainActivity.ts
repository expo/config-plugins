export const mainActivityFixture = `package com.poc.bam.tech;

import com.facebook.react.ReactActivity;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "BatchTest";
  }
}
`;

export const mainActivityExpectedFixture = `package com.poc.bam.tech;

import com.facebook.react.ReactActivity;
import android.content.Intent;
import com.batch.android.Batch;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "BatchTest";
  }

  @Override
  public void onNewIntent(Intent intent)
  {
      Batch.onNewIntent(this, intent);
      super.onNewIntent(intent);
  }

}
`;
