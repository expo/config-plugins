package expo.modules.adapters.branch

import android.app.Activity
import android.content.Context
import android.content.Intent
import android.os.Bundle
import expo.modules.core.interfaces.ReactActivityLifecycleListener
import io.branch.rnbranch.RNBranchModule


class BranchReactActivityLifecycleListener(activityContext: Context) : ReactActivityLifecycleListener {
    override fun onCreate(activity: Activity, savedInstanceState: Bundle?) {
        RNBranchModule.initSession(activity.getIntent().getData(), activity);
    }

    override fun onNewIntent(intent: Intent?): Boolean {
        if (intent != null) {
            RNBranchModule.onNewIntent(intent);
        }
        return super.onNewIntent(intent)
    }
}