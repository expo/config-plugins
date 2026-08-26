package expo.modules.adapters.braze

import android.content.Context
import expo.modules.core.interfaces.ApplicationLifecycleListener
import expo.modules.core.interfaces.Package
import expo.modules.core.interfaces.ReactActivityLifecycleListener

class BrazePackage : Package {
    override fun createApplicationLifecycleListeners(context: Context?): List<ApplicationLifecycleListener> {
        return listOf(BrazeApplicationLifecycleListener(context))
    }
    override fun createReactActivityLifecycleListeners(activityContext: Context): List<ReactActivityLifecycleListener> {
        return listOf(BrazeReactActivityLifecycleListener(activityContext))
    }
}