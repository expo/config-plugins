import ExpoModulesCore
import RNBranch

public class BranchAppDelegate: ExpoAppDelegateSubscriber {
  public func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey : Any]? = nil) -> Bool {
    if Bundle.main.object(forInfoDictionaryKey: "branch_test_environment") as? Bool ?? false {
      RNBranch.useTestInstance()
    }
    
    RNBranch.initSession(launchOptions: launchOptions, isReferrable: true)
    return true
  }

  public func application(_ application: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey : Any] = [:]) -> Bool {
    return RNBranch.application(application, open:url, options:options)
  }

  public func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
    return RNBranch.continue(userActivity)
  }
}
