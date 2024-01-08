import createDebug from "debug"
import { BaseTracker } from "./base"

const debug = createDebug("rentspree-tracker:gtm")

/**
 * The class for Google Tag Manager tracker
 * @param {String} options.trackingId the tracking ID for Google Tag Manager account
 * @param {String | undefined} options.userId the user ID of the current user associated with this tracker instance, may be undefined
 * @extends BaseTracker
 */
export class GTMTracker extends BaseTracker {
  constructor(options) {
    super(options)
    debug("initialize GTMTracker with trackingID:%s", options.trackingId)
    this.trackingId = options.trackingId
    this.userId = options.userId
  }
  /**
   * Static method for getting the GTM tracker
   * @returns {Function | Proxy} the GTM data layer instance if it exists,
   * this method will return Proxy to avoid error
   */
  static getTracker() {
    if (window.dataLayer) {
      return window.dataLayer
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
   * identify the user and set the userId attribute`
   * the `userObject` is returned from `options.mapUserProfile(profile)`
   * @param {Object} profile the profile object
   */
  identifyUser(profile) {
    debug("identify user %o", profile)
    const mappedProfile = this.mapUserProfile(profile)
    this.userId = mappedProfile.id
  }

  /**
   * track the event by calling dataLayer.push({ userId, event: eventName, properties })
   * @param {String} eventName the event's name
   * @param {Object} properties the properties to be passed to data layer
   */
  trackEvent(eventName, properties = {}) {
    debug(
      "GTM track event for name:%s, properties:%o",
      eventName,
      properties
    )
    const dataLayer = GTMTracker.getTracker()
    dataLayer.push({ userId: this.userId, event: eventName, properties })
  }
}
