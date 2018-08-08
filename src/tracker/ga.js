import createDebug from "debug"
import { BaseTracker } from "./base"

const debug = createDebug("rentspree-tracker:ga")
// GA tracker class to tracking the event via google analytics
export class GATracker extends BaseTracker {
  constructor(options) {
    super(options)
    debug("initialize GATracker with trackingID:%s", options.trackingId)
    this.trackingId = options.trackingId
  }
  static getTracker() {
    if (window.gtag) {
      return window.gtag
    }
    debug("return proxy object for now")
    return new Proxy(
      {},
      {
        get: () => () => {}
      }
    )
  }
  trackPageView(url, path, ipAddress) {
    debug("track pageview for url:%s, path:%s", url, path)
    GATracker.getTracker()("config", this.trackingId, {
      page_location: url,
      page_path: path,
      ipAddress
    })
  }
  identifyUser(profile) {
    debug("identify user %o", profile)
    // For UserID Tracking view
    GATracker.getTracker()("set", this.mapUserProfile(profile))
  }
  trackEvent(eventName, properties = {}) {
    debug("track event for name:%s, properties:%o", eventName, properties)
    GATracker.getTracker()("event", eventName, properties)
  }
}
