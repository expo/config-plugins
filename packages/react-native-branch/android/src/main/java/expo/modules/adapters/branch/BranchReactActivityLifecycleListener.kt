package expo.modules.adapters.branch

import android.app.Activity
import android.content.Context
import android.os.Bundle
import expo.modules.core.interfaces.ReactActivityLifecycleListener
import io.branch.rnbranch.*

class BranchReactActivityLifecycleListener(activityContext: Context) : ReactActivityLifecycleListener {
    override fun onCreate(activity: Activity, savedInstanceState: Bundle?) {
        RNBranchModule.initSession(activity.getIntent().getData(), activity);
    }
}