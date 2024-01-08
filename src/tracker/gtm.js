import createDebug from "debug"
import { BaseTracker } from "./base"
import has from "lodash/has"

const debug = createDebug("rentspree-tracker:gtm")

/**
 * The class for Google Tag Manager tracker
 * @param {String} options.trackingId the tracking ID for Google Tag Manager account
 * @extends BaseTracker
 */
export class GTMTracker extends BaseTracker {
  constructor(options) {
    super(options)
    debug("initialize GTMTracker with trackingID:%s", options.trackingId)
    this.trackingId = options.trackingId
  }
  /**
   * Static method for getting the GTM tracker
   * @returns {Function | Proxy} the amplitude instance if it exist,
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

  getSpecificDataLayer() {
    if (has(window, `google_tag_manager.${this.trackingId}.dataLayer`)) {
      return window['google_tag_manager'][this.trackingId].dataLayer
    }
    return undefined
  } 

  /**
   * identify the user and set it to data layer by calling `window['google_tag_manager'][this.trackingId].dataLayer.set('userId', mappedProfile.userId)`
   * the `userObject` is a return from `options.mapUserProfile(profile)`
   * @param {Object} profile the profile object
   */
  identifyUser(profile) {
    debug("identify user %o", profile)
    const mappedProfile = this.mapUserProfile(profile)
    const specificDataLayer = this.getSpecificDataLayer()
    if (specificDataLayer) {
      specificDataLayer.set('userId', mappedProfile.userId)
    }
  }

  /**
   * retrieves the set userId from data layer
   */
  getUserIdFromDataLayer() {
    const specificDataLayer = this.getSpecificDataLayer()
    if (specificDataLayer) {
      return specificDataLayer.get('userId')
    }
    return undefined
  }

  /**
   * track the event by calling `logEvent("event name here", properties)`
   * @param {String} eventName the eventName
   * @param {Object} properties the properties to be passed to amplitude
   */
  trackEvent(eventName, properties = {}) {
    debug(
      "GTM track event for name:%s, properties:%o",
      eventName,
      properties
    )
    const dataLayer = GTMTracker.getTracker()
    const userId = this.getUserIdFromDataLayer()
    dataLayer.push({ event: eventName, properties: { userId, ...properties } })
  }
}
