import createDebug from "debug"
import { BaseTracker } from "./base"

const debug = createDebug("rentspree-tracker:ga")

/**
 * The class for Google analytic tracker
 * @param {String} options.trackingId the tracking ID for Google Analytics account
 * @extends BaseTracker
 */
export class GATracker extends BaseTracker {
  constructor(options) {
    super(options)
    debug("initialize GATracker with trackingID:%s", options.trackingId)
    this.trackingId = options.trackingId
  }
  /**
   * Static method for getting the tracker from window
   * @returns {Function | Proxy} the gtag function, if the function is not existed in window.gtag,
   * this method will return Proxy to avoid error
   * @static
   */
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
  /**
   * Track the page view by calling `gtag("config", trackingId, {page_locationi: url, page_path: path})`
   * @param {String} url the url to track, this will be passed to `page_location` key
   * @param {String} path the path, this will be passed to `page_path` key
   */
  trackPageView(url, path, ipAddress) {
    debug("track pageview for url:%s, path:%s", url, path)
    GATracker.getTracker()("config", this.trackingId, {
      page_location: url,
      page_path: path,
      ipAddress
    })
  }

  /**
   * Identify the user by calling `gtag("set", ...userObject)`
   * the `userObject` is a return from `options.mapUserProfile(profile)`
   * @param {Object} profile the profile object
   */
  identifyUser(profile) {
    debug("identify user %o", profile)
    // For UserID Tracking view
    GATracker.getTracker()("set", this.mapUserProfile(profile))
  }
  /**
   * track the event by calling `gtag("event", eventName, properties)`
   * @param {String} eventName the eventName
   * @param {Object} properties the properties to be passed to gtag
   */
  trackEvent(eventName, properties = {}) {
    debug("track event for name:%s, properties:%o", eventName, properties)
    GATracker.getTracker()("event", eventName, properties)
  }
}
