package expo.modules.adapters.braze

import android.app.Application
import android.content.Context
import expo.modules.core.interfaces.ApplicationLifecycleListener
import com.appboy.AppboyLifecycleCallbackListener

class BrazeApplicationLifecycleListener(context: Context?) : ApplicationLifecycleListener {
    var context = context

    override fun onCreate(application: Application) {
        super.onCreate(application)
        application.registerActivityLifecycleCallbacks(AppboyLifecycleCallbackListener())
    }
}