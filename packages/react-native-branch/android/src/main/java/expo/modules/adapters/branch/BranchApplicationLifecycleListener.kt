package expo.modules.adapters.branch

import android.app.Application
import android.content.Context
import expo.modules.core.interfaces.ApplicationLifecycleListener
import io.branch.rnbranch.RNBranchModule

class BranchApplicationLifecycleListener(context: Context?) : ApplicationLifecycleListener {
    var context = context

    override fun onCreate(application: Application) {
        super.onCreate(application)
        RNBranchModule.getAutoInstance(this.context)
    }
}