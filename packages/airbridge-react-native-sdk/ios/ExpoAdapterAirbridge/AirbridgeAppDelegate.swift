import ExpoModulesCore
import AirbridgeRN

public class AirbridgeAppDelegate: ExpoAppDelegateSubscriber {
  public func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey : Any]? = nil) -> Bool {
    AirbridgeRN.getInstance("YOUR_APP_TOKEN", appName:"YOUR_APP_NAME", withLaunchOptions:launchOptions)
    // RNBranch.initSession(launchOptions: launchOptions, isReferrable: true)
    return true
  }

  // public func application(_ application: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey : Any] = [:]) -> Bool {
  //   return RNBranch.application(application, open:url, options:options)
  // }

  // public func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
  //   return RNBranch.continue(userActivity)
  // }
}
