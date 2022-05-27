package expo.modules.adapters.airbridge

import android.app.Application
import android.content.Context
import expo.modules.core.interfaces.ApplicationLifecycleListener
// import io.branch.rnbranch.RNBranchModule

class AirbridgeApplicationLifecycleListener(context: Context?) : ApplicationLifecycleListener {
    var context = context

    override fun onCreate(application: Application) {
        super.onCreate(application)
        // RNBranchModule.getAutoInstance(this.context)
    }
}