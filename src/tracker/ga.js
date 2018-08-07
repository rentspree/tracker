import { BaseTracker } from "./base"
// GA tracker class to tracking the event via google analytics
export class GATracker extends BaseTracker {
  constructor(options) {
    super(options)
    this.trackingId = options.trackingId
  }
  static getTracker() {
    if (window.gtag) {
      return window.gtag
    }
    return new Proxy(
      {},
      {
        get: () => () => {}
      }
    )
  }
  trackPageView(url, path, ipAddress) {
    GATracker.getTracker()("config", this.trackingId, {
      page_location: url,
      page_path: path,
      ipAddress
    })
  }
  identifyUser(profile) {
    // For UserID Tracking view
    GATracker.getTracker()("set", this.mapUserProfile(profile))
  }
  trackEvent(eventName, properties = {}) {
    GATracker.getTracker()("event", eventName, properties)
  }
}
