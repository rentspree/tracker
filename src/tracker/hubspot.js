import createDebug from "debug"
import { BaseTracker } from "./base"

const debug = createDebug("rentspree-tracker:hubspot")

/**
 * The class for Hubspot Analytic Tracker
 * @extends BaseTracker
 */
export class HubspotTracker extends BaseTracker {
  /**
   * Static method for getting the tracker from window
   * @returns {object | Proxy} the Hubspot tracking sdk, if the sdk is not existed in window._hsq,
   * this method will return proxy to prevent error
   * @static
   */
  static getTracker() {
    if (window && window._hsq) {
      return window._hsq
    }
    debug("return empty array for Hubspot tracker instance")
    return new Proxy(
      {},
      {
        get: () => () => {}
      }
    )
  }

  /**
   * Identify the user by calling `_hsq.push(["identify",{ email: userObject.email }])`
   * the `userObject` is a return from `options.mapUserIdentity(profile)`
   * The Hubspot identify will not immediately create the user contact in Hubspot.
   * Hubspot need to receive event or pageView after the identify to create the user contact.
   * If you want to instantly create the user contact then you need to send `instantlyCreateContact` as true from `options.mapUserIdentity(profile)`
   * @param {Object} profile the profile object
   */
  identifyUser(profile) {
    debug("identify user %o", profile)
    const userObject = this.mapUserIdentity(profile)
    debug("_hsq.push([identify], %o)", userObject)
    HubspotTracker.getTracker().push([
      "identify",
      {
        email: userObject.email
      }
    ])
    // send event to Hubspot for instantly create the contact identity when `instantlyCreateContact` is true
    if (userObject.instantlyCreateContact) {
      HubspotTracker.getTracker().push([
        "trackEvent",
        {
          id: "Identify User",
          value: userObject.email
        }
      ])
    }
  }
}
