import Appboy_iOS_SDK
import ExpoModulesCore
import SystemConfiguration

public class BrazeAppDelegate: ExpoAppDelegateSubscriber {
  public func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey : Any]? = nil) -> Bool {
    let braze = Bundle.main.object(forInfoDictionaryKey: "Braze")
    Appboy.start(withApiKey: braze.ApiKey, in:application, withLaunchOptions:launchOptions)
    return true
  }

  public func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
    Appboy.sharedInstance()?.registerDeviceToken(deviceToken)
  }

  public func application(
    _ application: UIApplication,
    didReceiveRemoteNotification userInfo: [AnyHashable: Any],
    fetchCompletionHandler completionHandler: @escaping (UIBackgroundFetchResult) -> Void
  ) {
    Appboy.sharedInstance()?.register(application,
          didReceiveRemoteNotification: userInfo,
                fetchCompletionHandler: completionHandler)
  }

  // public func application(_ application: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey : Any] = [:]) -> Bool {
  //   return false
  // }

  // public func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
  //   return false
  // }
}
