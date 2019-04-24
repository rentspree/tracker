import createDebug from "debug"
import { BaseTracker } from "./base"

const debug = createDebug("rentspree-tracker:amplitude")

/**
 * The class for Amplitude tracker
 * @param {String} options.amplitudeSDK the amplitude SDK
 * @param {String} options.apiKey the api key of amplitude
 * @extends BaseTracker
 */
export class AmplitudeTracker extends BaseTracker {
  constructor(options) {
    super(options)
    this.amplitudeSDK = options.amplitudeSDK
    this.apiKey = options.apiKey
    if (this.amplitudeSDK && this.apiKey) {
      debug("initialize Amplitude for Instance %o", options.amplitudeSDK)
      debug("initialize Amplitude Instance for API KEY %o", options.apiKey)
      this.getTracker().init(this.apiKey)
    }
  }
  /**
   * Static method for getting the amplitude tracker
   * @returns {Function | Proxy} the amplitude instance if it exist,
   * this method will return Proxy to avoid error
   * @static
   */
  getTracker() {
    if (this.amplitudeSDK) {
      debug("return amplitude instance")
      return this.amplitudeSDK.getInstance()
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
   * Identify the user by calling `setUserId(userId)`
   * the `userId` is a return from `options.mapUserProfile(profile)`
   * @param {Object} profile the profile object
   */
  identifyUser(profile) {
    debug("identify user %o", profile)
    const mappedProfile = this.mapUserProfile(profile)
    debug("amplitude.setUserId(%s)", mappedProfile)
    this.getTracker().setUserId(mappedProfile)
  }

  /**
   * track the event by calling `logEvent("event name here", properties)`
   * @param {String} eventName the eventName
   * @param {Object} properties the properties to be passed to amplitude
   */
  trackEvent(eventName, properties = {}) {
    debug(
      "amplitude track event for name:%s, properties:%o",
      eventName,
      properties
    )
    this.getTracker().logEvent(eventName, properties)
  }
}
