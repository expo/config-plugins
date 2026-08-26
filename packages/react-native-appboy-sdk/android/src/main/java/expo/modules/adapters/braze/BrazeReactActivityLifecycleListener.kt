package expo.modules.adapters.braze

import android.app.Activity
import android.content.Context
import android.content.Intent
import android.os.Bundle
import expo.modules.core.interfaces.ReactActivityLifecycleListener


class BrazeReactActivityLifecycleListener(activityContext: Context) : ReactActivityLifecycleListener {
    private var activity: Activity? = null
    override fun onCreate(activity: Activity, savedInstanceState: Bundle?) {
        this.activity = activity
    }

    override fun onNewIntent(intent: Intent?): Boolean {
        var result = super.onNewIntent(intent)
        activity?.intent = intent
        return result
    }
}