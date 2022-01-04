package expo.modules.adapters.branch

import android.content.Context
import expo.modules.core.interfaces.ApplicationLifecycleListener
import expo.modules.core.interfaces.Package
import expo.modules.core.interfaces.ReactActivityLifecycleListener

class BranchPackage : Package {
    override fun createApplicationLifecycleListeners(context: Context?): List<ApplicationLifecycleListener> {
        return listOf(BranchApplicationLifecycleListener(context))
    }
    override fun createReactActivityLifecycleListeners(activityContext: Context): List<ReactActivityLifecycleListener> {
        return listOf(BranchReactActivityLifecycleListener(activityContext))
    }
}