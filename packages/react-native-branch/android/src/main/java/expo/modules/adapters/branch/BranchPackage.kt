package expo.modules.adapters.branch

import android.content.Context
import expo.modules.core.BasePackage
import expo.modules.core.interfaces.ApplicationLifecycleListener
import expo.modules.core.interfaces.ReactActivityLifecycleListener

class BranchPackage : BasePackage() {
    override fun createApplicationLifecycleListeners(context: Context?): MutableList<ApplicationLifecycleListener> {
        return mutableListOf(BranchApplicationLifecycleListener(context))
    }
    override fun createReactActivityLifecycleListeners(activityContext: Context): List<ReactActivityLifecycleListener> {
        return listOf(BranchReactActivityLifecycleListener(activityContext))
    }
}